const express = require('express');
const router = express.Router();

const {calculateRank, collegeRecommander} = require('../controller/predicationController');

router.route("/calculateRank").post(calculateRank);
router.route("/collegeRecommander").get(collegeRecommander);

module.exports = router;