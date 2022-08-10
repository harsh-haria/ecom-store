const path = require('path');

const express = require("express");
const router = express.Router();

const shopController = require('../controllers/shop');
const isAuth = require("../middleware/is-auth");

router.get("/", shopController.getIndexPage);

router.get('/products', shopController.getProducts);

router.get('/products/:productId',shopController.getProduct);

router.get('/cart', shopController.getCart);

router.post('/cart', shopController.postCart);

router.post('/delete-item-cart', shopController.postCartDeleteProduct);

router.get('/orders', shopController.getOrders);

router.post('/create-order', shopController.postOrder);

router.get('/orders/:orderId',  isAuth, shopController.getInvoice);

module.exports = router;
