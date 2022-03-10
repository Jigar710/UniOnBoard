const express = require("express");
const router = express.Router();

const { getAllInstitute, getParticularInstitute } = require("../controller/instituteController");
const { isLoggedIn, customRole } = require("../middleware/userMiddleware");


router.route("/getAllInstitute").get(getAllInstitute);
router.route("/getParticularInstitute/:id").get(getParticularInstitute);



module.exports = router;
