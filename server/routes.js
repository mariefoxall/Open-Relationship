const {
  submitApplication,
  viewApplications,
  approveApplication,
  denyApplication,
  checkApplicationForSignup,
  confirmUser,
  createNewUser,
  verifyUserForSignin,
  // getUserDetails,
  getUsers,
  getUserProfile,
  makeConnection,
  updateProfilePic,
} = require("./handlers");

const router = require("express").Router();

router.get("/view-outstanding-applications", viewApplications);

router.get(
  "/check-application-for-signup/:signUpCode",
  checkApplicationForSignup
);

router.get("/users", getUsers);

router.get("/users/:username", getUserProfile);

router.post("/verify-user-for-signin", verifyUserForSignin);

router.post("/submit-application", submitApplication);

router.post("/create-new-user", createNewUser);

// router.post("/get-user-details", getUserDetails);

router.post("/make-connection", makeConnection);

router.put("/approve-application", approveApplication);

router.put("/deny-application", denyApplication);

router.put("/confirm-user", confirmUser);

router.put("/update-profile-pic", updateProfilePic);

module.exports = router;
