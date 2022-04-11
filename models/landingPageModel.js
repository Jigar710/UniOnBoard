const mongoose = require('mongoose');

const LandingPageData = new mongoose.Schema({
    CourseId:{
        type:Object,
        ref:'course'
    },
    CourseTitle:{
        type:String,
        required:[true,"Please Name Somthing to your Course"]
    },
    CourseSubTitle:{
        type:String
    },
    CourseDesc:{
        type:String,
        required:[true,"Please Describe Somthing about course"]
    },
    CourseLanguage:{
        type:String,
        enum:[
            "English",
            "Gujarati",
            "Hindi"
        ],
        default:"English"
    },
    DifficultyLevel:{
        type:String,
        enum:[
            "Beginner",
            "Intermediate",
            "Advanced",
            "Mixed"
        ],
        default:"Mixed"
    },
    CourseCategory:[{
        type:String,
        required: [true,"Please Select Something from Category"] ,
        enum:[
            "Development",
            "Bussiness",
            "IT & Software",
            "Personal Development",
            "Design",
            "Marketing",
            "Lifestyle",
            "Photography",
            "Health & Fitness",
            "Music",
            "Teaching & Academics",
            "Other"
        ]
    }],
    CourseLearing:{
        type:String,
        required:[true, "Please write primary learning of course"]
    },
    CourseImg:{
        id:{
            type: String,
            default: ""
        },
        secure_url:{
            type: String,
            required: true,
            default: ""
        } 
    },
    CoursePromo:{
        id:{
            type: String,
            default: ""
        },
        secure_url:{
            type: String,
            default: ""
        } 
    },
    Pricing:{
        type:Number,
        required: [true,"Please select pricing of the course"]
    },
    CouponCode:{
        tyep:String
    },
    WelcomeMessage:{
        type:String,
        required:[true,"Please write Welcome message for your course"]
    },
    CongoMessage:{
        type:String,
        required: [true, "Please write Congretlations message for your course user"]
    },
    Mode:{
        type:String,
        enum:[
            "Live",
            "Draft"
        ]
    }

})

module.exports = mongoose.model('courselanding',LandingPageData);