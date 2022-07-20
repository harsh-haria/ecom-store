const path = require('path')

const express = require('express');

const router = express.Router();

const AdminController = require('../controllers/admin');

router.get('/products',AdminController.AdminProducts);

router.get('/add-product',AdminController.getAddProductPage);

router.post('/add-product',AdminController.postAddProductPage);

router.get('/edit-product/:productId',AdminController.getEditProductPage);

router.post('/edit-product',AdminController.postEditProduct);

router.post('/delete-product',AdminController.postDeleteProduct);


module.exports = router;