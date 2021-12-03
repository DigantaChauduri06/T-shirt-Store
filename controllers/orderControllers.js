const BigPromise = require("../middleware/BigPromise");
const Order = require("../model/orders");
const Product = require("../model/product");

exports.createOrder = BigPromise(async (req, res, next) => {
  const {
    shippingInfo,
    orderItem,
    paymentInfo,
    taxAmount,
    shippingAmount,
    totalAmount,
    orderItems,
  } = req.body;
  const order = await Order.create({
    shippingInfo,
    orderItem,
    paymentInfo,
    taxAmount,
    shippingAmount,
    totalAmount,
    orderItems,
    user: req.user._id,
  });

  res.status(201).json({
    success: true,
    order,
  });
});

exports.getOneOrder = BigPromise(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (!order) {
    return next(new Error("No Orders Find. please provide correct id."));
  }

  res.status(201).json({
    success: true,
    order,
  });
});

exports.getAllOrder = BigPromise(async (req, res, next) => {
  const order = await Order.findOne({ user: req.user._id });

  if (!order) {
    return next(new Error("No Orders Find. please provide correct id."));
  }

  res.status(200).json({
    success: true,
    order,
  });
});

exports.getAllOrder = BigPromise(async (req, res, next) => {
  const order = await Order.find({});
  res.status(200).json({
    success: true,
    order,
  });
});

exports.getAllOrder = BigPromise(async (req, res, next) => {
  const order = await Order.find({});
  res.status(200).json({
    success: true,
    order,
  });
});

// ADMIN
const updateProductStock = async (productId, quantity) => {
  const product = await Product.findById(productId);
  product.stock -= quantity;
  product.save({ validateBeforeSave: false });
};
exports.updateOrder = BigPromise(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next("Please Provide a valid id");
  }
  if (order.orderStatus === "deliverd") {
    return next("Order is already is already delivered");
  }
  order.orderStatus = req.body.orderStatus;
  order.orderItems.forEach(async (prod) => {
    await updateProductStock(prod.product, prod.quantity);
  });
  await order.save();
  res.status(200).json({
    success: true,
    order,
  });
});

exports.deleteOrder = BigPromise(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next("Please Provide a valid id");
  }
  await order.remove();
  res.status(200).json({
    success: true,
    order,
  });
});
