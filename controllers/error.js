exports.errorPage = (req, res, next) => {
  // res.status(404).send('<h1 align="center">Page Not found :(</h1>');
  // const isLoggedIn = true;
  // console.log("Error Page Sent! !");
  // const isLoggedIn = req.get("Cookie").split(";")[1].trim().split("=")[1];  
  // res.status(404).sendFile(path.join(__dirname, 'views', '404.html' ));
  res
    .status(404)
    .render("404", {
      pageTitle: "ERROR 404",
      path: "/404",
      isAuthenticated: req.session.isLoggedIn
    });
  //the way you pass data into the templating engine doesn't change
  //the same way works for all as shown above
};
