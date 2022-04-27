const express = require('express');
const router = express.Router();

const {addCourseBasic, addSectionContent, addLandingPage,updateCourseBasic,updateSectionContent,updateLandingPage,getAllCourses, findAllSections,getAllLandingPageData,getPerticularCourse,deleteFacultyCourse,getAllFacultyCourse, createOrder, addPurchageData, getPurchases} = require('../controller/courseController');
const { isLoggedIn, customRole } = require("../middleware/userMiddleware");

router.route('/addCourseOverview').post(isLoggedIn, customRole("admin"), addCourseBasic);
router.route('/addSectionContent').post(isLoggedIn, customRole("admin"), addSectionContent);
router.route('/addLandingPage').post(isLoggedIn, customRole("admin"), addLandingPage);
router.route('/updateCourseOverview').post(isLoggedIn, customRole("admin"), updateCourseBasic);
router.route('/updateSectionContent').post(isLoggedIn, customRole("admin"), updateSectionContent);
router.route('/updateLandingPage').post(isLoggedIn, customRole("admin"), updateLandingPage);
router.route('/addPurchageData/:id').post(isLoggedIn, addPurchageData);
router.route('/getAllFacultyCourse').get(isLoggedIn, getAllFacultyCourse);
router.route('/getPerticularCourse/:id').get(isLoggedIn, getPerticularCourse);

router.route('/placeOrder').post(isLoggedIn,createOrder);
router.route('/getCourses').get(getAllCourses);
router.route('/getCourseContent/:id').get(findAllSections);
router.route('/getPurchases/:id').get(isLoggedIn,getPurchases);
router.route('/getLandingPageData/:id').get(getAllLandingPageData);

router.route('/deleteFacultyCourse/:id').post(isLoggedIn, deleteFacultyCourse);
module.exports = router;
 