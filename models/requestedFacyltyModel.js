const mongoose = require("mongoose");
const validator = require("validator");


const requestedFacultySchema = new mongoose.Schema({

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

    IDProff: {
        id: {
            type: String,
        },
        secure_url: {
            type: String,
        }
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});


module.exports = mongoose.model("ReqFaculty", requestedFacultySchema);