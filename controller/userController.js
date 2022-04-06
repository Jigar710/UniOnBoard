const User = require("../models/userModel");
const Blog = require("../models/blogModel");
const ReqFaculty = require("../models/requestedFacyltyModel");
const BigPromise = require("../middleware/bigPromise");
const cookieToken = require("../utils/cookieToken");
const cloudinary = require("cloudinary").v2;
const { signValidation, loginValidation } = require("../models/validation");
const { mailHelper, mailHelperFaculty } = require("../utils/emailHelper");
const crypto = require("crypto");
const jwt = require("jsonwebtoken")
const { CLIENT_URL } = process.env



//========== Student, Faculty, Admin routes ==========//
exports.signup = BigPromise(async (req, res, next) => {

    // Collect data from Body.
    const { name, email, password, conf_password, role } = req.body;

    // Check for mandatory a data.
    const { error } = signValidation(req.body);
    if (error) {
        return res.status(400).json({
            success: false,
            message: error.details[0].message
        });
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

    // Collect all information of user.
    const newUser = {
        name,
        email,
        password,
        role
    }

    // Create token containing all information of user.
    const activation_token = createActivationToken(newUser);

    // Generate url --> http://localhost:4000/activateEmail/{activation_token}
    const url = `${CLIENT_URL}/activateEmail/${activation_token}`

    // Attempt to send mail.
    try {
        await mailHelper({
            email: email,
            subject: `UniOnBoard - Activate your account`,
            url: url,
            txt: "Validate Email"
        });

        // Json responce if mail is sent.
        res.status(200).json({
            success: true,
            message: "Registered successfully, Please activate your email to start."
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error
        });
    }


});

exports.activateEmail = BigPromise(async (req, res) => {

    // Collect data from Params.
    const { token } = req.params

    // Check for mandatory a data.
    if (!token) {
        return res.status(400).json({
            success: false,
            message: 'Unauthorised Access'
        });
    }

    // Decode user information stored in token
    const userInfo = jwt.verify(token, process.env.ACTIVATION_TOKEN_SECRET)

    // Collect all information of user.
    const { name, email, password, role } = userInfo

    // Create and save user in DB.
    const user = new User({
        name, email, password, role
    })
    await user.save()

    res.status(200).json({
        success: true,
        message: "Account has been activated. Please Login"
    });




});

exports.signupFaculty = BigPromise(async (req, res, next) => {

    // Collect data from Body.
    const { name, email, password, conf_password, role } = req.body;

    // Check for mandatory a data.
    const { error } = signValidation(req.body);
    if (error) {
        return res.status(400).json({
            success: false,
            message: error.details[0].message
        });
    }
    if (!req.files) {
        return res.status(400).json({
            success: false,
            message: "Faculty ID proff is required."
        });
    }
    // Check if both password fields matched or not.
    if (password !== conf_password) {
        return res.status(400).json({
            success: false,
            message: 'Password and Confirm Password does not matched.'
        });
    }

    const { idProff } = req.files

    // Check duplicate User base on email.
    var emailExist = await ReqFaculty.findOne({ email });
    if (emailExist) {
        return res.status(400).json({
            success: false,
            message: 'You have already requested. Please wait for admin responce'
        });
    }
    emailExist = await User.findOne({ email })
    if (emailExist) {
        return res.status(400).json({
            success: false,
            message: 'User with this email already exists.'
        });
    }

    // Check if provided user role is valid or not as per our project.
    if (!(role === 'student' || role === 'faculty')) {
        return res.status(400).json({
            success: false,
            message: 'Please provide role only from - student or faculty.'
        });
    }


    // Collect all information of user.
    const newUser = {
        name,
        email,
        password,
        role,
        idProff
    }

    // Create token containing all information of user.
    const activation_token = createActivationToken(newUser);

    // Generate url --> http://localhost:4000/activateEmail/{activation_token}
    const url = `${CLIENT_URL}/activateEmailFaculty/${activation_token}`

    // Attempt to send mail.
    try {
        await mailHelper({
            email: email,
            subject: `UniOnBoard - Activate your account`,
            url: url,
            txt: "Validate Email"
        });

        // Json responce if mail is sent.
        res.status(200).json({
            success: true,
            message: "Registered successfully, Please activate your email to start."
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            k: "kalp",
            message: error
        });
    }

});

exports.activateEmailFaculty = BigPromise(async (req, res) => {

    // Collect data from Params.
    const { token } = req.params

    // Check for mandatory a data.
    if (!token) {
        return res.status(400).json({
            success: false,
            message: 'Unauthorised Access'
        });
    }

    // Decode user information stored in token
    const userInfo = jwt.verify(token, process.env.ACTIVATION_TOKEN_SECRET)

    // Collect all information of user.
    var { name, email, password, role, idProff } = userInfo

    // Image size should be less than 1 MB.
    if (idProff.size > 1024 * 1024) {
        return res.status(400).json({
            success: false,
            message: "Photo size is too large."
        })
    }

    // Only jpeg or png file are allowed.
    if (idProff.mimetype !== 'image/jpeg' && idProff.mimetype !== 'image/png') {
        return res.status(400).json({
            success: false,
            message: "File format is incorrect. Acceptable image format - jpeg, png "
        })
    }

    const result = await cloudinary.uploader.upload(idProff.tempFilePath, {
        folder: "Faculty ID Proff",
        width: 150,
        crop: "scale"
    });

    idProff = {
        id: result.public_id,
        secure_url: result.secure_url
    }

    // Create and save user in DB.
    const user = new ReqFaculty({
        name, email, password, role, "IDProff": idProff
    })
    await user.save()

    res.status(200).json({
        success: true,
        message: "You will be authorised faculty on our plateform, once admin verify your details.This process may takes one or two days."
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

        // Image size should be less than 1 MB.
        if (file.size > 1024 * 1024) {
            return res.status(400).json({
                success: false,
                message: "Photo size is too large."
            })
        }

        // Only jpeg or png file are allowed.
        if (file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png') {
            return res.status(400).json({
                success: false,
                message: "File format is incorrect. Acceptable image format - jpeg, png "
            })
        }

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
        message: "Details Updated",
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
    const url = `${CLIENT_URL}/resetPassword/${forgotToken}`

    // Attempt to send mail.
    try {
        await mailHelper({
            email: email,
            subject: `UniOnBoard - Password Reset Email`,
            url: url,
            txt: "Reset password"
        });

        // Json responce if mail is sent.
        res.status(200).json({
            success: true,
            message: "Password has been sent to your email."
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
    const { password, conf_password } = req.body
    const { token } = req.params;

    // Check for mandatory a data.
    if (!(password && conf_password)) {
        return res.status(400).json({
            success: false,
            message: 'Please provide Password and Confirm-Password'
        });
    }
    if (password !== conf_password) {
        return res.status(400).json({
            success: false,
            message: 'Password and Confirm-Password do not match.'
        });
    }
    if (!token) {
        return res.status(400).json({
            success: false,
            message: 'Unauthorised Access'
        });
    }

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
            message: 'Unauthorised Access'
        });
    }

    // We reached till this means user exist in DB.
    // Update user password in DB. 
    user.password = req.body.password;

    // After successfully upadating password change forgotPasswordToken and forgotPasswordExpiry to undefined in DB.
    user.forgotPasswordToken = undefined;
    user.forgotPasswordExpiry = undefined;

    // Save changes in DB.
    await user.save();

    res.status(200).json({
        success: true,
        message: "Password has been updated. Please login."
    });
});

// this method will be helpful to reset password when user in logged in means user knows current password and want to change it.
exports.updatePassword = BigPromise(async (req, res, next) => {

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

    res.status(200).json({
        success: true,
        message: "Password Changed"
    })
});










//========== Admin only routes ==========//

exports.adminGetAllUser = BigPromise(async (req, res, next) => {

    const users = await User.find();

    res.status(200).json({
        success: true,
        users
    });

});

exports.adminUpdateRole = BigPromise(async (req, res) => {

    // Collect data.
    const { id } = req.params;
    const { role } = req.body;

    if (!id) {
        return res.status(400).json({
            success: false,
            message: 'Please provide user id.'
        });
    }
    if (!role) {
        return res.status(400).json({
            success: false,
            message: 'Please provide user role.'
        });
    }
    if (!(role === 'student' || role === 'faculty')) {
        return res.status(400).json({
            success: false,
            message: 'Please provide role only from - student or faculty.'
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

    user = await User.findByIdAndUpdate(id, { role: role }, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    res.status(200).json({
        success: true,
        message: "Role updated.",
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
            if (blogs[i].author.authorID.toString() === id.toString()) {
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

exports.adminGetRequestedFaculties = BigPromise(async (req, res, next) => {

    const reqFaculties = await ReqFaculty.find().select("-password");

    res.status(200).json({
        success: true,
        faculties: reqFaculties
    });

});

exports.adminVerifyOneFaculty = BigPromise(async (req, res, next) => {

    // Collect data.
    const { id } = req.params;
    const { tag } = req.body;

    if (!id) {
        return res.status(400).json({
            success: false,
            message: 'Please provide user id.'
        });
    }
    if (!tag) {
        return res.status(400).json({
            success: false,
            message: 'Please provide verification tag.'
        });
    }
    if (!(tag === 'verified' || tag === 'unverified')) {
        return res.status(400).json({
            success: false,
            message: 'Please provide tag only from - verified or unverified.'
        });
    }


    // Check if such requested faculty exist or not in DB base on id.
    var reqFaculty = await ReqFaculty.findById(id).select("+password");
    if (!reqFaculty) {
        return res.status(400).json({
            success: false,
            message: 'No such request.'
        });
    }

    const { name, email, password, role, IDProff } = reqFaculty

    if (tag === 'verified') {

        // Create and save faculty in User schema.
        const faculty = new User({
            name, email, password, role, IDProff
        })
        await faculty.save()

        // remove faculty from reqfaculties schema.
        await reqFaculty.remove();

        // Respnoce to faculty
        // Attempt to send mail.
        try {
            await mailHelperFaculty({
                email: email,
                subject: `UniOnBoard - Verification of your account`,
                txt: "Your are verified successfully. Please continue with our plateform."
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error
            });
        }

        // Respnoce to admin
        res.status(200).json({
            success: true,
            message: "Faculty has been verified successfully."
        });

    }
    else if (tag === 'unverified') {

        // If faculty photo is there then delete it.
        const imageId = reqFaculty.IDProff.id
        if (imageId) {
            const resp = await cloudinary.uploader.destroy(reqFaculty.IDProff.id);
        }

        // remove faculty from reqfaculties schema.
        await reqFaculty.remove();

        // Respnoce to faculty
        // Attempt to send mail.
        try {
            await mailHelperFaculty({
                email: email,
                subject: `UniOnBoard - Verification of your account`,
                txt: "Sorry, we find something unusual in your request. So your request has been declined."
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error
            });
        }

        // Respnoce to admin
        res.status(200).json({
            success: true,
            message: "Faculty has been unverified successfully."
        });

    }

});









const createActivationToken = (payload) => {
    return jwt.sign(payload, process.env.ACTIVATION_TOKEN_SECRET, { expiresIn: '5m' });
}