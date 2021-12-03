const cloudinary = require("cloudinary").v2;
const { v4: uuidv4 } = require("uuid");
const User = require("../model/user");
const bryript = require("bcrypt");
const crypto = require("crypto");
const BigPromise = require("../middleware/BigPromise");
const cookieToken = require("../utils/cokkieTokens");
const { mailHelper } = require("../utils/emailHelper");

exports.signup = BigPromise(async (req, res, next) => {
  const { name, email, password, position } = req.body;
  if (!email || !password || !name) {
    return next(new Error("please send atleaset email, password, and name"));
  }
  const image = req.files?.MyFile?.tempFilePath;
  const nameImg = uuidv4();
  let obj;
  if (image) {
    obj = await cloudinary.uploader.upload(
      image,
      {
        resource_type: "image",
        public_id: `Users/mySubFolder/${nameImg}`,
        overwrite: false,
        crop: "scale",
        width: 150,
      },
      function (error, result) {
        console.log(result, error);
      }
    );
  }
  let secure_url = obj?.secure_url;
  let public_id = obj?.public_id;
  if (!image) {
    secure_url = "";
    public_id = "";
  }
  const user = await User.create({
    name,
    email,
    password,
    position,
    photo: {
      id: public_id,
      secure_url,
    },
  });
  cookieToken(user, res);
});

exports.login = BigPromise(async (req, res, next) => {
  const { email, password } = req.body;
  // check email and password
  if (!email || !password) {
    return next(new Error("Please Provide a email and password"));
  }
  const user = await User.findOne({ email });
  // if user is not found
  if (!user) {
    return next(new Error("User Does Not Exist (Email couldnot found)"));
  }
  // console.log(password);
  // const isPasswordCorrect = bryript.compare(password, user.password);
  // const passHash = bryript.hash(password,10);
  // // if user password is not correct

user.comparePassword(password, (err, isMatch) => {
    if (err) console.log(err);
    if (!isMatch) {
      return next(new Error("User Does Not Exist (password couldnot found)"));
    }
    // If all goes well
    cookieToken(user, res);
  });
});

exports.logout = BigPromise(async (req, res, next) => {
  res
    .cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    })
    .status(200)
    .json({
      success: true,
      message: "Logout success",
    });
});

exports.forgotPassword = BigPromise(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return next(new Error("User Not Found"));
  }
  const forgotToken = user.getPasswordToken();
  await user.save({ validateBeforeSave: false });
  const myUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${forgotToken}`;
  const message = `copy and paste\n\n ${myUrl} \n\non browser and hit enter`;
  try {
    await mailHelper({
      email: user.email,
      subject: "Passord Reset Email",
      message,
      text: "Passord Reset Email Text",
    });
    res.status(200).json({ success: true, message: "Email sent successfully" });
  } catch (error) {
    user.forgotPasswordToken = undefined;
    user.forgotPasswordExpairy = undefined;
    user.save({ validateBeforeSave: false });
    return next(new Error(`${error.message}`));
  }
});

exports.passwordReset = BigPromise(async (req, res, next) => {
  const token = req.params.token;
  const encryptToken = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({
    encryptToken,
    forgotPasswordExpairy: { $gt: Date.now() },
  });
  if (!user) {
    return next(new Error("Token is expired or invalid"));
  }
  if (req.body.password !== req.body.confirmPassword) {
    return next(new Error("Invalid password"));
  }
  user.password = req.body.password;
  user.forgotPasswordExpairy = undefined;
  user.forgotPasswordToken = undefined;
  await user.save();
  cookieToken(user, res);
});

exports.getLoggedinUserDetails = BigPromise(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({ success: true, user });
});

exports.changePassword = BigPromise(async (req, res, next) => {
  // From the middleware
  const userId = req.user.id;
  const user = await User.findById(userId);
  const oldPassword = req.body.oldpassword;
  console.log(user.password);
  user.comparePassword(oldPassword, async (err, isMatch) => {
    if (err) throw err;
    if (!isMatch) {
      return next(new Error("old password is not matched"));
    }
    user.password = req.body.password;
    await user.save();
    cookieToken(user, res);
  });
});

exports.updateUserDetails = BigPromise(async (req, res, next) => {
  const { name, email } = req.body;
  if (!name || !email) {
    return next(new Error("Please Provide name and email"));
  }
  const userId = req.user.id;
  const newData = {
    name: req.body.name,
    email: req.body.email,
  };
  let secure_url = undefined;
  let public_id = undefined;
  if (req.files) {
    // console.log("req.files");
    const user = await User.findById(req.user.id);
    // console.log("req.files");
    const imgId = user.photo.id;
    const response = await cloudinary.uploader.destroy(imgId);
    console.log(req.files);
    const uploadImg = await cloudinary.uploader.upload(
      req.files.MyFile.tempFilePath,
      (err, res) => {
        if (err) throw err;
        secure_url = res.secure_url;
        public_id = res.public_id;
        console.log(secure_url);
      }
    );
  }
  if (secure_url && public_id) {
    newData.photo = {
      id: public_id,
      secure_url,
    };
  }
  // console.log(newData);
  const user = await User.findByIdAndUpdate(userId, newData, {
    new: true,
    runValidators: true,
  });

  cookieToken(user, res);
});
/* -------------------------------------------------------------------------- */
/*                                 admin part                                 */
/* -------------------------------------------------------------------------- */
exports.adminAllUsers = BigPromise(async (req, res, next) => {
  const users = await User.find({});
  res.status(200).json({
    success: true,
    users,
  });
});

exports.salesmanSelectedUsers = BigPromise(async (req, res, next) => {
  const users = await User.find({});
  users.password = undefined;
  users.photo = undefined;
  res.status(200).json({
    success: true,
    users,
  });
});

exports.managerAllUsers = BigPromise(async (req, res, next) => {
  const users = await User.find({
    $or: [{ position: "user" }, { position: "salesman" }],
  });
  users.password = undefined;
  users.photo = undefined;
  console.log(users.password);
  res.status(200).json({
    success: true,
    users,
  });
});

exports.adminSingleUser = BigPromise(async (req, res, next) => {
  const id = req.params.id;
  const user = await User.findById(id);
  if (!user) {
    return next(new Error("No such user"));
  }
  res.json({ success: true, user }).status(200);
});

exports.adminUpdateUser = BigPromise(async (req, res, next) => {
  const { name, email } = req.body;
  if (!name || !email) {
    return next(new Error("Please Provide name and email"));
  }
  const userId = req.params.id;
  const newData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body?.role,
  };

  // console.log(newData);
  const user = await User.findByIdAndUpdate(userId, newData, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({ success: true, user });
});

exports.adminDeleteUser = BigPromise(async (req, res, next) => {
  const userId = req.params.id;
  let user = await User.findById(userId);
  if (!user) {
    return next(new Error('User not found'));
  }
  if (user.position == 'admin') {
    return next(new Error('A admin cant delete an another admin'));
  }
  await User.deleteOne({ _id: userId });
  if (user.photo.id != "") {
    console.log(user.photo.id);
    if (user.photo.id) {
      const deletedPics = await cloudinary.uploader.destroy(user.photo.id);
      console.log(deletedPics);
    }
  }
  // console.log(newData);
  console.log('----------');
  res.status(204).json({ success: true, user });
});


/*
  Signup
{
    "name": "Diganta Chaudhuri",
    "email": "digantachaudhuri03@gmail.com",
    "password": "diganta123",
    "position":"admin"
}
*/