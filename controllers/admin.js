const mongodb = require('mongodb');
const path = require('path');

const rootDir = require('../util/path');
const p = path.join(rootDir,'data','products.json');

const Product = require("../models/product");

exports.AdminProducts = (req, res, next) => {
  Product.find()
    .then((data) => {
      res.render("admin/products", {
        prods: data,
        pageTitle: "Admin Products",
        path: "/admin/products",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getAddProductPage = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Admin - Add Product",
    path: "/admin/add-product",
    editing: false
  });
};

exports.postAddProductPage = (req, res, next) => {
  const product = new Product({
    title: req.body.title,
    imageUrl: req.body.imageUrl,
    price: req.body.price,
    details: req.body.details,
    // userId: req.user._id
    userId: req.user // the mongoose will pick the userId automatically
  });
  product
    .save()
    .then(result =>{
      // console.log(result);
      console.log('Product creation complete');
      res.redirect('/admin/products');
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getEditProductPage = (req, res, next) => {
  const editMode = req.query.edit;
  if(!editMode){
    console.log('no edit mode found');
    return res.redirect('/');
  }
  const productId = req.params.productId;
  Product.findById(productId)
  .then(products => {
    let product = products;
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

exports.postEditProduct = (req,res,next) => {
  Product.findById(req.body.productId)
    .then((product) => {
      product.title = req.body.title;
      product.imageUrl = req.body.imageUrl;
      product.price = req.body.price;
      product.details = req.body.details;

      return product.save();
    })
    .then((result) => {
      console.log("Product with id: " + req.body.productId + " was updated");
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postDeleteProduct = (req,res,next) => {
  Product.findByIdAndDelete(req.body.productId)
    .then(() => {
      console.log('Product with id:'+req.body.productId+ ' has been deleted');
      res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
};