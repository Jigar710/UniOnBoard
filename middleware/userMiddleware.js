const User = require("../models/userModel");
const BigPromise = require("../middleware/bigPromise");
const jwt = require("jsonwebtoken");


exports.isLoggedIn = BigPromise(async (req, res, next) => {

    // Check if there is token or not in cookie.
    if (!(req.cookies.token)) {
        return res.status(400).json({
            success: false,
            message: "Login first to access this page."
        });
    }

    // store that token.
    const token = req.cookies.token;

    // this verify method uses JWT_SECRET and decode provided token(containing user id - injected by us in model).
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // find user based on id that decoded have and add that in req(middleware) as req.user.
    req.user = await User.findById(decoded.id);
    next();
});


// we will treat this roles as array to use functionality of array.
// we assume that we always use this middleware after IsLoggedIn middleware, so that we will have req.user
// now we will compare roles with req.user.role
exports.customRole = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(400).json({
                success: false,
                message: `You are not ${roles[0]}, so that you are not allowed for this resource.`
            });
        }
        next();
    }
};