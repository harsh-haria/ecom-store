
const path = require('path');

const express = require("express");
const bodyParser = require('body-parser');
// const routes = require('./routes');
// console.log(routes.someText);
// const server = http.createServer(routes.handler);



const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop');

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

app.use('/admin',adminData.router);

app.use(shopRoutes);

app.use((req,res,next)=>{
  // res.status(404).send('<h1 align="center">Page Not found :(</h1>');
  console.log('Error Page Sent!');
  // res.status(404).sendFile(path.join(__dirname, 'views', '404.html' ));
  res.status(404).render('404',{pageTitle:"ERROR 404",path:''});
  //the way you pass data into the templating engine doesn't change
  //the same way works for all as shown above
});

// const server = http.createServer(app);
// server.listen(3000);

app.listen(3000);
