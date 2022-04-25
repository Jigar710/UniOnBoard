const mongoose = require('mongoose')

const PlacementSchema = new mongoose.Schema({
    no:{
        type:Number
    },
    collegeId:{
        type:Object,
        ref:"colleges"
    },
    collegeName:{
        type:String,
        required: [true, "College name is reqired"]
    },
    minPkg:{
        type:Number
    },
    maxPkg:{
        type:Number
    },
    avgPkg:{
        type:Number
    },
    plcRate:{
        type:Number
    },
    majorComp:[{
        type:String
    }],
    lastYearNoOFStudents:{
        type:Number
    },
    createdAt:{
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model('placements',PlacementSchema)