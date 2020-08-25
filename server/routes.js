const {
  submitApplication,
  viewApplications,
  approveApplication,
  denyApplication,
  checkApplicationForSignup,
  confirmUserDetails,
  createNewUser,
  verifyUserForSignin,
  getUserDetails,
} = require("./handlers");

const router = require("express").Router();

router.get("/api/view-outstanding-applications", viewApplications);

router.get(
  "/api/check-application-for-signup/:signUpCode",
  checkApplicationForSignup
);

router.post("/api/verify-user-for-signin", verifyUserForSignin);

router.post("/api/submit-application", submitApplication);

router.post("/api/create-new-user", createNewUser);

router.post("/api/get-user-details", getUserDetails);

router.put("/api/approve-application", approveApplication);

router.put("/api/deny-application", denyApplication);

router.put("/api/confirm-user-details", confirmUserDetails);

module.exports = router;
