const cookieToken = (user,res) => {
    const token = user.getJwtToken();
    // creating a cookie
    const options = {
        expires: new Date(Date.now() + process.env.cookie_timer * 24 * 60 * 60 * 1000),
        httpOnly: true
    };
    user.password = undefined;
    res.status(201).cookie('token', token, options).json({
        success: true,
        token,
        user
    });
}


module.exports = cookieToken;