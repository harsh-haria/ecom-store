const path = require('path')

const express = require('express');

const router = express.Router();

const AdminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');

router.get('/products', isAuth, AdminController.AdminProducts);

router.get('/add-product', isAuth, AdminController.getAddProductPage);

router.post('/add-product', isAuth, AdminController.postAddProductPage);

router.get('/edit-product/:productId', isAuth, AdminController.getEditProductPage);

router.post('/edit-product', isAuth, AdminController.postEditProduct);

router.post('/delete-product', isAuth, AdminController.postDeleteProduct);


module.exports = router;