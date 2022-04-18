const mongoose = require('mongoose')
const validator = require('validator')

const instituteSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true,"Please Provide Institution Name"],
        trim: true,
        default: ""
    },
    images:[{
        id:{
            type: String,
            required: true,
            default: ""
        },
        secure_url:{
            type: String,
            required: true,
            default: ""
        }
    }],
    logo:[{
        id:{
            type: String,
            required: true,
            default: ""
        },
        secure_url:{
            type: String,
            required: true,
            default: ""
        } 
    }],
    address:{
        type: String,
        // required: [true,"Please Provide Institution Address"]
        default: ""
    },
    city:{
        type: String,
        required: [true,"Please Provide city name"],
        default: ""
    },
    contactNo:{
        type: Number,
        // required: [true,"Please Provide Institution Contact No"],
        maxLength: [11, "Maximum length of Contact no should be 11 characters"],
        default: 0
    },
    mail:{
        type: String,
        // required: [true,"Please Provide Institution Email Address"],
        // validate: [validator.isEmail,"Please provide Email in valid format"],
        // unique: true,
        default: ""
    },
    website:{
        type: String,
        // required: [true, "Please provide Institute mail address"],
        // unique: true,
        default: ""
    },
    branches:{
        type:Object
    },
    facilities:[{
        type:String,
        // required: [true, "Please provide Facilities that institues provide"],
        default: ""
    }],
    fees:{
        type:Number,
        default: ""
    },
    approvedBy:{
        type: String,
        default: ""
    },
    acceptedExam:{
        type: String,
        default: ""
    },
    rating:{
        type:Number,
        default: 0
    },
    numberOfReviews:{
        type:Number,
        default:0
    },
    reviews:[{
        user:{
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            // required: true
        }, 
        name:{
            type: String,
            // required: true
        },
        rating:{
            type: Number,
            // required: true
        },
        comment:{
            type: String,
            // required: true
        }

    }],
    createdAt:{
        type: Date,
        default: Date.now
    }

});

module.exports = mongoose.model('college',instituteSchema);