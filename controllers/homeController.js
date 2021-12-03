const BigPromise = require('../middleware/BigPromise');


exports.home = BigPromise((req, res) => {
    res.status(200).json({
        success: true,
        greeting: 'Hello from your Dashboard'
    });
})
exports.dummy = (req, res) => {
    res.status(200).json({
        success: true,
        greeting: 'Hello from your dummy'
    });
}