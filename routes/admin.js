const path = require('path')

const express = require('express');

const router = express.Router();

const AdminController = require('../controllers/admin');

// /admin/add-product
router.get('/add-product',AdminController.getAddProductPage);

router.post('/add-product',AdminController.postAddProductPage);

router.get('/edit-product/:productId',AdminController.getEditProductPage);

router.get('/products',AdminController.AdminProducts);

module.exports = router;