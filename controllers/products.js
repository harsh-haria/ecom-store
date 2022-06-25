const Product = require('../models/product');

const getAddProductPage = (req, res, next) => {
  console.log("Sending add product page");
  // res.sendFile(path.join(__dirname,'../','views','add-product.html'));
  res.render("add-product", {
    pageTitle: "Admin - Add Product",
    path: "/admin/add-product",
    activeAddProduct: true,
    productCSS: true,
    formCSS: true,
    layout: "/layouts/main-layout",
  });
}

const postAddProductPage = (req,res,next)=>{
    console.log('Product request Received. Redirecting to Shop Page..');
    // console.log(req.body);
    // products.push({ title: req.body.title, price: req.body.price });
    const product = new Product(req.body.title,req.body.price);
    product.save();
    res.redirect('/');
}

const getProducts  = (req, res, next) => {
    Product.fetchAll((listOfProducts)=>{
      res.render("shop", {
        prods: listOfProducts,
        pageTitle: "SHOP",
        path: "/",
        hasProducts: listOfProducts.length > 0,
        activeShop: true,
        productCSS: true,
        layout: "/layouts/main-layout"
      });
    });
    // res.sendFile(path.join(rootDir, 'views', 'shop.html'));
    
  }

module.exports = {
    getAddProduct: getAddProductPage,
    postAddProduct: postAddProductPage,
    getProducts: getProducts
}