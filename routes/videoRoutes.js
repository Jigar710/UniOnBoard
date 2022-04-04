const express = require('express');
const router = express.Router();

const {addCourseBasic, addSectionContent, addLandingPage} = require('../controller/courseController');

router.route('/addCourseOverview').post(addCourseBasic);
router.route('/addSectionContent').post(addSectionContent);
router.route('/addLandingPage').post(addLandingPage);

module.exports = router;