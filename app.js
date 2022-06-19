const path = require('path');

const express = require("express");
const bodyParser = require('body-parser');
// const routes = require('./routes');
// console.log(routes.someText);
// const server = http.createServer(routes.handler);

const admin = require('./routes/admin');
const shop = require('./routes/shop');

const app = express();

app.use(bodyParser.urlencoded({extended: true}));

app.use('/admin',admin);

app.use(shop);

app.use((req,res,next)=>{
  // res.status(404).send('<h1 align="center">Page Not found :(</h1>');
  res.status(404).sendFile(path.join(__dirname, 'views', 'error.html' ));
});

// const server = http.createServer(app);
// server.listen(3000);

app.listen(3000);
