const Product = require("../models/product");
const Order = require('../models/order');

exports.getIndexPage = (req, res, next) => {
  Product
    .find()
    .then((data) => {
      res.render("shop/index", {
        product: data,
        pageTitle: "Home",
        path: "/",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};


exports.getProducts = (req, res, next) => {
  Product
    .find() //with find we can also use another method select() or unselect()
    // .select('title price -_id ')
    // .populate('userId','name address') //without this the userId will be printed as it is. with this we can get other data associated along with the userID
    .then((data) => {
      console.log(data);
      res.render("shop/product-list", {
        product: data,
        pageTitle: "All Products",
        path: "/products",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};


exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then(products => {
      res.render("shop/product-detail", {
        pageTitle: products.title, 
        path: "/product-details",
        product: products
      });
    })
    .catch((err) => {
      console.log(err);
    });
};


exports.getCart = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    .then(user => {
      let products = user.cart.items;
      res.render("shop/cart", {
        pageTitle: "Your Cart",
        path: "/cart",
        prods: products,
      });
    })
    .catch(err => console.log(err));
};


exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then(product => {
      return req.user.addToCart(product);
    })
    .then(result => {
      console.log(result);
      res.redirect('/cart');
    });
};


exports.postCartDeleteProduct = (req, res, post) => {
  const prodId = req.body.productId;
  req.user
    .removeFromCart(prodId)
    .then(result => {
      res.redirect('/cart');
    })
    .catch(err => console.log(err));
};


exports.getOrders = (req, res, next) => {
  Order.find({'user.userId':req.user._id})
    .then(orders => {
      res.render("shop/orders", {
        pageTitle: "Your Orders",
        path: "/orders",
        orders: orders
      });
    })
    .catch((err) => console.log(err));
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
          name: req.user.name,
          email: req.user.email,
          address: req.user.address,
          userId: req.user,
        },
        products: products,
      });
      return order.save();
    })
    .then((result) => {
      // console.log(result);
      return req.user.clearCart();
    })
    .then( () => {
      res.redirect("/orders");
    })
    .catch((err) => console.log(err));
};

