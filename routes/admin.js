const path = require('path')

const express = require('express');

const router = express.Router();

const products  = [];

// /admin/add-product
router.get('/add-product',(req, res, next) => {
    console.log("Sending add product page");
    // res.send('<form action="/admin/add-product" method="POST"><input type="text" name="title"><input type="text" name="weight"><button type="submit">Add Product</button></form>');
    // res.sendFile(path.join(__dirname,'../','views','add-product.html'));
    res.render('add-product',{pageTitle:"Admin - Add Product"});
});

router.post('/add-product',(req,res,next)=>{
    console.log('Product request Received. Redirecting to Shop Page..');
    // console.log(req.body);
    products.push({ title: req.body.title });
    res.redirect('/');
});

exports.router = router;
exports.products = products;