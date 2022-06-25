const path = require('path');

const express = require("express");
const router = express.Router();

const ProductController = require('../controllers/products');

router.get("/", ProductController.getProducts);

module.exports = router;
