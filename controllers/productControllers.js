const BigPromise = require("../middleware/BigPromise");
const Product = require("../model/product");
const WhereClause = require("../utils/whereClause");
const cloudinary = require("cloudinary").v2;

exports.test = BigPromise((req, res) => {
  res.status(200).json({
    success: true,
    greeting: "Hello from your test Dashboard",
  });
});

/* -------------------------------------------------------------------------- */
/*                                OPEN FOR ALL                                */
/* -------------------------------------------------------------------------- */

exports.getProducts = BigPromise(async (req, res, next) => {
  const resultPerPage = 10;
  const totalCountOfProducts = await Product.countDocuments();

  let productsAfterFiltering = new WhereClause(Product.find(), req.query)
    .search()
    .fileter();
  // pagination -- it will return base + BigQ
  productsAfterFiltering.pager(resultPerPage);
  // But We need only base from pagination
  productsAfterFiltering = await productsAfterFiltering.base; // Product.find({}).limit().skip()

  res.status(200).json({
    success: true,
    productsAfterFiltering,
    totalCountOfProducts,
  });
});

exports.getOneProduct = BigPromise(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new Error(`Product not found with this id`));
  }
  res.json({ success: true, product }).status(200);
});

exports.addReview = BigPromise(async (req, res, next) => {
  const { rating, feedback, productId } = req.body;
  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    feedback,
  };
  const product = await Product.findById(productId);

  const alreadyReview = product.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  );
  if (alreadyReview) {
    product.reviews.forEach((element) => {
      if (element.user.toString() === req.user._id.toString()) {
        element.feedback = feedback;
        element.rating = rating;
      }
    });
  } else {
    product.reviews.push(review);
    product.noOfRatings = product.reviews.length;
  }

  // adjust rating
  product.rating =
    product.reviews.reduce((acc, item) => item.rating + acc, 0) /
    product.reviews.length;

  // save
  await product.save({ validateBeforeSave: false });
  res.status(200).json({
    success: true,
  });
});

exports.deleteReview = BigPromise(async (req, res, next) => {
  const { productId } = req.query;

  const product = await Product.findById(productId);

  const reviews = product.reviews.filter(
    (rev) => rev.user.toString() === req.user._id.toString()
  );
  const noOfRatings = reviews.length;

  // adjust rating
  product.rating =
    product.reviews.reduce((acc, item) => item.rating + acc, 0) /
    product.reviews.length;

  // update the product
  await product.findByIdAndUpdate(
    productId,
    {
      reviews,
      rating,
      noOfRatings,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).json({
    success: true,
  });
});

exports.getOnlyReviewsForOneProduct = BigPromise(async(req,res,next)=>{
  const product = Product.findById(req.query.id);
  
  res.status(200).json({
    success: true,
    reviews: product.reviews
  })
});

/* -------------------------------------------------------------------------- */
/*                                 ADMIN ONLY                                 */
/* -------------------------------------------------------------------------- */

exports.addProduct = BigPromise(async (req, res, next) => {
  // we can check each field by putting if-else we can do that but it is unnecessary because we have written required fields in model itself

  let imgArray = [];
  // If image is not found
  console.log(req);
  if (!req.files) {
    return next(new Error("No files / images specified"));
  }
  // Image handler
  if (req.files) {
    for (let i = 0; i < req.files.photos.length; i++) {
      let result = await cloudinary.uploader.upload(
        req.files.photos[i].tempFilePath,
        {
          folder: "Products",
        }
      );
      imgArray.push({
        id: result.public_id,
        secure_url: result.secure_url,
      });
    }
  }
  // overwrite existing req.body.photos with new imgArray
  req.body.photos = imgArray;
  req.body.user = req.user.id;

  const product = await Product.create(req.body);

  res.status(201).json({ success: true, product });
});

exports.adminGetAllProducts = BigPromise(async (req, res, next) => {
  const products = await Product.find();
  if (!products) {
    return res.json(200).json({ success: true, message: "No products found" });
  }
  res.status(200).json({ success: true, products: products });
});

exports.updateProduct = BigPromise(async (req, res, next) => {
  const id = req.params.id;
  let product = await Product.findOne({ _id: id });
  if (!product) {
    return res.json(200).json({ success: true, message: "No products found" });
  }
  console.log(product.photos);
  let imgsArray = [];
  if (req.files) {
    //destroy images
    for (let i = 0; i < req.files.photos.length; i++) {
      const result = await cloudinary.uploader.destroy(product.photos[i].id);
      console.log(result);
    }
    // add images
    for (let i = 0; i < req.files.photos.length; i++) {
      let result = await cloudinary.uploader.upload(
        req.files.photos[i].tempFilePath,
        {
          folder: "Products",
        }
      );
      imgsArray.push({
        id: result.public_id,
        secure_url: result.secure_url,
      });
    }
  }
  req.body.photos = imgsArray;
  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({ success: true, product });
});

exports.deleteProduct = BigPromise(async (req, res, next) => {
  const id = req.params.id;
  let product = await Product.findOne({ _id: id });
  if (!product) {
    return res.json(200).json({ success: true, message: "No products found" });
  }
  console.log(product.photos);
  for (let i = 0; i < product.photos.length; i++) {
    console.log(product.photos[i].id);
    const result = await cloudinary.uploader.destroy(product.photos[i].id);
    console.log(result);
  }
  await product.remove();
  console.log(product);
  res.status(204).json({ success: true, product });
});
