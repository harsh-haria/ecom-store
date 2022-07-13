const path = require('path');


const express = require("express");
const bodyParser = require('body-parser');


const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const ErrorController = require('./controllers/error');
const mongoConnect = require('./util/database').mongoConnect;

const app = express();


//for ejs
app.set('view engine','ejs');
app.set('views','views');


app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname,'public'))); //we can add multiple static folders
// the app will go through all the folders until it hits the first file which is needed


app.use( (req,res,next) => {
  // User.findByPk(1)
  //   .then(user => {
  //     req.user = user; //here we are storing a sequelize object not a json object
  //     //that means we also have the access to the methods of the sequelize lib like destroy
  //     next();
  //   })
  //   .catch((err) => console.log(err));
  next();
});

app.use('/admin',adminRoutes);

app.use(shopRoutes);

app.use(ErrorController.errorPage);

mongoConnect(() => {
  app.listen(3000);
});