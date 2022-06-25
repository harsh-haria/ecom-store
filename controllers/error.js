exports.errorPage = (req, res, next) => {
  // res.status(404).send('<h1 align="center">Page Not found :(</h1>');
  console.log("Error Page Sent!");
  // res.status(404).sendFile(path.join(__dirname, 'views', '404.html' ));
  res.status(404).render("404", { pageTitle: "ERROR 404", path: "" });
  //the way you pass data into the templating engine doesn't change
  //the same way works for all as shown above
};
