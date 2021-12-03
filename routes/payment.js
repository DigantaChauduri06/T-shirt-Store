const express = require("express");

const {
  sendStripeKey,
  sendRazorPayKey,
  captureRazorPayPayment,
  captureStripePayment,
} = require("../controllers/paymentControllers");

const router = express.Router();
const { isLoggedIn } = require("../middleware/user");

router.route('/stripekey').get(isLoggedIn, sendStripeKey)
router.route("/razorpaykey").get(isLoggedIn, sendRazorPayKey);


router.route("/stripepayment").post(isLoggedIn, captureStripePayment);
router.route("/razorpaypayment").post(isLoggedIn, captureRazorPayPayment);


module.exports = router;


