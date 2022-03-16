const express = require("express");
const router = express.Router();

const { addBlog,
    editBlog,
    deleteBlog,
    getFacultyPersonalBlogs,
    getAllBlogs,
    getOneBlog,
    getParticularFacultyBlogs,
    addReview,
    deleteReview,
    getOnlyReviewsForOneBlog,
    adminDeleteBlog } = require("../controller/blogController");

const { isLoggedIn, customRole } = require("../middleware/userMiddleware");


//========== Student, Faculty, Admin routes ==========//
router.route("/getAllBlog").get(isLoggedIn, getAllBlogs);
router.route("/getOneBlog/:id").get(isLoggedIn, getOneBlog);
router.route("/getParticularFacultyBlogs/:id").get(isLoggedIn, getParticularFacultyBlogs);
router.route("/review/:blogId")
    .put(isLoggedIn, addReview)
    .delete(isLoggedIn, deleteReview)
    .get(isLoggedIn, getOnlyReviewsForOneBlog);





//========== Faculty only routes ==========//
router.route("/faculty/blog/add").post(isLoggedIn, customRole("faculty"), addBlog);
router.route("/faculty/getFacultyPersonalBlogs").get(isLoggedIn, customRole("faculty"), getFacultyPersonalBlogs);

router.route("/faculty/blog/:id")
    .put(isLoggedIn, editBlog)
    .delete(isLoggedIn, deleteBlog)





//========== Admin only routes ==========//
router.route("/admin/blog/:id").delete(isLoggedIn, customRole('admin'), adminDeleteBlog)




module.exports = router;