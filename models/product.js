const mongodb = require('mongodb');

const getDb = require('../util/database').getDb;

class Product{
    constructor(title, imageUrl, price, details){
        this.title = title;
        this.imageUrl = imageUrl;
        this. price = price;
        this.details = details;
    }

    save(){
        const db = getDb();
        return db.collection("products")
          .insertOne(this)
          .then(result => {
            console.log('printing the result inside save');
            console.log(result);
          })
          .catch((err) => console.log(err));
    }

    static fetchAll(){
        const db = getDb();
        return db.collection("products")
          .find()
          .toArray()
          .then(products=>{
            console.log(products);
            return products;
          })
          .catch((err) => console.log(err));
    }

    static findById(prodId){
        const db = getDb();
        return db.collection('products')
          .find({ _id: new mongodb.ObjectId(prodId) })
          .next()
          .then(products => {
            console.log(products);
            return products;
          })
          .catch((err) => console.log(err));
    }
};

module.exports = Product;