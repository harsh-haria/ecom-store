const path = require('path');


const express = require("express");
const bodyParser = require('body-parser');


const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const ErrorController = require('./controllers/error');
const mongoConnect = require('./util/database').mongoConnect;
const User = require('./models/user'); 

const app = express();


//for ejs
app.set('view engine','ejs');
app.set('views','views');


app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname,'public'))); //we can add multiple static folders
// the app will go through all the folders until it hits the first file which is needed


app.use( (req,res,next) => {
  User.findById('62d0610ef0e191f4869059ff')
    .then(user => {
      req.user = new User(user.username, user.email, user.address, user.cart, user._id);
      next();
    })
    .catch((err) => console.log(err));
});

app.use('/admin',adminRoutes);

app.use(shopRoutes);

app.use(ErrorController.errorPage);

mongoConnect(() => {
  app.listen(3000);
});