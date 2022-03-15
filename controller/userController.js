const User = require("../models/userModel");
const Blog = require("../models/blogModel");
const BigPromise = require("../middleware/bigPromise");
const CustomError = require("../utils/customError");
const cookieToken = require("../utils/cookieToken");
const cloudinary = require("cloudinary").v2;
const { signValidation, loginValidation } = require("../models/validation");
const mailHelper = require("../utils/emailHelper");
const crypto = require("crypto");
const { cookie } = require("request");


//========== Student, Faculty, Admin routes ==========//

exports.signup = BigPromise(async (req, res, next) => {

    // Collect data from Body.
    const { name, email, password, conf_password, role } = req.body;

    // Check for mandatory a data.
    const { error } = signValidation(req.body);
    if (error) {
        res.status(400).json({
            success: false,
            message: error.details[0].message
        });
        return;
    }
    // Check if both password fields matched or not.
    if (password !== conf_password) {
        return res.status(400).json({
            success: false,
            message: 'Password and Confirm Password does not matched.'
        });
    }

    // Check duplicate User base on email.
    const emailExist = await User.findOne({ email });
    if (emailExist) {
        return res.status(400).json({
            success: false,
            message: 'User with this email id already exist.'
        });
    }

    // Check if provided user role is valid or not as per our project.
    if (!(role === 'student' || role === 'faculty')) {
        return res.status(400).json({
            success: false,
            message: 'Please provide role only from - student or faculty.'
        });
    }

    // Create and save User in DB.
    const user = await User.create({
        name,
        email,
        password,
        role
    });

    // Check if User is created or not.
    if (!user) {
        return res.status(500).json({
            success: false,
            message: 'User registration failed.'
        });
    }

    // At a time of signup we either send token or send success message.
    //---> If we want that after successfully registerd, user should directly access procected routes then use token.
    //------> handle cookies
    // cookieToken(user, res);

    //---> If we want that after successfully registerd, user should login to access procected routes then use simple success message.
    //------> sending success message
    res.status(201).json({
        success: true,
        message: "You are successfully registered. Go and login."
    });
});

exports.login = BigPromise(async (req, res, next) => {

    // Collect data from Body.
    const { email, password } = req.body;

    // Check for mandatory a data.
    const { error } = loginValidation(req.body);
    if (error) {
        return res.status(400).json({
            success: false,
            message: error.details[0].message
        });
    }

    // Get User from DB based on "email".
    const user = await User.findOne({ email }).select("+password");

    // Check if User exist or not, base on "email".
    if (!user) {
        return res.status(400).json({
            success: false,
            message: 'Invalid Credientials.'
        });
    }

    // User is founded, Now check for password.
    // to do so, use method defined by us in model, that will bcrypt the DB password and will compare it with given password.
    const isPasswordCorrect = await user.isvalidatedPassword(password);
    if (!isPasswordCorrect) {
        return res.status(400).json({
            success: false,
            message: 'Invalid Credientials.'
        });
    }

    // If all thing is good then send token.
    cookieToken(user, res);
});

exports.logout = BigPromise(async (req, res, next) => {

    // Clear cookie that stores token to delete token.
    // Reset expire time of cookie to current time.
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        // httpOnly: true
    });

    // Send success message for Logout.
    res.status(200).json({
        success: true,
        message: "Logout sucessfully."
    });

});

exports.getLoggedInUserDetails = BigPromise(async (req, res, next) => {

    // Get user details based on user id.
    // req.user will be added by IsLoggedIn middleware.

    const user = await User.findById(req.user.id);

    // No need to check for if user exists or not. Bcoz if we are hitting this api that means user is alredy logged in.

    res.status(200).json({
        success: true,
        user
    });
});

