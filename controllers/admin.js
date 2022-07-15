const mongodb = require('mongodb');
const path = require('path');

const rootDir = require('../util/path');
const p = path.join(rootDir,'data','products.json');

const Product = require("../models/product");

exports.getAddProductPage = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Admin - Add Product",
    path: "/admin/add-product",
    editing: false
  });
};

exports.postAddProductPage = (req, res, next) => {
  const product = new Product(
    req.body.title,
    req.body.imageUrl,
    req.body.price,
    req.body.details,
    null,
    req.user._id
  );
  product
  .save()
  .then(result =>{
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

exports.updateProduct = (req,res,next) => {
  const product = new Product(
    req.body.title,
    req.body.imageUrl,
    req.body.price,
    req.body.details,
    req.body.productId
  );
    product
      .save()
      .then((result) => {
        console.log("Product with id:" + req.body.productId + " was updated");
        res.redirect("/products");
      })
      .catch((err) => {
        console.log(err);
      });
};

exports.postDeleteProduct = (req,res,next) => {
  Product.deleteById(req.body.productId)
    .then(() => {
      console.log('Product with id:'+req.body.productId+ ' has been deleted');
      res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
};

exports.AdminProducts = (req, res, next) => {
  Product.fetchAll()
    .then(data=>{
      res.render("admin/products", {
        prods: data,
        pageTitle: "Admin Products",
        path: "/admin/products"
      });
    })
    .catch((err)=>{
      console.log(err);
    });
};
