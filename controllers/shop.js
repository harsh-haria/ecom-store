const Product = require("../models/product");
// const Cart = require('../models/cart');

exports.getProducts = (req, res, next) => {
  Product
    .fetchAll()
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
  Product.findById(prodId)
    .then(products => {
      res.render("shop/product-detail", {
        pageTitle: products.title, 
        path: "/product-details",
        product: products //where clause sends an array so we have to select first element of the array
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getCartItems = (req, res, next) => {
  req.user
    .getCart()
    .then(products => {
      res.render("shop/cart", {
        pageTitle: "Your Cart",
        path: "/cart",
        prods: products,
      });
    })
    .catch(err => console.log(err));
};

exports.postCartDeleteProduct = (req, res, post) => {
  const prodId = req.body.productId;
  req.user
    .deleteItemFromCart(prodId)
    .then(result => {
      res.redirect('/cart');
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

exports.getOrders = (req, res, next) => {
  req.user
    .getOrders()
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
  let fetchedCart;
  req.user
    .addOrder()
    .then(result => {
      console.log(result);
      res.redirect('/orders');
    })
    .catch((err) => console.log(err));
};

exports.getIndexPage = (req, res, next) => {
  Product
    .fetchAll()
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

