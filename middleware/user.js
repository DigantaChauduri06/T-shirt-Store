const jwt = require('jsonwebtoken');
const User = require('../model/user');
const BigPromise = require("../middleware/BigPromise");

exports.isLoggedIn = BigPromise(async (req, res, next) => {
    const token = req.cookies.token || req.header("Authorization")?.replace("Bearer ", "") || req.body.token;
    if (!token) {
        return next(new Error("Login First"));
    }
    // We have created this token before with only the Id so we can extract only id
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);    
    next();
});

exports.coustomRole = (...roles) => {
    // here we treating maneger or admin as a array as array has many methods to do
    return BigPromise((req, res, next) => {
        if (!roles.includes(req.user.position)) {
         return next(new Error('You are not allowed to access this resource.'));    
        }
        next();
    })
}