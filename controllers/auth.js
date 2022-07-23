const User = require('../models/user');
exports.getLogin = (req,res,next) => {
    res.render("auth/login", {
      pageTitle: "Login",
      path: "/login",
      isAuthenticated: false
    });
}

exports.postLogin = (req,res,next)=>{
  // res.setHeader('Set-Cookie','loggedIn=true');
  User.findById('62d59f090172cae06c4d5192')
  .then(user => {
    req.session.user = user;
    req.session.isLoggedIn = true;
    req.session.save((err)=>{
      console.log(err);
    }); //mongodb might take some miliseconds to update.
    //this helps us to hold operations until everything is saved and only then redirect
    res.redirect('/');
  })
  .catch((err) => console.log(err));
}

exports.postLogout = (req,res,next)=>{
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
}