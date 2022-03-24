const express = require("express");
const router = express.Router();

const { getInstHome } = require("../controller/adminController")

router.route("/getHomeInst").get(getInstHome);


module.exports = router;