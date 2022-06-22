const path = require('path');

const express = require("express");

const rootDir = require('../util/path');

const router = express.Router();

const adminData  = require('./admin');

router.get("/", (req, res, next) => {
  // res.send("<h1>Base Page or Product Added</h1>");
  console.log('Sending Shop Page');
  products = adminData.products;
  console.log('shop.js=>',products);
  // res.sendFile(path.join(rootDir, 'views', 'shop.html'));
  res.render("shop", {
    prods: products,
    pageTitle: "SHOP",
    path: "/",
    hasProducts: adminData.products.length > 0,
    activeShop: true,
    productCSS: true,
    layout: "/layouts/main-layout"
  });
});

module.exports = router;
