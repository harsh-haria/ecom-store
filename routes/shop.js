const path = require('path');

const express = require("express");
const router = express.Router();

const shopController = require('../controllers/shop');

router.get("/", shopController.getIndexPage);

router.get('/cart', shopController.getCartItems);

router.post('/cart', shopController.postCart);

router.post('/delete-item-cart', shopController.postCartDeleteProduct);

router.get('/orders', shopController.getOrders);

router.get('/checkout', shopController.getCheckoutPage);

router.get('/products', shopController.getProducts);

router.get('/products/:productId',shopController.getProduct);

router.get('/prod-details', shopController.getProductDetails);

module.exports = router;
