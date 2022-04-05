const express = require("express");
const router = express.Router();


const { signup,
    activateEmail,
    signupFaculty,
    activateEmailFaculty,
    login,
    logout,
    getLoggedInUserDetails,
    updateUserDetails,
    forgotPassword,
    resetPassword,
    updatePassword,
    adminGetAllUser,
    adminUpdateRole,
    adminDeleteSingleUser,
    adminGetRequestedFaculties,
    adminVerifyOneFaculty } = require("../controller/userController");

const { isLoggedIn, customRole } = require("../middleware/userMiddleware");


//========== Student, Faculty, Admin routes ==========//
router.route("/signup").post(signup);
router.route("/activateEmail/:token").post(activateEmail);

router.route("/signupFaculty").post(signupFaculty);
router.route("/activateEmailFaculty/:token").post(activateEmailFaculty);

router.route("/login").post(login);
router.route("/logout").get(logout);

router.route("/dashboard").get(isLoggedIn, getLoggedInUserDetails);
router.route("/dashboard/update").put(isLoggedIn, updateUserDetails);


router.route("/forgotPassword").post(forgotPassword);
router.route("/resetPassword/:token").post(resetPassword);
router.route("/updatePassword").post(isLoggedIn, updatePassword);





//========== Admin only routes ==========//
router.route("/admin/getAllUsers").get(isLoggedIn, customRole("admin"), adminGetAllUser);

router.route("/admin/singleuser/:id")
    .put(isLoggedIn, customRole("admin"), adminUpdateRole)
    .delete(isLoggedIn, customRole("admin"), adminDeleteSingleUser);

router.route("/admin/getRequestedFaculties").get(isLoggedIn, customRole("admin"), adminGetRequestedFaculties);
router.route("/admin/verifyOneFaculty/:id").put(isLoggedIn, customRole("admin"), adminVerifyOneFaculty);







module.exports = router;