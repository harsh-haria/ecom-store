const db = require('../util/database');

const Cart = require("./cart");

module.exports = class Products {
  constructor(title, imageUrl, details, price, id) {
    this.title = title;
    this.imageUrl = ImageUrl;
    this.price = price;
    this.details = details;
    this.id = id;
  }

  
  save(){
    return db.execute(
      'INSERT INTO products (title,imageUrl,price,details) VALUES (?,?,?,?)',
      [this.title,this.ImageUrl,this.price,this.details]
    );
  }


  static deleteById(id){

  }
  

  static fetchAll() {
    console.log('reached fetch all inside product');
    return db.execute('select * from products');
  }


  static findById(id) {

  }


};
