const mongoose = require('mongoose')

const feacture= new mongoose.Schema({

    idInst: {
        type: String
    },

    contentType: {
        type: String,
        enum: {
            values: [
                "blog",
                "institute"
            ],
            message: "Please provide contentType only from - blog or institute."
        }
    },
    
    createdAt: {
        type: Date,
        default: Date.now
    }

});

module.exports = mongoose.model('feature', feacture);