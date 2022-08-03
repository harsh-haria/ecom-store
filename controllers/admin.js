const Product = require("../models/product");

const {validationResult} = require('express-validator/check');

exports.AdminProducts = (req, res, next) => {
  Product.find({userId: req.user._id})
    .then((data) => {
      res.render("admin/products", {
        prods: data,
        pageTitle: "Admin Products",
        path: "/admin/products"
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getAddProductPage = (req, res, next) => {
  if(!req.session.isLoggedIn){
    return res.redirect('/login');
  }
  res.render("admin/edit-product", {
    pageTitle: "Admin - Add Product",
    path: "/admin/add-product",
    editing: false,
    hasError: false,
    errorMessage: null,
    validationErrors: []
  });
};

exports.postAddProductPage = (req, res, next) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Admin - Add Product",
      path: "/admin/add-product",
      editing: false,
      errorMessage: errors.array()[0].msg,
      hasError: true,
      product: {
        title: req.body.title,
        imageUrl: req.body.imageUrl,
        price: req.body.price,
        details: req.body.details,
      },
      validationErrors: errors.array(),
    });
  }
  const product = new Product({
    title: req.body.title,
    imageUrl: req.body.imageUrl,
    price: req.body.price,
    details: req.body.details,
    userId: req.user // the mongoose will pick the userId automatically
  });
  product
    .save()
    .then(result =>{
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
      hasError: false,
      product: product,
      errorMessage: null,
      validationErrors: []
    });
  })
  .catch(err => {
    console.log(err);
  });
};

exports.postEditProduct = (req,res,next) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Admin - Edit Product",
      path: "/admin/edit-product",
      editing: true,
      errorMessage: errors.array()[0].msg,
      hasError: true,
      product: {
        title: req.body.title,
        imageUrl: req.body.imageUrl,
        price: req.body.price,
        details: req.body.details,
        _id: req.body.productId
      },
      validationErrors: errors.array(),
    });
  }
  Product.findById(req.body.productId)
    .then((product) => {
      if(product.userId.toString() !== req.user._id.toString()){
        return res.redirect('/');
      }
      product.title = req.body.title;
      product.imageUrl = req.body.imageUrl;
      product.price = req.body.price;
      product.details = req.body.details;

      return product.save().then((result) => {
        console.log("Product with id: " + req.body.productId + " was updated");
        res.redirect("/admin/products");
      });
    })
    
    .catch((err) => {
      console.log(err);
    });
};

exports.postDeleteProduct = (req,res,next) => {
  Product.deleteOne({_id:req.body.productId, userId:req.user._id})
  Product.findByIdAndDelete(req.body.productId)
    .then(() => {
      console.log('Product with id:'+req.body.productId+ ' has been deleted');
      res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
};