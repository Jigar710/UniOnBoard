const express = require('express');
const router = express.Router();

const {calculateRank, collegeRecommander, getCollegeList, getCityList, getBranchList} = require('../controller/predicationController');

router.route("/calculateRank").post(calculateRank);
router.route("/collegeRecommander").get(collegeRecommander);
router.route("/getBranchList").get(getBranchList);
router.route("/getCityList").get(getCityList);
router.route("/getCollegeList").get(getCollegeList);

module.exports = router;