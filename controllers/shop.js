const items = require("../models/product");

exports.getProducts = (req, res, next) => {
  items.fetchAll((listOfProducts) => {
    res.render("shop/product-list", {
      prods: listOfProducts,
      pageTitle: "All Products",
      path: "/products"
    });
  });
};

exports.getCartItems = (req, res, next) => {
  res.render("shop/cart", {
    pageTitle: "Your Cart",
    path: "/cart",
  });
};

exports.getCheckoutPage = (req, res, next) => {
  res.render("shop/checkout", {
    pageTitle: "Checkout",
    path: "/checkout",
  });
};

exports.getIndexPage = (req, res, next) => {
  res.render("shop/index", {
    pageTitle: "Home",
    path: "/",
  });
};

exports.getProductDetails = (req, res, next) => {
  res.render("shop/product-detail", {
    pageTitle: "Product Details",
    path: "/product-details",
  });
};
