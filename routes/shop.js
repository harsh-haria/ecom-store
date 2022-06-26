const path = require('path');

const express = require("express");
const router = express.Router();

const shopController = require('../controllers/shop');

router.get("/", shopController.getIndexPage);

router.get('/cart', shopController.getCartItems);

router.get('/checkout', shopController.getCheckoutPage);

router.get('/products', shopController.getProducts);

router.get('/prod-details', shopController.getProductDetails);

module.exports = router;
