const { bool } = require("joi");
const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({

    title: {
        type: String,
        required: [true, "Please provide blog title."],
        trim: true,
        max: [120, "Blog title should not be more than 120 characters long."]
    },

    photo: {
        id: {
            type: String,
        },
        secure_url: {
            type: String,
        }
    },

    content: {
        type: String,
        required: [true, "Please provide blog content."]
    },

    // category: {
    //     type: String,
    //     required: [true, "Please provide blog category."]
    // },

    ratings: {
        type: Number,
        default: 0
    },

    numberOfReviews: {
        type: Number,
        default: 0
    },

    reviews: [
        {
            user: {
                type: mongoose.Schema.ObjectId,
                ref: "User",
                required: true
            },
            name: {
                type: String,
                required: true
            },
            rating: {
                type: Number,
                required: true
            },
            comment: {
                type: String,
                required: true
            },
        }
    ],

    author: {
        authorID: {
            type: mongoose.Schema.ObjectId,
            ref: "User",
            required: true
        },
        authorName: {
            type: String,
            required: true
        },
    },

    // tag: {
    //     type: bool
    // },

    createdAt: {
        type: Date,
        default: Date.now
    }
});


module.exports = mongoose.model("Blog", blogSchema);