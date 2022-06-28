const fs = require("fs");
const path = require("path");

const rootDir = require("../util/path");

const p = path.join(rootDir, "data", "products.json");

const getProductsFromFile = (cb) => {
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      cb([]);
    } else {
      cb(JSON.parse(fileContent));
    }
  });
};

module.exports = class Products {
  constructor(title, ImageUrl, details, price, id) {
    this.title = title;
    this.ImageUrl = ImageUrl;
    this.price = price;
    this.details = details;
    this.id = id;
  }

  save(){
    getProductsFromFile(products => {
      console.log('id is: '+ this.id);
      if(this.id){
        console.log('Id found changing the details of the product');
        const existingProductIndex = products.findIndex(prod => prod.id === this.id);
        let updatedProduct = [...products];
        updatedProduct[existingProductIndex] = this;
        fs.writeFile(p, JSON.stringify(updatedProduct), (err) => {
          console.log(err);
        });
      }
      else{
        console.log('Id not found. Registering a new product');
        this.id = (Math.floor(Math.random() * (999999 - 100000)) + 100000).toString();
        products.push(this);
        fs.writeFile(p, JSON.stringify(products), (err) => {
          console.log(err);
        });
      }
    });
  }

  // save() {
  //   this.id = (
  //     Math.floor(Math.random() * (999999 - 100000)) + 100000
  //   ).toString();
  //   fs.readFile(p, (err, fileContent) => {
  //     let products = [];
  //     if (!err) {
  //       products = JSON.parse(fileContent);
  //     }
  //     products.push(this);
  //     fs.writeFile(p, JSON.stringify(products), (err) => {
  //       console.log(err);
  //     });
  //   });
  // }

  static fetchAll(cb) {
    fs.readFile(p, (err, fileContent) => {
      if (!err) {
        cb(JSON.parse(fileContent));
      } else {
        cb([]);
      }
    });
  }

  static findById(id, cb) {
    getProductsFromFile((products) => {
      const prod = products.find((p) => p.id === id);
      cb(prod);
    });
  }
};
