const items = require("../models/product");
const Cart = require("../models/cart");
const Products = require("../models/product");

exports.getProducts = (req, res, next) => {
  items.fetchAll((listOfProducts) => {
    res.render("shop/product-list", {
      product: listOfProducts,
      pageTitle: "All Products",
      path: "/products"
    });
  });
};

exports.getProduct = (req,res,next) => {
  const prodId = req.params.productId;
  items.findById(prodId,product=>{
    // console.log(product);
    res.render("shop/product-detail", {
      pageTitle: "Product Details",
      path: "/product-details",
      product: product
    });
  });
};

exports.getCartItems = (req, res, next) => {
  Cart.getCart(cart=>{
    Products.fetchAll((products)=>{
      let cartProducts = [];
      for(let product of products){
        const cartProductData = cart.products.find(prod => prod.id === product.id);
        if(cartProductData){
          cartProducts.push({productData: product,quantity: cartProductData.qty});
        }
      }
      res.render("shop/cart", {
        pageTitle: "Your Cart",
        path: "/cart",
        prods: cartProducts
      });
    });
  });
};

  exports.postCartDeleteProduct = (req,res,post)=>{
    const prodId = req.body.productId;
    Products.findById(prodId,product=>{
      Cart.deleteProduct(prodId,product.price);
      res.redirect('/cart');
    });
  }

exports.postCart = (req,res,next) => {
  const prodId = req.body.productId;
  items.findById(prodId,product=>{  
    Cart.addProduct(prodId,product.price);
  });
  res.redirect('/cart');
};

exports.getOrders = (req, res, next) => {
  res.render("shop/orders", {
    pageTitle: "Your Orders",
    path: "/orders",
  });
};

exports.getCheckoutPage = (req, res, next) => {
  res.render("shop/checkout", {
    pageTitle: "Checkout",
    path: "/checkout",
  });
};

exports.getIndexPage = (req, res, next) => {
  items.fetchAll((listOfProducts) => {
    res.render("shop/index", {
      product: listOfProducts,
      pageTitle: "Home",
      path: "/"
    });
  });
};

exports.getProductDetails = (req, res, next) => {
  res.render("shop/product-detail", {
    pageTitle: "Product Details",
    path: "/product-details",
  });
};
