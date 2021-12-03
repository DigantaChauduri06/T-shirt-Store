const express = require("express");
const {
  test,
  addProduct,
  getProducts,
  adminGetAllProducts,
  getOneProduct,
  updateProduct,
  deleteProduct,
  addReview,
  deleteReview,
  getOnlyReviewsForOneProduct,
} = require("../controllers/productControllers");
const router = express.Router();
const { isLoggedIn, coustomRole } = require("../middleware/user");

router.route("/testProduct").get(test);
//user Routes
router.route("/products").get(getProducts);
router.route("/product/:id").get(getOneProduct);
router.route("/review").put(isLoggedIn, addReview);
router.route("/review").delete(isLoggedIn, deleteReview);
router.route("/reviews").get(getOnlyReviewsForOneProduct);

//admin Routes
router
  .route("/admin/product/add")
  .post(isLoggedIn, coustomRole("admin"), addProduct);
router
  .route("/admin/products")
  .get(isLoggedIn, coustomRole("admin"), adminGetAllProducts)
router
    .route("/admin/product/update/:id")
    .put(isLoggedIn, coustomRole("admin"), updateProduct);
router
    .route("/admin/product/delete/:id")
    .delete(isLoggedIn, coustomRole("admin"), deleteProduct);

module.exports = router;
