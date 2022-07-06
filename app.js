const fs = require('fs');
const path = require('path');
const rootDir = require('../Js/util/path');

//erase the file containing cart so that it can start fresh with every single load
// fs.unlinkSync(path.join(rootDir,'data','cart.json'));

const sequelize = require('./util/db');

const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');


// db.execute('SELECT * FROM products')
//     .then((result)=>{
//         console.log(result[0],result[1]);
//     })
//     .catch((err)=>{
//         console.log(err);
//     });


const express = require("express");
const bodyParser = require('body-parser');
// const routes = require('./routes');
// console.log(routes.someText);
// const server = http.createServer(routes.handler);



const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const ErrorController = require('./controllers/error');

const app = express();



//for pug
// app.set('view engine','pug');
// app.set('views','views');

//for handlebars
// const hbs = require('hbs')
// app.set('view engine','hbs');//whatever name we use in the second field will be the extension name for our files
// app.set('views','views');

//for ejs
app.set('view engine','ejs');
app.set('views','views');



app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname,'public'))); //we can add multiple static folders
// the app will go through all the folders until it hits the first file which is needed

app.use( (req,res,next) => {
  User.findByPk(1)
    .then(user => {
      req.user = user; //here we are storing a sequelize object not a json object
      //that means we also have the access to the methods of the sequelize lib like destroy
      next();
    })
    .catch((err) => console.log(err));
});

app.use('/admin',adminRoutes);

app.use(shopRoutes);

app.use(ErrorController.errorPage);

//Associations
Product.belongsTo(User,{constraints: true, onDelete: 'CASCADE' });
User.hasMany(Product);

User.hasOne(Cart);
Cart.belongsTo(User); //optional. Similar to the above statement
Cart.belongsToMany(Product,{ through: CartItem });
Product.belongsToMany(Cart,{ through: CartItem });


sequelize
  // .sync({ force: true }) //commented this out because we dont want to overwrite the data in base everytime
  .sync()
  .then((result) => {
    // console.log(result);
    // app.listen(3000); // start the server only if we reach here
    return User.findByPk(1);
  })
  .then((user) => {
    if(!user){
      User.create({ name:'harsh', email:'abc@test.com' });
    }
    return user;
    // return Promise.resolve(user); //can be done this way as well
  })
  .then((user)=>{
    return user.createCart();
  })
  .then((user)=>{
    // console.log(user);
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });

// const server = http.createServer(app);
// server.listen(3000);

