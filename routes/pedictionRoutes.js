const express = require('express');
const router = express.Router();

const {calculateRank, collegeRecommander, getCollegeList, getCityList, getBranchList, dataForComparison, getAllPlcData} = require('../controller/predicationController');

router.route("/calculateRank").post(calculateRank);
router.route("/collegeRecommander").post(collegeRecommander);
router.route("/comparison/:id").get(dataForComparison);
router.route("/getAllPlcData").get(getAllPlcData);
router.route("/getBranchList").get(getBranchList);
router.route("/getCityList").get(getCityList);
router.route("/getCollegeList").get(getCollegeList);

module.exports = router;