exports.updateUserDetails = BigPromise(async (req, res, next) => {

    // This newData object will collect all data that user want to update.
    var newData = {}

    // User will not be able to change email.
    if (req.body.email) {
        return (res.status(400).json({
            success: false,
            message: "Sorry, you can not update email."
        }));
    }

    // User will not be able to change password from this route. There is a seprate route to change password.
    if (req.body.password) {
        return (res.status(400).json({
            success: false,
            message: "Sorry, you can not update password from here."
        }));
    }

    // User will not be able to change role.
    if (req.body.role) {
        return (res.status(400).json({
            success: false,
            message: "Sorry, you can not update role."
        }));
    }

    // If user is sending name to change then save that new name in newData object.
    if (req.body.name) {
        newData.name = req.body.name;
    }

    // If user is sending gender to change then save that new gender in newData object.
    if (req.body.gender) {
        if (!(req.body.gender === 'male' || req.body.gender === 'female' || req.body.gender === 'other')) {
            return res.status(400).json({
                success: false,
                message: 'Please provide gender only from - male or female or other.'
            });
        }
        newData.gender = req.body.gender;
    }

    // If user is sending DOB to change then save that new DOB in newData object.
    if (req.body.DOB) {
        newData.DOB = new Date(req.body.DOB);
    }

    // If photo is comming then do following -----> It is front-end's responsiblity to be sure that only one Image in coming.
    if (req.files) {
        // Find user who is trying to update details by user.id added via isLoggedIn middleware.
        const user = await User.findById(req.user.id);

        // Once have user, then check if user has previously uploaded photo or not.
        const imageId = user.photo.id
        // if photo is there then delete it.
        if (imageId) {
            const resp = await cloudinary.uploader.destroy(user.photo.id);
        }

        // Now grab new photo that user want to upload and upload that in cloudinary.
        let file = req.files.photo;
        const result = await cloudinary.uploader.upload(file.tempFilePath, {
            folder: "users",
            width: 150,
            crop: "scale"
        });

        // Add new photo details provided by cloudinary in newData object.
        newData.photo = {
            id: result.public_id,
            secure_url: result.secure_url
        }
    }

    // Update and save User details in DB.
    const user = await User.findByIdAndUpdate(req.user.id, newData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    res.status(200).json({
        success: true,
        user
    });
});

// this method will be helpful to reset password when user in not logged in means user do not know current password.
// this method will send email having url to reset password.
exports.forgotPassword = BigPromise(async (req, res, next) => {

    // Collect data from Body.
    const { email } = req.body;

    // Check for mandatory a data.
    if (!(email)) {
        return res.status(400).json({
            success: false,
            message: `"email" is required.`
        });
    }

    // Get User from DB based on "email".
    const user = await User.findOne({ email });

    // Check if User exist or not, base on "email".
    if (!user) {
        return res.status(400).json({
            success: false,
            message: 'User with given email does not exist.'
        });
    }

    // Get token {random string} from getForgotPasswordToken method defined by us in model.
    // This method will change forgotPasswordToken and forgotPasswordExpiry in DB.
    const forgotToken = user.getForgotPasswordToken();

    // Save this token till user validated or token expires.
    await user.save({ validateBeforeSave: false });

    // Create URL ---> http://localhost:4000/password/reset/{token}
    const myUrl = `${req.protocol}://${req.get("host")}/password/reset/${forgotToken}`;

    // Craft msg
    const message = `Copy Paste this link in your URL to reset Password.\n\n ${myUrl}`;

    // Attempt to send mail.
    try {
        await mailHelper({
            email: user.email,
            subject: `UniOnBoard - Password Reset Email`,
            message: message
        });

        // Json responce if mail is sent.
        res.status(400).json({
            success: true,
            message: "Email sent successfully. Check your mail"
        });

    } catch (error) {
        // If mail is not send then change forgotPasswordToken and forgotPasswordExpiry to undefined in DB.
        user.forgotPasswordToken = undefined;
        user.forgotPasswordExpiry = undefined;

        // Save changes in DB.
        await user.save({ validateBeforeSave: false });
        return res.status(400).json({
            success: false,
            message: error
        });
    }

});

// this method will work after previous method.
// this method will we called when user click on url provided in mail.
exports.resetPassword = BigPromise(async (req, res, next) => {

    // Get token from params ---> http://localhost:4000/password/reset/{token}
    const token = req.params.token;

    // Encrypt user provided token bcoz we saved encrypted token in DB and to compare DB token and User provided token, we need to encrypt user provided token. 
    const encryToken = crypto.createHash('sha256').update(token).digest('hex');

    // Find user from DB based on token, also worry about expiry time of token. 
    const user = await User.findOne({
        encryToken,
        forgotPasswordExpiry: { $gt: Date.now() }
    });

    // Check if User exist or not, base on "token".
    if (!user) {
        return res.status(400).json({
            success: false,
            message: 'Token is invalid or expired.'
        });
    }

    // We reached till this means user exist in DB, Now its front-end issue that they have to compulsory provide 2 fields --> password, confirmPassword
    // Check weather both fields are provided or not
    if (!(req.body.password && req.body.confirmPassword)) {
        return res.status(400).json({
            success: false,
            message: 'Password and Confirm-Password are required.'
        });
    }

    // If provided fields do not match, thorw error msg.
    if (req.body.password !== req.body.confirmPassword) {
        return res.status(400).json({
            success: false,
            message: 'Password and Confirm-Password do not match.'
        });
    }

    // If provided fields matches, update user password in DB. 
    user.password = req.body.password;

    // After successfully upadating password change forgotPasswordToken and forgotPasswordExpiry to undefined in DB.
    user.forgotPasswordToken = undefined;
    user.forgotPasswordExpiry = undefined;

    // Save changes in DB.
    await user.save();

    // Send a json response or send a Token.
    cookieToken(user, res);
});

// this method will be helpful to reset password when user in logged in means user knows current password and want to change it.
exports.changePassword = BigPromise(async (req, res, next) => {

    // This method works when user is logged in.
    // So that we will have user id added via IsLoggedIn middleware.
    const userId = req.user.id;

    // Find User base on "id".
    const user = await User.findById(req.user.id).select("+password");

    // Now its front-end issue that they have to compulsory provide 2 fields --> oldPassword, newPassword.
    // Check weather both fields are provided or not.
    if (!(req.body.oldPassword && req.body.newPassword)) {
        return res.status(400).json({
            success: false,
            message: 'oldPassword and newPassword are required.'
        });
    }

    // If required fields are provided then verify oldPassword using method defined in user model.
    const isCorrectOldPassword = await user.isvalidatedPassword(req.body.oldPassword);
    if (!isCorrectOldPassword) {
        return res.status(400).json({
            success: false,
            message: 'OldPassword is incorrect.'
        });
    }

    // If oldPassword matches then update password as newPassword.
    user.password = req.body.newPassword;

    // Save changes in DB
    await user.save();

    cookieToken(user, res);
});










//========== Admin only routes ==========//

exports.adminGetAllUser = BigPromise(async (req, res, next) => {

    const users = await User.find();

    res.status(200).json({
        success: true,
        users
    });

});

exports.adminGetSingleUser = BigPromise(async (req, res, next) => {

    // Collect data from Params.
    const { id } = req.params;

    // Check for mandatory a data.
    if (!id) {
        return res.status(400).json({
            success: false,
            message: 'Please provide user id.'
        });
    }

    // Check if User exist or not in DB base on id.
    const user = await User.findById(id);
    if (!user) {
        return res.status(400).json({
            success: false,
            message: 'No user found with given ID.'
        });
    }

    // If User founded, then send its details.
    res.status(200).json({
        success: true,
        user
    });
});

exports.adminUpdateSingleUserDetails = BigPromise(async (req, res, next) => {

    // Collect data from Params.
    const { id } = req.params;

    // Check for mandatory a data.
    if (!id) {
        return res.status(400).json({
            success: false,
            message: 'Please provide user id.'
        });
    }

    // Check if User exist or not in DB base on id.
    var user = await User.findById(id);
    if (!user) {
        return res.status(400).json({
            success: false,
            message: 'No user found with given ID.'
        });
    }

    // This newData object will collect all data that admin want to update.
    var newData = {}

    // Admin will not be able to change name of any user.
    if (req.body.name) {
        return (res.status(400).json({
            success: false,
            message: "Sorry, you can not update name."
        }));
    }

    // Admin will not be able to change email of any user.
    if (req.body.email) {
        return (res.status(400).json({
            success: false,
            message: "Sorry, you can not update email."
        }));
    }

    // Admin will not be able to change password of any user.
    if (req.body.password) {
        return (res.status(400).json({
            success: false,
            message: "Sorry, you can not update password."
        }));
    }

    // Admin will not be able to change photo of any user.
    if (req.files) {
        return (res.status(400).json({
            success: false,
            message: "Sorry, you can not update date of birth."
        }));
    }

    // Admin will not be able to change DOB of any user.
    if (req.body.DOB) {
        return (res.status(400).json({
            success: false,
            message: "Sorry, you can not update date of birth."
        }));
    }

    // Admin will not be able to change gender of any user.
    if (req.body.gender) {
        return (res.status(400).json({
            success: false,
            message: "Sorry, you can not update gender."
        }));
    }

    // Admin will be able to change role of any user.
    if (req.body.role) {
        // Check if provided user role is valid or not as per our project.
        if (!(req.body.role === 'student' || req.body.role === 'faculty' || req.body.role === 'admin')) {
            return res.status(400).json({
                success: false,
                message: 'Please provide role only from - student or faculty or admin.'
            });
        }

        // TODO:: if user's current role is faculty and we are changing it, then take care of courses and blogs vala part.
        // TODO:: if user's current role is student and we are changing it, then take care of courses vala part.

        // If admin is changing role then save that new role in newData object.
        newData.role = req.body.role;
    }

    // Update and save User details in DB.
    user = await User.findByIdAndUpdate(id, newData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    res.status(200).json({
        success: true,
        user
    });
});

exports.adminDeleteSingleUser = BigPromise(async (req, res, next) => {

    // Collect data from Params.
    const { id } = req.params;

    // Check for mandatory a data.
    if (!id) {
        return res.status(400).json({
            success: false,
            message: 'Please provide user id.'
        });
    }

    // Check if User exist or not in DB base on id.
    const user = await User.findById(id);
    if (!user) {
        return res.status(400).json({
            success: false,
            message: 'No user found with given ID.'
        });
    }

    // Get all blog from DB.
    const blogs = await Blog.find();

    // If user photo is there then delete it.
    const imageId = user.photo.id
    if (imageId) {
        const resp = await cloudinary.uploader.destroy(user.photo.id);
    }

    // TODO:: if user's current role is faculty and we are deleting it, then take care of courses vala part.
    // TODO:: handle reviews of courses.


    // If user's role is faculty and he/she has written blogs then delete that blogs too.
    if (user.role === 'faculty') {
        // this for loop will iterate through all blogs.
        for (let i = 0; i < blogs.length; ++i) {
            // this will compare user id available in DB for particular blog with given user id.
            if (blogs[i].author.toString() === id.toString()) {
                // Delete Image of that blog.
                const result = await cloudinary.uploader.destroy(blogs[i].photo.id);
                // remove that blog from DB.
                await blogs[i].remove()
            }
        }
    }


    // If user to be deleted has reviewed and rated a blogs then delete that reviews too.
    // this for loop will iterate through all blogs.
    for (let i = 0; i < blogs.length; ++i) {
        // this for loop will iterate through all reviews of particular blog.
        for (let j = 0; j < blogs[i].reviews.length; ++j) {
            // this will compare user id available in DB for particular review with given user id.
            if (blogs[i].reviews[j].user.toString() === id.toString()) {

                // this new_reviews will have all reviews excluding user reviews we are deleting.
                const new_reviews = blogs[i].reviews.filter(
                    (rev) => rev.user.toString() !== id.toString());

                // update numberOfReviews by finding length of new_reviews.
                const new_numberOfReviews = new_reviews.length;

                // adjust average ratings.
                var new_ratings = new_reviews.reduce((acc, item) => item.rating + acc, 0) / new_reviews.length;

                // if only one review is there and we are deleting user of that review then new_ratings will be set to NaN.
                // so set that new_ratings to zero in place of NaN.
                if (isNaN(new_ratings)) {
                    new_ratings = 0;
                }

                // update and save the blog.
                await Blog.findByIdAndUpdate(blogs[i]._id, {
                    reviews: new_reviews,
                    ratings: new_ratings,
                    numberOfReviews: new_numberOfReviews
                }, {
                    new: true,
                    runValidators: true,
                    useFindAndModify: false
                })
            }
        }
    }

    // remove user from DB.
    await user.remove();

    res.status(200).json({
        success: true,
        message: "User deleted."
    });

});