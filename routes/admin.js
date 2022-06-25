const path = require('path')

const express = require('express');

const router = express.Router();

const ProductController = require('../controllers/products');

// /admin/add-product
router.get('/add-product',ProductController.getAddProduct);

router.post('/add-product',ProductController.postAddProduct);

module.exports = router;