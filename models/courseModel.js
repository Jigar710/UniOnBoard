const mongoose = require('mongoose');

const Course = new mongoose.Schema({
    CourseTitle:{
        type : String,
        required : [true,"Please Name Somthing to your Course"]
    },
    CourseLearning:{
        type:String,
        required: [true, "Please Define Learing for Student From this Course"]
    },
    CoursePrerequisite:{
        type:String
    },
    CourseAudience:{
        type: String,
        required: [true, "Please Elaborate Target Audience for this course"]
    },
    Section:[{
        type:String,
        required: [true, "No content for this course please add somthing"]
    }],
    LectureCaption:{
        type:String
    },
    AuthorId:{
        type:Object,
        ref:"users",
        required: [true, "Course creater is required"]
    },
    createdAt:{
        type:Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('courses',Course);