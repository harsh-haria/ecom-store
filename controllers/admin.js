const Product = require("../models/product");

exports.getAddProductPage = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Admin - Add Product",
    path: "/admin/add-product",
    editing: false
  });
};

exports.postAddProductPage = (req, res, next) => {
  console.log("Product request Received. Redirecting to Shop Page..");
  const product = new Product(req.body.title, req.body.image, req.body.details, req.body.price,null);
  product.save();
  res.redirect("/");
};

exports.getEditProductPage = (req, res, next) => {
  const editMode = req.query.edit;
  if(!editMode){
    console.log('no edit mode found');
    return res.redirect('/');
  }
  const productId = req.params.productId;
  Product.findById(productId, product => {
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
  });
};

exports.updateProduct = (req,res,next) => {
  // console.log(req.body);
  const UpdatedProduct = new Product(req.body.title, req.body.image, req.body.details, req.body.price,req.body.id,);
  UpdatedProduct.save();
  res.redirect("/");
};

exports.AdminProducts = (req, res, next) => {
  Product.fetchAll((listOfProducts) => {
    res.render("admin/products", {
      prods: listOfProducts,
      pageTitle: "All Products",
      path: "/admin/products"
    });
  });
};


