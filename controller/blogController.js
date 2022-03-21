const Blog = require("../models/blogModel");
const User = require("../models/userModel");
const BigPromise = require("../middleware/bigPromise");
const cloudinary = require("cloudinary").v2;
const { addBlogValidation, addReviewValidation } = require("../models/validation");


//========== Student, Faculty, Admin routes ==========//

exports.getAllBlogs = BigPromise(async (req, res, next) => {

    const blogs = await Blog.find();

    res.status(200).json({
        success: true,
        blogs
    });

});

exports.getOneBlog = BigPromise(async (req, res, next) => {

    // Collect data from Params.
    const { id } = req.params;

    // Check for mandatory a data.
    if (!id) {
        return res.status(400).json({
            success: false,
            message: 'Please provide user id.'
        });
    }

    // Check if User exist or not in DB base on id.
    const blog = await Blog.findById(id);
    if (!blog) {
        return res.status(400).json({
            success: false,
            message: 'No blog found with given ID.'
        });
    }

    res.status(200).json({
        success: true,
        blog,
    })
});

exports.getParticularFacultyBlogs = BigPromise(async (req, res, next) => {

    // Collect data from Params.
    const { id } = req.params;

    // Check for mandatory a data.
    if (!id) {
        return res.status(400).json({
            success: false,
            message: 'Please provide user id.'
        });
    }

    // Check if User exist or not in DB base on id.
    const user = await User.findById(id);
    if (!user) {
        return res.status(400).json({
            success: false,
            message: 'No user found with given ID.'
        });
    }

    // Get Blog where author matches.
    const blogs = await Blog.find({"author.authorID": id});

    res.status(200).json({
        success: true,
        blogs,
    })

});

exports.addReview = BigPromise(async (req, res, next) => {

    // Collect data from Body and Params.
    const { rating, comment } = req.body;
    const { blogId } = req.params;

    // Check for mandatory a data.
    if (!blogId) {
        return res.status(400).json({
            success: false,
            message: `"blogId" is required.`
        });
    }
    const { error } = addReviewValidation(req.body);
    if (error) {
        return res.status(400).json({
            success: false,
            message: error.details[0].message
        });
    }

    // review object will have all necessary data that has to be present while adding review.
    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating), // its front-end's responsibility to restrict rating between 0 to 5.
        comment
    }

    // Check if Blog exist or not in DB base on id for which we are trying to add review.
    const blog = await Blog.findById(blogId);
    if (!blog) {
        return res.status(400).json({
            success: false,
            message: "Blog with given ID does not exists."
        })
    }

    // Check if user has already added review or not.
    // req.user will be added via IsLoggedIn middleware.
    const AlreadyReview = blog.reviews.find(
        (rev) => rev.user.toString() === req.user._id.toString()
    )

    // If user has already added review then do following. 
    if (AlreadyReview) {
        blog.reviews.forEach((review) => {
            // iterate through all reviews of that blog and find review with user id from which we are trying to add review.
            if (review.user.toString() === req.user._id.toString()) {
                // when such review founded update that review content.
                review.comment = comment
                review.rating = rating
                // need not to change numberOfReviews field.
            }
        })
    }
    // If user has not already added review then do following. 
    else {
        // add review object we had created to reviews array of DB.
        blog.reviews.push(review)
        // update numberOfReviews field by finding length of reviews array of DB.
        blog.numberOfReviews = blog.reviews.length
    }

    // adjust average ratings
    blog.ratings = blog.reviews.reduce((acc, item) => item.rating + acc, 0) / blog.reviews.length

    // update and save in DB
    await blog.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true
    })

});

exports.deleteReview = BigPromise(async (req, res, next) => {

    // Collect data from Params.
    const { blogId } = req.params;

    // Check for mandatory a data.
    if (!blogId) {
        return res.status(400).json({
            success: false,
            message: `"blogId" is required.`
        });
    }

    // Check if Blog exist or not in DB base on id for which we are trying to delete review.
    const blog = await Blog.findById(blogId);
    if (!blog) {
        return res.status(400).json({
            success: false,
            message: "Blog with given ID does not exists."
        })
    }

    // TODO:: what if user did not reviewed and try to delete review.

    // this reviews will have all reviews excluding reviews of user we are trying to delete.
    // req.user will be added via IsLoggedIn middleware.
    const reviews = blog.reviews.filter(
        (rev) => rev.user.toString() !== req.user._id.toString()
    )

    // update numberOfReviews field by finding length of reviews array of DB.
    const numberOfReviews = reviews.length

    // adjust average ratings.
    const ratings = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length

    // if only one review is there and we are deleting user of that review then new_ratings will be set to NaN.
    // so set that new_ratings to zero in place of NaN.
    if (isNaN(ratings)) {
        ratings = 0;
    }

    // update and save the blog.
    await Blog.findByIdAndUpdate(blogId, {
        reviews,
        ratings,
        numberOfReviews
    }, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true
    })

});

exports.getOnlyReviewsForOneBlog = BigPromise(async (req, res, next) => {

    // Collect data from Params.
    const { blogId } = req.params;

    // Check for mandatory a data.
    if (!blogId) {
        return res.status(400).json({
            success: false,
            message: `"blogId" is required.`
        });
    }

    // Check if Blog exist or not in DB base on id for which we are trying to fetch review.
    const blog = await Blog.findById(blogId);
    if (!blog) {
        return res.status(400).json({
            success: false,
            message: "Blog with given ID does not exists."
        })
    }

    res.status(200).json({
        success: true,
        reviews: blog.reviews // return reviews array of that particular blog.
    })

});










