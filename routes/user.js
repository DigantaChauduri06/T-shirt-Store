const express = require("express");
const router = express.Router();

const {
  signup,
  login,
  logout,
  forgotPassword,
  passwordReset,
  getLoggedinUserDetails,
  changePassword,
  updateUserDetails,
  adminAllUsers,
  salesmanSelectedUsers,
  managerAllUsers,
  adminSingleUser,
  adminUpdateUser,
  adminDeleteUser,
} = require("../controllers/userControllers");
const { isLoggedIn, coustomRole } = require("../middleware/user");

router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/forgotPassword").post(forgotPassword);
router.route("/password/reset/:token").post(passwordReset);
router.route("/userDashboard").get(isLoggedIn, getLoggedinUserDetails);
router.route("/password/update").post(isLoggedIn, changePassword);
router.route("/userDashboard/update").post(isLoggedIn, updateUserDetails);

router
  .route("/admin/users")
  .get(isLoggedIn, coustomRole("admin"), adminAllUsers);

router
  .route("/admin/user/:id")
  .get(isLoggedIn, coustomRole("admin"), adminSingleUser)
  .put(isLoggedIn, coustomRole("admin"), adminUpdateUser)
  .delete(isLoggedIn, coustomRole("admin"), adminDeleteUser);
  
  
  
  
  
  
router
  .route("/salesman/users")
  .get(isLoggedIn, coustomRole("salesman"), salesmanSelectedUsers);

router
  .route("/manager/users")
  .get(isLoggedIn, coustomRole("manager"), managerAllUsers);

module.exports = router;
