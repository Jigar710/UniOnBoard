const express = require('express');
const router = express.Router();

const {addCourseBasic, addSectionContent, addLandingPage,getAllCourses, findAllSections,getAllLandingPageData, createOrder, addPurchageData, getPurchases} = require('../controller/courseController');
const { isLoggedIn, customRole } = require("../middleware/userMiddleware");

router.route('/addCourseOverview').post(isLoggedIn, customRole("admin"), addCourseBasic);
router.route('/addSectionContent').post(isLoggedIn, customRole("admin"), addSectionContent);
router.route('/addLandingPage').post(isLoggedIn, customRole("admin"), addLandingPage);
router.route('/addPurchageData/:id').post(isLoggedIn, addPurchageData);
router.route('/placeOrder').post(isLoggedIn,createOrder);
router.route('/getCourses').get(getAllCourses);
router.route('/getCourseContent/:id').get(findAllSections);
router.route('/getPurchases/:id').get(isLoggedIn,getPurchases);
router.route('/getLandingPageData/:id').get(getAllLandingPageData);

module.exports = router;
 