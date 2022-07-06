const fs = require('fs');
const path = require('path');
const rootDir = require('../util/path');

const p = path.join(rootDir, 'data', 'cart.json');

module.exports = class Cart {
  static addProduct(id, productPrice) {
    //Fetch the previous cart
    fs.readFile(p, (err, fileContent) => {
      let cart = { products: [], totalPrice: 0 };
      if (!err) {
        cart = JSON.parse(fileContent);
      }
      //Analyze the current cart => find a existing product
      const existingProductsIndex = cart.products.findIndex(
        (prod) => prod.id === id
      );
      const existingProducts = cart.products[existingProductsIndex];
      let updatedProduct;
      //Add new product / update the quantity
      if (existingProducts) {
        updatedProduct = { ...existingProducts };
        updatedProduct.qty = existingProducts.qty + 1;
        cart.products = [...cart.products];
        cart.products[existingProductsIndex] = updatedProduct;
      } else {
        updatedProduct = { id: id, qty: 1 };
        cart.products = [...cart.products, updatedProduct];
      }
      cart.totalPrice = cart.totalPrice + +productPrice;
      fs.writeFile(p, JSON.stringify(cart), (err) => {
        console.log(err);
      });
    });
  }

  static deleteProduct(id, productPrice) {
    fs.readFile(p, (err, fileContent) => {
      if (err) {
        return;
      }
      // let cart = {products:[], totalPrice:0};
      // cart = JSON.parse(fileContent);

      const updatedCart = { ...JSON.parse(fileContent) };

      const product = updatedCart.products.find((prod) => prod.id === id);
      if (!product) {
        console.log("No product found with that id in the cart.");
        return;
      }
      const Qty = product.qty;
      updatedCart.products = updatedCart.products.filter(
        (prod) => prod.id !== id
      );
      updatedCart.totalPrice -= productPrice * Qty;
      fs.writeFile(p, JSON.stringify(updatedCart), (err) => {
        console.log(err);
      });
    });
  }

  static getCart(cb) {
    fs.readFile(p, (err, fileContent) => {
      const cart = JSON.parse(fileContent);
      if (err) {
        cb(null);
      } 
      else {
        cb(cart);
      }
    });
  }
};