const express = require('express');
const router = express.Router();

const {addCourseBasic, addSectionContent, addLandingPage,getAllCourses, findAllSections,getAllLandingPageData} = require('../controller/courseController');

router.route('/addCourseOverview').post(addCourseBasic);
router.route('/addSectionContent').post(addSectionContent);
router.route('/addLandingPage').post(addLandingPage);
router.route('/getCourses').get(getAllCourses);
router.route('/getCourseContent/:id').get(findAllSections);
router.route('/getLandingPageData/:id').get(getAllLandingPageData);

module.exports = router;
