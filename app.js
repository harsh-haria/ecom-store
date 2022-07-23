const mongoose = require('mongoose');
const path = require('path');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const MONGODB_URI = require('./util/database');

const express = require("express");
const bodyParser = require('body-parser');


const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

const ErrorController = require('./controllers/error');
// const mongoConnect = require('./util/database').mongoConnect;
const User = require('./models/user'); 

const app = express();
const store = new MongoDBStore({
  uri: MONGODB_URI.uri,
  collection: 'sessions'
});

//for ejs
app.set('view engine','ejs');
app.set('views','views');


app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname,'public'))); //we can add multiple static folders
// the app will go through all the folders until it hits the first file which is needed
app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

app.use( (req,res,next) => {
  if(!req.session.user){
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use('/admin',adminRoutes);

app.use(shopRoutes);

app.use(authRoutes);

app.use(ErrorController.errorPage);

mongoose
  .connect(MONGODB_URI.uri)
  .then(result => {
    console.log('connected!');

    User.findOne().then(user => {
      if(!user){
        const user = new User({
          name:'Harsh Haria',
          email: 'harsh@test.com',
          address: 'Mumbai',
          cart: {
            items: []
          }
        })
        user.save();
      }
    });
    app.listen(3000);
  })
  .catch((err) => console.log(err));