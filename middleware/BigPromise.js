/*
    try-catch and async await || use promises
    we can do same thing with async and await 
*/

module.exports = func => (req, res, next) => {
    Promise.resolve(func(req, res, next)).catch(next);
}