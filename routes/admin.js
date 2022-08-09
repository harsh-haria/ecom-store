const path = require("path");
const express = require("express");

const { body } = require("express-validator/check");

const router = express.Router();

const AdminController = require("../controllers/admin");
const isAuth = require("../middleware/is-auth");

router.get("/products", isAuth, AdminController.AdminProducts);

router.get("/add-product", isAuth, AdminController.getAddProductPage);

router.post(
  "/add-product",
  [
    body(
      "title",
      "Title should be Alphanumeric and Length should be between 3 and 25!"
    )
      .isString()
      .isLength({
        min: 3,
        max: 25,
      }),

    // body("imageUrl", "Invalid Image Url!")
    //   .isLength({ min: 3 })
    //   .isURL({ validate_length: true, protocols: ["http", "https", "ftp"] }),

    body("price", "Invalid price!").isFloat({min:0}),

    body("details", "Details Length should be between 10 and 30!").isLength({
      min: 10,
      max: 30,
    }),
  ],
  isAuth,
  AdminController.postAddProductPage
);

router.get(
  "/edit-product/:productId",
  isAuth,
  AdminController.getEditProductPage
);

router.post(
  "/edit-product",
  [
    body("title", "Title Length should be between 3 and 25!")
      .isString()
      .isLength({
        min: 3,
        max: 25,
      }),

    // body("imageUrl", "Invalid Image Url!")
    //   .isLength({ min: 3 })
    //   .isURL({ validate_length: true, protocols: ["http", "https", "ftp"] }),

    body("price", "Invalid price!").isFloat({min:0}),

    body("details", "Details Length should be between 10 and 30!").isLength({
      min: 10,
      max: 30,
    }),
  ],
  isAuth,
  AdminController.postEditProduct
);

router.post("/delete-product", isAuth, AdminController.postDeleteProduct);

module.exports = router;