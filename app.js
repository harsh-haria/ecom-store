const mongoose = require('mongoose');
const path = require('path');

const uris = require('./util/database');

const express = require("express");
const bodyParser = require('body-parser');


const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const ErrorController = require('./controllers/error');
// const mongoConnect = require('./util/database').mongoConnect;
const User = require('./models/user'); 

const app = express();


//for ejs
app.set('view engine','ejs');
app.set('views','views');


app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname,'public'))); //we can add multiple static folders
// the app will go through all the folders until it hits the first file which is needed


app.use( (req,res,next) => {
  User.findById('62d59f090172cae06c4d5192')
    .then(user => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use('/admin',adminRoutes);

app.use(shopRoutes);

app.use(ErrorController.errorPage);

mongoose
  .connect(uris.uri)
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