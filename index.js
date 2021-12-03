const app = require('./app');
const connectDB = require('./config/db');
require('dotenv').config();
const cloudinary = require('cloudinary');
const { CLOUDINARY_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;
// connect to DB
connectDB();
cloudinary.config({
    cloud_name: CLOUDINARY_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
    secure: true
});
const port = process.env.PORT;
app.listen(port, () => {
    console.log(`APP is running on PORT : ${port}`);
});