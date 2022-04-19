const mongoose = require('mongoose');

const meritSchema = new mongoose.Schema({
    no:{
        type:Number,
        required: true
    },
    college_id:{
        type:String,
        required:true,
        default: "NONE"
    },
    institute:{
        type:String,
        required:true
    },
    city:{
        type:String,
        required:true
    },
    course:{
        type:String,
        required:true
    },
    ic_code:{
        type:String,
    },
    open_rank:{
        type:Number
    },
    open_mmark:{
        type:Number
    },
    sc_rank:{
        type:Number
    },
    sc_mmark:{
        type:Number
    },
    st_rank:{
        type:Number
    },
    st_mmark:{
        type:Number
    },
    sebc_rank:{
        type:Number
    },
    sebc_mmark:{
        type:Number
    },
    ews_rank:{
        type:Number
    },
    ews_mmark:{
        type:Number
    },
    aiop_rank:{
        type:Number
    }
})

module.exports = mongoose.model('merits', meritSchema);