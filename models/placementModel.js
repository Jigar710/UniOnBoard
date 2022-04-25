const mongoose = require('mongoose')

const PlacementSchema = new mongoose.Schema({
    no:{
        type:Number
    },
    collegeId:{
        type:String,
        ref:"colleges"
    },
    collegeName:{
        type:String,
        required: [true, "College name is reqired"]
    },
    minPkg
})