const path = require('path');

const express = require("express");
const bodyParser = require('body-parser');
// const routes = require('./routes');
// console.log(routes.someText);
// const server = http.createServer(routes.handler);

const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const app = express();

app.set('view engine','pug');
app.set('views','views');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname,'public'))); //we can add multiple static folders
// the app will go through all the folders until it hits the first file which is needed


app.use('/admin',adminData.router);

app.use(shopRoutes);

app.use((req,res,next)=>{
  // res.status(404).send('<h1 align="center">Page Not found :(</h1>');
  console.log('Error Page Sent!');
  res.status(404).sendFile(path.join(__dirname, 'views', '404.html' ));
});

// const server = http.createServer(app);
// server.listen(3000);

app.listen(3000);
