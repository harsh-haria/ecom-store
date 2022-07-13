const Product = require("../models/product");
const Cart = require('../models/cart');

exports.getProducts = (req, res, next) => {
  Product
    .fetchAll()
    .then((data) => {
      res.render("shop/product-list", {
        product: data,
        pageTitle: "All Products",
        path: "/products",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;

  //option 1
  // Products.findByPk(prodId)
  //   .then(product=>{
  //     res.render("shop/product-detail", {
  //       pageTitle: "Product Details",
  //       path: "/product-details",
  //       product: product
  //     });
  //   })
  //   .catch(err => {
  //     console.log(err);
  //   });

  //option 2
  Product.findById(prodId)
    .then(products => {
      res.render("shop/product-detail", {
        pageTitle: products.title, 
        path: "/product-details",
        product: products //where clause sends an array so we have to select first element of the array
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getCartItems = (req, res, next) => {
  req.user
    .getCart()
    .then(cart => {
      return cart
        .getProducts()
        .then(products=>{
          res.render("shop/cart", {
            pageTitle: "Your Cart",
            path: "/cart",
            prods: products,
          });
        })
        .catch();
    })
    .catch();
};

exports.postCartDeleteProduct = (req, res, post) => {
  const prodId = req.body.productId;
  req.user
    .getCart()
    .then(cart => {
      return cart.getProducts({where: {id:prodId}});
    })
    .then((products)=>{
      let product = products[0];
      return product.cartItem.destroy();
    })
    .then(result => {
      res.redirect('/cart');
    })
    .catch(err => console.log(err));
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  let fetchedCart;
  let newQuantity = 1;
  req.user
    .getCart()
    .then(cart => {
      fetchedCart = cart;
      return cart.getProducts({ where: { id: prodId } });
    })
    .then(products => {
      let product;
      if(products.length>0){
        product = products[0];
      }
      if(product){
        // will do this later
        let oldQuantity = product.cartItem.quantity;
        newQuantity = oldQuantity + 1;
        return product;
      }
      return Product.findByPk(prodId);
    })
    .then((product)=>{
      return fetchedCart.addProduct(product, {through: { quantity: newQuantity }});
    })
    .then(()=>{
      res.redirect('/cart');
    })
    .catch();
};

exports.getOrders = (req, res, next) => {
  req.user
    .getOrders({include: ['products']}) //eager loading
    //this along with orders also fetches the products
    //this gives back an array where it also includes products per order
    //this works because of the relations we have in our app.js file
    .then(orders => {
      res.render("shop/orders", {
        pageTitle: "Your Orders",
        path: "/orders",
        orders: orders
      });
    })
    .catch((err) => console.log(err));
};

exports.postOrder = (req, res, next) => {
  let fetchedCart;
  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts();
    })
    .then(products => {
      return req.user
        .createOrder()
        .then(order => {
          return order.addProducts(
            products.map(product => {
              product.orderItem = {quantity: product.cartItem.quantity};
              return product;
            })
          );
        })
        .catch((err) => console.log(err));
    })
    .then(result => {
      return fetchedCart.setProducts(null);
    })
    .then(result => {
      res.redirect('/orders');
    })
    .catch((err) => console.log(err));
};

exports.getIndexPage = (req, res, next) => {
  Product
    .fetchAll()
    .then((data) => {
      res.render("shop/index", {
        product: data,
        pageTitle: "Home",
        path: "/",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

