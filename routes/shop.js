const path = require('path');

const express = require("express");

const rootDir = require('../util/path');

const router = express.Router();

router.get("/", (req, res, next) => {
  // res.send("<h1>Base Page or Product Added</h1>");
  console.log('sending shop page');
  res.sendFile(path.join(rootDir, 'views', 'shop.html'));
});

module.exports = router;
