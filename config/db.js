const mongoose = require('mongoose');

const connectDB = () => {
    mongoose.connect(process.env.DB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
        .then(console.log(`DB CONNECTION SUCCESSFUL`))
        .catch(err => {
            console.error('DB CONNECTION ERROR \n', err);
            process.exit(1);
        });
}

module.exports = connectDB;