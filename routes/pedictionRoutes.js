const express = require('express');
const router = express.Router();

const {calculateRank, collegeRecommander} = require('../controller/predicationController');

router.route("/calculateRank").get(calculateRank);
router.route("/collegeRecommander").get(collegeRecommander);

module.exports = router;