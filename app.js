const mongoose = require('mongoose');
const path = require('path');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const express = require("express");
const bodyParser = require('body-parser');
const csrf = require('csurf');
const flash = require('connect-flash');

const MONGODB_URI = require('./util/database');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

const ErrorController = require('./controllers/error');

const User = require('./models/user'); 

const app = express();

const store = new MongoDBStore({
  uri: MONGODB_URI.uri,
  collection: 'sessions'
});
var csrfProtection = csrf();

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
    store: store
  })
);
app.use(csrfProtection);
app.use(flash());

app.use( (req,res,next) => {
  if(!req.session.user){
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      if (!user) {
        return next();
      }
      req.user = user;
      next();
    })
    .catch((err) => {
      // throw new Error(err); //this will just throw an error and reloading sign will be on loop
      //rather than this we can use next and wrap this error inside the next to avoid such situations
      next(new Error(err)); 
      //btw this is just for async. for sync it will directly work and go to /500
    });
});

app.use((req,res,next)=>{
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use('/admin',adminRoutes);

app.use(shopRoutes);

app.use(authRoutes);

app.get('/500',ErrorController.get505);

app.use(ErrorController.errorPage);

app.use((error,req,res,next) => {
  // res.status(error.httpStatusCode).render(...);
  // res.redirect('/500');
  res
    .status(500)
    .render("500", {
      pageTitle: "ERROR!",
      path: "/500",
      isAuthenticated: req.session.isLoggedIn
    });
});

mongoose
  .connect(MONGODB_URI.uri)
  .then(result => {
    console.log('connected!');
    app.listen(3000);
  })
  .catch((err) => console.log(err));