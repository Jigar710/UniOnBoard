const express = require('express');
const router = express.Router();

const {addCourseBasic, addSectionContent, addLandingPage,getAllCourses, findAllSections,getAllLandingPageData} = require('../controller/courseController');
const { isLoggedIn, customRole } = require("../middleware/userMiddleware");

router.route('/addCourseOverview').post(isLoggedIn, customRole("admin"), addCourseBasic);
router.route('/addSectionContent').post(isLoggedIn, customRole("admin"), addSectionContent);
router.route('/addLandingPage').post(isLoggedIn, customRole("admin"), addLandingPage);
router.route('/getCourses').get(getAllCourses);
router.route('/getCourseContent/:id').get(findAllSections);
router.route('/getLandingPageData/:id').get(getAllLandingPageData);

module.exports = router;
 