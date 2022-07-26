const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true },
      },
    ],
  },
});

userSchema.methods.addToCart = function (product) {
  const cartProductIndex = this.cart.items.findIndex((cp) => {
    return cp.productId.toString() === product._id.toString();
  });
  let newQuantity = 1;
  const updatedCartItems = [...this.cart.items];

  if (cartProductIndex >= 0) {
    newQuantity = this.cart.items[cartProductIndex].quantity + 1;
    updatedCartItems[cartProductIndex].quantity = newQuantity;
  } else {
    updatedCartItems.push({
      productId: product._id,
      quantity: newQuantity,
    });
  }
  const updatedCart = {
    items: updatedCartItems,
  };
  this.cart = updatedCart;
  return this.save();
};

userSchema.methods.removeFromCart = function (productId) {
  const updatedCartItems = this.cart.items.filter((item) => {
    return item.productId.toString() !== productId.toString();
  });
  this.cart.items = updatedCartItems;
  return this.save();
};

userSchema.methods.clearCart = function () {
  this.cart = {
    items: [],
  };
  return this.save();
};

// userSchema.methods.addOrder = function(){
//   let db = getDb();
//   const cartItems = this.cart.items;

//   return this.getCart()
//     .then((products) => {
//       const order = {
//         items: products,
//         user: {
//           _id: new mongodb.ObjectId(this._id),
//           name: this.username,
//           email: this.email,
//           address: this.address,
//         },
//       };
//       return db.collection("orders").insertOne(order);
//     })
//     .then((result) => {
//       this.cart = { items: [] };
//       return db
//         .collection("users")
//         .updateOne(
//           { _id: new mongodb.ObjectId(this._id) },
//           { $set: { cart: { items: [] } } }
//         );
//     });
// }

module.exports = mongoose.model("User", userSchema);

// const uri = require('../util/database').uri;

// class User{
//     constructor(username, email, address, cart, id){
//         this.username = username;
//         this.email = email;
//         this.address = address;
//         this.cart = cart;
//         this._id = id;
//     }

//     save(){
//         let db = getDb();
//         return db.collection("users").insertOne(this);
//     }

//     addToCart(product){
//         const cartProductIndex = this.cart.items.findIndex(cp => {
//             return cp.productId.toString() === product._id.toString();
//         });
//         let newQuantity = 1;
//         const updatedCartItems = [...this.cart.items];

//         if(cartProductIndex>=0){
//           newQuantity = this.cart.items[cartProductIndex].quantity + 1;
//           updatedCartItems[cartProductIndex].quantity = newQuantity;
//         }
//         else{
//           updatedCartItems.push({
//             productId: new mongodb.ObjectId(product._id),
//             quantity: newQuantity,
//           });
//         }
//         const updatedCart = {
//           items: updatedCartItems
//         };
//         const db = getDb();
//         return db.collection("users").updateOne(
//           { _id: new mongodb.ObjectId(this._id) },
//           { $set: { cart: updatedCart } }
//         );
//     }

//     getCart(){
//       const db = getDb();
//       const productIds = this.cart.items.map(i => {
//         return i.productId;
//       })
//       return db
//         .collection("products")
//         .find({ _id: { $in: productIds } })
//         .toArray()
//         .then(products => {
//           return products.map(p => {
//             return {
//               ...p,
//               quantity: this.cart.items.find((i) => {
//                 return i.productId.toString() === p._id.toString();
//               }).quantity,
//             };
//           });
//         })
//         .catch(err => console.log(err));
//     }

//     deleteItemFromCart(productId){
//       const updatedCartItems = this.cart.items.filter(item => {
//         return item.productId.toString() !== productId.toString();
//       });
//       let db = getDb();
//       return db
//         .collection("users")
//         .updateOne(
//           { _id: new mongodb.ObjectId(this._id) },
//           { $set: { cart: { items: updatedCartItems } } }
//         );
//     }

//     addOrder(){
//       let db = getDb();
//       return this.getCart()
//         .then((products) => {
//           const order = {
//             items: products,
//             user: {
//               _id: new mongodb.ObjectId(this._id),
//               name: this.username,
//               email: this.email,
//               address: this.address,
//             },
//           };
//           return db.collection("orders").insertOne(order);
//         })
//         .then((result) => {
//           this.cart = { items: [] };
//           return db
//             .collection("users")
//             .updateOne(
//               { _id: new mongodb.ObjectId(this._id) },
//               { $set: { cart: { items: [] } } }
//             );
//         });
//     }

//     getOrders(){
//       const db = getDb();
//       return db
//         .collection("orders")
//         .find({ "user._id": new mongodb.ObjectId(this._id) })
//         .toArray();
//     }

//     static findById(userId){
//         let db = getDb();
//         return db
//           .collection("users")
//           .findOne({ _id: new mongodb.ObjectId(userId) })
//           .then(user => {
//             // console.log(user);
//             return user;
//           })
//           .catch(err => console.log(err));
//     }
// }

// module.exports = User;
