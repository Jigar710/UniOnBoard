const cookieToken = (user, res) => {
    // Create token from method getJwtToken() defined by us in model.
    const token = user.getJwtToken();

    const options = {
        expires: new Date(Date.now() + process.env.COOKIE_TIME * 24 * 60 * 60 * 1000),
        // httpOnly: true
    };

    // be sure that we do not share password.
    user.password = undefined;

    // send token in cookie, also send user details.
    res.status(200).cookie('token', token, options).json({
        success: true,
        token,
        user,
    });
}

module.exports = cookieToken;
