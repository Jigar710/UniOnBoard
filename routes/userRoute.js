const express = require("express");
const router = express.Router();

const { home,signup,
    login,
    logout,
    getLoggedInUserDetails,
    updateUserDetails,
    forgotPassword,
    resetPassword,
    changePassword,
    adminGetAllUser,
    adminGetSingleUser,
    adminUpdateSingleUserDetails,
    adminDeleteSingleUser } = require("../controller/userController");

const { isLoggedIn, customRole } = require("../middleware/userMiddleware");


//========== Student, faculty, Admin routes ==========//
router.route("/").get(home);
router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/logout").get(logout);

router.route("/userdashboard").get(isLoggedIn, getLoggedInUserDetails);
router.route("/userdashboard/update").put(isLoggedIn, updateUserDetails);

router.route("/forgotPassword").post(forgotPassword);
router.route("/password/reset/:token").post(resetPassword);
router.route("/password/update").post(isLoggedIn, changePassword);





//========== Admin only routes ==========//
router.route("/admin/getAllUsers").get(isLoggedIn, customRole("admin"), adminGetAllUser);
router.route("/admin/singleuser/:id")
    .get(isLoggedIn, customRole("admin"), adminGetSingleUser)
    .put(isLoggedIn, customRole("admin"), adminUpdateSingleUserDetails)
    .delete(isLoggedIn, customRole("admin"), adminDeleteSingleUser);





module.exports = router;