//========== Faculty only routes ==========//

exports.addBlog = BigPromise(async (req, res, next) => {

    // Check for mandatory a data. --> title , content.
    const { error } = addBlogValidation(req.body);
    if (error) {
        return res.status(400).json({
            success: false,
            message: error.details[0].message
        });
    }
    if (!req.files) {
        return res.status(400).json({
            success: false,
            message: `"photo" is required.`
        });
    }

    // Handle Image -----> It is front-end's responsiblity to be sure that only one Image in coming.
    var result;
    if (req.files) {
        let file = req.files.photo;

        // Image size should be less than 1 MB.
        if (file.size > 1024 * 1024) {
            return res.status(400).json({
                success: false,
                message: "Size too large."
            })
        }

        // Only jpeg or png file are allowed.
        if (file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png') {
            return res.status(400).json({
                success: false,
                message: "File format is incorrect. Acceptable image format - jpeg, png "
            })
        }

        result = await cloudinary.uploader.upload(file.tempFilePath, {
            folder: "blogs",
        });

        // As image is not coming from body, so save image in body.
        req.body.photo = {
            id: result.public_id,
            secure_url: result.secure_url
        }
    }

    // we need author id, that will come from req.user via IsLoggedIn middleware. 
    // req.body.author = req.user.id
    req.body.author = {
        authorID: req.user.id,
        authorName: req.user.name
    }

    // create blog and save it in DB.
    const blog = await Blog.create(req.body)

    // Check if blog is created or not.
    if (!blog) {
        return res.status(400).json({
            success: false,
            message: 'Blog creation failed.'
        });
    }

    res.status(200).json({
        success: true,
        blog
    });

});

exports.editBlog = BigPromise(async (req, res, next) => {

    // Collect data from Params.
    const { id } = req.params;

    // Check for mandatory a data.
    if (!id) {
        return res.status(400).json({
            success: false,
            message: `"blog id" is required.`
        });
    }

    // Check if Blog exist or not in DB base on id.
    let blog = await Blog.findById(req.params.id);
    if (!blog) {
        return res.status(400).json({
            success: false,
            message: "Blog with given ID does not exists."
        })
    }

    // Check if auther is valid or not
    // compare author id coming from DB with req.user._id coming from IsLoggedIn middleware.
    if (String(req.user._id) !== String(blog.author.authorID)) {
        return res.status(400).json({
            success: false,
            message: "You are not the author of this blog."
        })
    }

    // Handle image if it is coming.
    if (req.files) {
        // Destroy existing image.
        const res = await cloudinary.uploader.destroy(blog.photo.id);

        // upload new photo -----> It is front-end's responsiblity to be sure that only one Image in coming.
        var result;
        if (req.files) {
            let file = req.files.photo;

            // Image size should be less than 1 MB.
            if (file.size > 1024 * 1024) {
                return res.status(400).json({
                    success: false,
                    message: "Size too large."
                })
            }

            // Only jpeg or png file are allowed.
            if (file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png') {
                return res.status(400).json({
                    success: false,
                    message: "File format is incorrect. Acceptable image format - jpeg, png "
                })
            }

            result = await cloudinary.uploader.upload(file.tempFilePath, {
                folder: "blogs",
            });
        }

        // As image is not coming from body, so save image in body.
        req.body.photo = {
            id: result.public_id,
            secure_url: result.secure_url
        }
    }

    // update and save blod in DB.
    blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });

    res.status(200).json({
        success: true,
        blog
    });
});

exports.deleteBlog = BigPromise(async (req, res, next) => {

    // Collect data from Params.
    const { id } = req.params;

    // Check for mandatory a data.
    if (!id) {
        return res.status(400).json({
            success: false,
            message: `"blog id" is required.`
        });
    }

    // Check if Blog exist or not in DB base on id.
    let blog = await Blog.findById(req.params.id);
    if (!blog) {
        return res.status(400).json({
            success: false,
            message: "Blog with given ID does not exists."
        })
    }

    // Check if auther is valid or not.
    // compare author id coming from DB with req.user._id coming from IsLoggedIn middleware.
    if (String(req.user._id) !== String(blog.author.authorID)) {
        return res.status(400).json({
            success: false,
            message: "You are not the author of this blog."
        })
    }

    // Delete Image.
    const result = await cloudinary.uploader.destroy(blog.photo.id);

    // Delete blog from DB.
    await blog.remove()

    res.status(200).json({
        success: true,
        message: "Blog deleted."
    });
});

exports.getFacultyPersonalBlogs = BigPromise(async (req, res, next) => {

    // Find blogs where author is req.user._id coming from IsLoggedIn middleware.
    const blogs = await Blog.find({"author.authorID": req.user._id});

    res.status(200).json({
        success: true,
        blogs,
    })

});










//========== Faculty only routes ==========//

exports.adminDeleteBlog = BigPromise(async (req, res, next) => {

    // Collect data from Params.
    const { id } = req.params;

    // Check for mandatory a data.
    if (!id) {
        return res.status(400).json({
            success: false,
            message: `"blog id" is required.`
        });
    }

    // Check if Blog exist or not in DB base on id.
    let blog = await Blog.findById(req.params.id);
    if (!blog) {
        return res.status(400).json({
            success: false,
            message: "Blog with given ID does not exists."
        })
    }

    // Delete Image.
    const result = await cloudinary.uploader.destroy(blog.photo.id);

    // Delete blog from DB.
    await blog.remove()

    res.status(200).json({
        success: true,
        message: "Blog deleted."
    });
});