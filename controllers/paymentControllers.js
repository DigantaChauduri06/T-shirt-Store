const BigPromise = require("../middleware/BigPromise");
const stripe = require("stripe")(process.env.STRIPE_API_SECRECT);
const { v4: uuidv4 } = require("uuid");

exports.sendStripeKey = BigPromise(async (req,res,next)=>{
    res.status(200).json({
      stripeKey: process.env.STRIPE_API_KEY,
    });
});

exports.captureStripePayment = BigPromise(async (req,res,next)=>{
  const paymentIntent = await stripe.paymentIntents.create({
    amount: req.body.amount,
    currency: "inr",
    automatic_payment_methods: {
      enabled: true,
    },
    metadata:{
        intrigration_check: 'accept_a_payment'
    }
  });
  res.status(200).json({
    success: true,
    id: paymentIntent.id,
    client_secret: paymentIntent.client_secret,
  });
});

exports.sendRazorPayKey = BigPromise(async (req, res, next) => {
  res.status(200).json({
    stripeKey: process.env.RAZORPAY_API_KEY,
  });
});

exports.captureRazorPayPayment = BigPromise(async (req, res, next) => {
  let instance = new Razorpay({
    key_id: process.env.RAZORPAY_API_KEY,
    key_secret: process.env.RAZORPAY_SECRECT,
  });
  let reciptID = uuidv4();
  const my_order = await instance.orders.create({
    amount: req.body.amount,
    currency: "INR",
    receipt: reciptID,
    notes: {
      key1: "value3",
      key2: "value2",
    },
  });
  res.status(200).json({
      success: true,
      amount: req.body.amount,
      my_order
  })
});