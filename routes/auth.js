const express = require("express");

const router = express.Router();

const authController = require("../controllers/auth");
const isAuth = require('../middleware/is-auth');

router.get("/login", isAuth, authController.getLogin);

router.post("/login", isAuth, authController.postLogin);

router.post("/logout", isAuth, authController.postLogout);

router.get("/signup", isAuth, authController.getSignup);

router.post("/signup", isAuth, authController.postSignup);

module.exports = router;
