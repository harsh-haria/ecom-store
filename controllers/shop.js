const items = require("../models/product");
const Cart = require("../models/cart");
const Products = require("../models/product");
const Product = require("../models/product");

exports.getProducts = (req, res, next) => {
  items
    .findAll()
    .then((data) => {
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

  //option 1
  // Products.findByPk(prodId)
  //   .then(product=>{
  //     res.render("shop/product-detail", {
  //       pageTitle: "Product Details",
  //       path: "/product-details",
  //       product: product
  //     });
  //   })
  //   .catch(err => {
  //     console.log(err);
  //   });

  //option 2
  Products.findAll({
    where:{
      id:prodId
    }
  })
    .then(products => {
      res.render("shop/product-detail", {
        pageTitle: products[0].title, 
        path: "/product-details",
        product: products[0] //where clause sends an array so we have to select first element of the array
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getCartItems = (req, res, next) => {
  // Cart.getCart((cart) => {
  //   Products.fetchAll((products) => {
  //     let cartProducts = [];
  //     for (let product of products) {
  //       const cartProductData = cart.products.find(
  //         (prod) => prod.id === product.id
  //       );
  //       if (cartProductData) {
  //         cartProducts.push({
  //           productData: product,
  //           quantity: cartProductData.qty,
  //         });
  //       }
  //     }
  //     res.render("shop/cart", {
  //       pageTitle: "Your Cart",
  //       path: "/cart",
  //       prods: cartProducts,
  //     });
  //   });
  // });
  req.user
    .getCart()
    .then(cart => {
      return cart
        .getProducts()
        .then(products=>{
          res.render("shop/cart", {
            pageTitle: "Your Cart",
            path: "/cart",
            prods: products,
          });
        })
        .catch();
    })
    .catch();
};

exports.postCartDeleteProduct = (req, res, post) => {
  const prodId = req.body.productId;
  
  req.user
    .getCart()
    .then(cart => {
      return cart.getProducts({where: {id:prodId}});
    })
    .then((products)=>{
      let product = products[0];
      return product.cartItem.destroy();
    })
    .then(result => {
      res.redirect('/cart');
    })
    .catch(err => console.log(err));
    // Products.findById(prodId, (product) => {
    //   Cart.deleteProduct(prodId, product.price);
    //   res.redirect("/cart");
    // });
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  let fetchedCart;
  let newQuantity = 1;
  req.user
    .getCart()
    .then(cart => {
      fetchedCart = cart;
      return cart.getProducts({ where: { id: prodId } });
    })
    .then(products => {
      let product;
      if(products.length>0){
        product = products[0];
      }
      if(product){
        // will do this later
        let oldQuantity = product.cartItem.quantity;
        newQuantity = oldQuantity + 1;
        return product;
      }
      return Product.findByPk(prodId);
    })
    .then((product)=>{
      return fetchedCart.addProduct(product, {through: { quantity: newQuantity }});
    })
    .then(()=>{
      res.redirect('/cart');
    })
    .catch();
};

exports.getOrders = (req, res, next) => {
  res.render("shop/orders", {
    pageTitle: "Your Orders",
    path: "/orders",
  });
};

exports.getCheckoutPage = (req, res, next) => {
  res.render("shop/checkout", {
    pageTitle: "Checkout",
    path: "/checkout",
  });
};

exports.getIndexPage = (req, res, next) => {
  items
    .findAll()
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

exports.getProductDetails = (req, res, next) => {
  res.render("shop/product-detail", {
    pageTitle: "Product Details",
    path: "/product-details",
  });
};
