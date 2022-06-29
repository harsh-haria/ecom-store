const fs = require('fs');
const path = require('path');
const rootDir = require('../Js/util/path');

//erase the file containing cart so that it can start fresh with every single load
// fs.unlinkSync(path.join(rootDir,'data','cart.json'));

const db = require('./util/database');

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

app.use('/admin',adminRoutes);

app.use(shopRoutes);

app.use(ErrorController.errorPage);

// const server = http.createServer(app);
// server.listen(3000);

app.listen(3000);
