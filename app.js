require('dotenv').config();
const express = require('express');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const app = express();

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(fileUpload({
    tempFileDir: "tmp",
    useTempFiles: true,
    preserveExtension: 12,
    safeFileNames: true,
    
}));
// temp check
app.set('view engine', 'ejs');

//morgan
app.use(logger('dev'));
// from locals
const home = require('./routes/home');
const user = require('./routes/user');
const product = require('./routes/product');
const orders = require('./routes/order');

// routes
app.use('/api/v1/', home);
app.use('/api/v1/', user);
app.use('/api/v1/', product);
app.use('/api/v1/', orders);

app.get('/signuptest', (req, res) => {
    res.render('post');
})


module.exports = app;