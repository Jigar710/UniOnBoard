const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const crypto = require("crypto");


const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, 'Please provide user name.'],
        trim: true
    },

    email: {
        type: String,
        required: [true, 'Please provide user email.'],
        validate: [validator.isEmail, 'Please provide email in correct format.'],
        unique: true,
        trim: true
    },

    password: {
        type: String,
        required: [true, 'Please provide user password.'],
        select: false
    },

    role: {
        type: String,
        require: [true, "Please provide user role from - student or faculty."],
        enum: {
            values: [
                "student",
                "faculty",
                "admin"
            ],
            message: "Please provide role only from - student or faculty."
        }
    },

    photo: {
        id: {
            type: String,
        },
        secure_url: {
            type: String,
        }
    },

    IDProff: {
        id: {
            type: String,
        },
        secure_url: {
            type: String,
        }
    },

    DOB: {
        type: Date,
    },

    // For Student only
    // courses_enrolled: [
    //     {
    //         course: {
    //             type: mongoose.Schema.ObjectId,
    //             ref: "Course",
    //             required: true
    //         },
    //         name: {
    //             type: String,
    //             required: true
    //         }
    //     }
    // ],

    // For Faculty only
    // courses_created: [
    //     {
    //         course: {
    //             type: mongoose.Schema.ObjectId,
    //             ref: "Course",
    //             required: true
    //         },
    //         name: {
    //             type: String,
    //             required: true
    //         }
    //     }
    // ],

    forgotPasswordToken: String,

    forgotPasswordExpiry: Date,

    createdAt: {
        type: Date,
        default: Date.now
    }
});


// Encrypt password before save - HOOKS
userSchema.pre('save', async function (next) {

    // If password is not modified then do not need to bcrypt that.
    if (!this.isModified('password')) {
        return next();
    }

    // If password is modified then bcrypt password for security purpose.
    this.password = await bcrypt.hash(this.password, 10);
});

// Validate the password --> DB password vs user provided password.
userSchema.methods.isvalidatedPassword = async function (userSendPassword) {
    return await bcrypt.compare(userSendPassword, this.password);
};

// Create and return JWT token.
userSchema.methods.getJwtToken = function () {

    // we are just injecting user id in token... we can also inject email and all.
    // we can get back this injected id in token to find user.
    return jwt.sign({ id: this._id },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRY
        });
}

// Generate forgot password token {random string}.
userSchema.methods.getForgotPasswordToken = function () {
    // generate a long random string.
    const forgotToken = crypto.randomBytes(20).toString('hex');

    // getting a hash and store forgotPasswordToken in DB - make sure to get a hash on backend.
    this.forgotPasswordToken = crypto.createHash('sha256').update(forgotToken).digest('hex');

    // store expiry time for forgotPasswordToken in DB.
    this.forgotPasswordExpiry = Date.now() + 20 * 60 * 1000;

    // returning simple string but storing hashed string in DB. So at time when we use this function be sure to handle this situation
    return forgotToken;
}


module.exports = mongoose.model("User", userSchema);