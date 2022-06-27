const Product = require("../models/product");

exports.getAddProductPage = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Admin - Add Product",
    path: "/admin/add-product"
  });
};

exports.postAddProductPage = (req, res, next) => {
  console.log("Product request Received. Redirecting to Shop Page..");
  const product = new Product(req.body.title, req.body.image, req.body.details, req.body.price);
  product.save();
  res.redirect("/");
};

exports.getEditProductPage = (req, res, next) => {
  const editMode = req.query.edit;
  if(editMode){
    res.render("admin/edit-product", {
      pageTitle: "Admin - Edit Product",
      path: "/admin/edit-product",
      editing: editMode
    });

  }
  res.redirect('/');
};

// exports.ProductEditor = (req, res, next) => {
//   res.render("admin/edit-product", {
//     pageTitle: "Product Editor",
//     path: "shop/editor",
//   });
// };

exports.AdminProducts = (req, res, next) => {
  Product.fetchAll((listOfProducts) => {
    res.render("admin/products", {
      prods: listOfProducts,
      pageTitle: "All Products",
      path: "/admin/products"
    });
  });
};
