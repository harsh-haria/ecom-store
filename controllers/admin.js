const fs = require('fs');
const path = require('path');

const rootDir = require('../util/path');
const p = path.join(rootDir,'data','products.json');

const Product = require("../models/product");
const { TIMEOUT } = require('dns');

exports.getAddProductPage = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Admin - Add Product",
    path: "/admin/add-product",
    editing: false
  });
};

exports.postAddProductPage = (req, res, next) => {
  Product.create({
    title: req.body.title,
    imageUrl: req.body.imageUrl,
    price: req.body.price,
    details: req.body.details
  }).then(result =>{
    // console.log(result);
    console.log('Product creation complete');
    res.redirect('/admin/products');
  }).catch(err => {
    console.log(err);
  })
};

exports.getEditProductPage = (req, res, next) => {
  const editMode = req.query.edit;
  if(!editMode){
    console.log('no edit mode found');
    return res.redirect('/');
  }
  const productId = req.params.productId;
  Product.findByPk(productId)
    .then(product => {
    if(!product){
      console.log('no product found');
      return res.redirect('/');
    }
    res.render("admin/edit-product", {
      pageTitle: "Admin - Edit Product",
      path: "/admin/edit-product",
      editing: editMode,
      product: product
    });
  })
  .catch(err => {
    console.log(err);
  });
};

exports.updateProduct = (req,res,next) => {
  Product.findByPk(req.body.id)
    .then(products => {
      products.title = req.body.title;
      products.imageUrl = req.body.imageUrl;
      products.price = req.body.price;
      products.details = req.body.details;
      return products.save();
    })
    .then(result => {
      console.log('Product with id:'+req.body.id+' was updated');
      res.redirect("/products");
    })
    .catch(err => {
      console.log(err);
    });
};

exports.postDeleteProduct = (req,res,next) => {
  //option1 
  // Product.destroy({
  //   where:{
  //     id: req.body.productId
  //   }
  // });
  // res.redirect('/admin/products');


  //option 2
  Product.findByPk(req.body.productId)
    .then(products =>{
      return products.destroy();
    })
    .then(result => {
      console.log('Product with id:'+req.body.productId+ ' has been deleted');
      res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
  
};

exports.AdminProducts = (req, res, next) => {
  console.log('inside the admin products exports section');
  Product.findAll()
    .then(data=>{
      res.render("admin/products", {
        prods: data,
        pageTitle: "All Products",
        path: "/admin/products"
      });
    })
    .catch((err)=>{
      console.log(err);
    });
  
};


