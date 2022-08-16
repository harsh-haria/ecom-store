const fs = require("fs");
const path = require("path");

const stripeKey = require("../util/database").stripeSecretKey;

const stripe = require("stripe")(stripeKey);

const PDFDocument = require("pdfkit");

const Product = require("../models/product");
const Order = require("../models/order");

const rootdir = require("../util/path");

const ITEMS_PER_PAGE = 2;

exports.getIndexPage = (req, res, next) => {
  // res.setHeader('Set-Cookie','loggedIn=false');
  const page = +req.query.page || 1;
  let totalItems;
  Product.find()
    .countDocuments()
    .then((numProducts) => {
      totalItems = numProducts;
      return Product.find()
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);
    })
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
        totalProducts: totalItems,
        currentPage: page,
        hasNextPage: ITEMS_PER_PAGE * page < totalItems,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
      });
    })
    .catch((err) => {
      console.log(err);
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getProducts = (req, res, next) => {
  Product.find() //with find we can also use another method select() or unselect()
    // .select('title price -_id ')
    // .populate('userId','name address') //without this the userId will be printed as it is. with this we can get other data associated along with the userID
    .then((data) => {
      // console.log(data);
      res.render("shop/product-list", {
        product: data,
        pageTitle: "All Products",
        path: "/products",
      });
    })
    .catch((err) => {
      // console.log(err);
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then((products) => {
      res.render("shop/product-detail", {
        pageTitle: products.title,
        path: "/product-details",
        product: products,
      });
    })
    .catch((err) => {
      // console.log(err);
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getCart = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .then((user) => {
      let products = user.cart.items;
      res.render("shop/cart", {
        pageTitle: "Your Cart",
        path: "/cart",
        prods: products,
      });
    })
    .catch((err) => {
      // console.log(err);
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then((product) => {
      return req.user.addToCart(product);
    })
    .then((result) => {
      console.log(result);
      res.redirect("/cart");
    })
    .catch((err) => {
      // console.log(err);
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postCartDeleteProduct = (req, res, post) => {
  const prodId = req.body.productId;
  req.user
    .removeFromCart(prodId)
    .then((result) => {
      res.redirect("/cart");
    })
    .catch((err) => {
      // console.log(err);
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getCheckout = (req, res, next) => {
  let total;
  let products;
  req.user
    .populate("cart.items.productId")
    .then((user) => {
      total = 0;
      products = user.cart.items;
      products.forEach((p) => {
        total += p.quantity * p.productId.price;
      });
      return stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: products.map(p => {
          return {
            
            price_data: {
              currency: 'inr',
              unit_amount: p.productId.price * 100,
              product_data: {
                name: p.productId.title,
                description: p.productId.details,
              },
            },
            quantity: p.quantity,
          };
        }),
        mode: 'payment',
        success_url: req.protocol + '://' + req.get('host') + '/checkout/success',
        cancel_url: req.protocol + '://' + req.get('host') + '/checkout/cancel'
      });
    })
    .then((session) => {
      res.render("shop/checkout", {
        pageTitle: "Checkout",
        path: "/checkout",
        products: products,
        totalSum: total,
        sessionId: session.id
      });
    })
    .catch((err) => {
      console.log(err);
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getOrders = (req, res, next) => {
  Order.find({ "user.userId": req.user._id })
    .then((orders) => {
      res.render("shop/orders", {
        pageTitle: "Your Orders",
        path: "/orders",
        orders: orders,
      });
    })
    .catch((err) => {
      // console.log(err);
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postOrder = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .then((user) => {
      const products = user.cart.items.map((i) => {
        return { quantity: i.quantity, product: { ...i.productId._doc } };
      });
      const order = new Order({
        user: {
          email: req.user.email,
          address: req.user.address,
          userId: req.user,
          // password: "NULL"
        },
        products: products,
      });
      return order.save();
    })
    .then((result) => {
      // console.log(result);
      return req.user.clearCart();
    })
    .then(() => {
      res.redirect("/orders");
    })
    .catch((err) => {
      // console.log(err);
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getInvoice = (req, res, next) => {
  const orderId = req.params.orderId;
  Order.findById(orderId)
    .then((order) => {
      if (!order) {
        return next(new Error("No order Found!"));
      }
      if (order.user.userId.toString() !== req.user._id.toString()) {
        return next(new Error("Unauthorized access!"));
      }
      const invoiceName = "invoice-" + orderId + ".pdf";
      const invoicePath = path.join("data", "invoices", invoiceName);

      const pdfDoc = new PDFDocument();
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        'inline; filename="' + invoiceName + '"'
      );
      pdfDoc.pipe(fs.createWriteStream(invoicePath)); //stores the file in server as well
      pdfDoc.pipe(res); //send to client as well in res writable stream.
      //now lets generate the document!
      //pdfkit.org to check the documentation
      pdfDoc.fontSize(26).text("Invoice", {
        align: "center",
        underline: true,
      });
      pdfDoc.text("---------------------------------------", {
        align: "center",
      });
      let totalPrice = 0;
      let count = 1;
      order.products.forEach((prod) => {
        totalPrice += prod.product.price * prod.quantity;
        pdfDoc
          .fontSize(14)
          .text(
            count +
              ". " +
              prod.product.title +
              "   ->   " +
              prod.quantity +
              "   X   " +
              "$" +
              prod.product.price,
            {
              align: "center",
            }
          );
        count++;
      });
      pdfDoc.fontSize(26).text("---------------------------------------", {
        align: "center",
      });
      pdfDoc.fontSize(18).text("Total Price: $" + totalPrice, {
        align: "center",
      });

      pdfDoc.end();
      //the method below is used when files are really small.
      //this method loads the entire file in memory and then sends it
      // consider other methods for large files
      // fs.readFile(invoicePath, (err, data) => {
      //   if (err) {
      //     return next(err);
      //   }
      //   res.setHeader("Content-Type", "application/pdf");
      //   res.setHeader(
      //     "Content-Disposition",
      //     'inline; filename="' + invoiceName + '"'
      //   );
      //   res.send(data);
      // });

      //here small bits are passed to the browser as soon as we read them.
      //no need to wait for all the data to come and then concatinate for sending.
      //as soon as data is received it is send to the browser and then browser can concatinate.
      // const file = fs.createReadStream(invoicePath);
      // res.setHeader('Content-Type','application/pdf');
      // res.setHeader('Content-Disposition', 'inline; filename="'+ invoiceName +'"');
      // file.pipe(res); //res is a writeable stream vid330
    })
    .catch((err) => console.log(err));
};
