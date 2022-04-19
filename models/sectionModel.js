const mongoose = require('mongoose');

const Section = new mongoose.Schema({
    CourseId:{
        type:mongoose.Schema.ObjectId,
        ref:'courses'
    },
    SectionNo:{
        type:Number,
        required:[true ,"Please Provide section Number"]
    },
    SectionName:{
        type: String,
        required: [true, "Please Provide Section name"]
    },
    LectureNo:{
        type:Number,
        required:[true ,"Please Provide Lecture Number"]
    },
    ContentType:{
        type:String,
        enum:[
            "video",
            "slide",
            "page"
        ],
        default:"video"
    },
    VideoName:{
        type:String,
        required:[true, "Please Provide Lecture name"]
    },
    LectureVideo:{
        id:{
            type: String,
            default: ""
        },
        secure_url:{
            type: String,
            default: ""
        } 
    },
    LectureDesc:{
        type:String
    },
    LectureResourceFile:{
        id:{
            type: String,
            default: ""
        },
        secure_url:{
            type: String,
            default: ""
        } 
    }
});


module.exports = mongoose.model('sections',Section);