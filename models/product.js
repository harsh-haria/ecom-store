const db = require('../util/database')

const Cart = require("./cart");

module.exports = class Products {
  constructor(title, ImageUrl, details, price, id) {
    this.title = title;
    this.ImageUrl = ImageUrl;
    this.price = price;
    this.details = details;
    this.id = id;
  }

  
  save(){

  }


  static deleteById(id){

  }
  

  static fetchAll() {
    return db.execute("SELECT * FROM products");
  }


  static findById(id) {

  }


};
