const express = require("express");
const {
  createOrder,
  getOneOrder,
  getAllOrder,
  deleteOrder,
  updateOrder,
} = require("../controllers/orderControllers");
const router = express.Router();
const { isLoggedIn, coustomRole } = require("../middleware/user");

router.route("/order/create").post(isLoggedIn, createOrder);
router.route("/order/:id").get(isLoggedIn, getOneOrder);
router.route("/myorder").get(isLoggedIn, getAllOrder);
router
  .route("/admin/orders")
  .get(isLoggedIn, coustomRole("admin"), getAllOrder);
router
  .route("/admin/updateorder")
  .put(isLoggedIn, coustomRole("admin"), updateOrder);
router
  .route("/admin/deleteorder")
  .delete(isLoggedIn, coustomRole("admin"), deleteOrder);

module.exports = router;
