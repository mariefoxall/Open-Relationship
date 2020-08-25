const {
  submitApplication,
  viewApplications,
  approveApplication,
  denyApplication,
  checkApplicationForSignup,
  confirmUserDetails,
  createNewUser,
} = require("./handlers");

const router = require("express").Router();

router.get("/api/view-outstanding-applications", viewApplications);

router.get(
  "/api/check-application-for-signup/:signUpCode",
  checkApplicationForSignup
);
router.post("/api/submit-application", submitApplication);

router.post("/api/create-new-user", createNewUser);

router.put("/api/approve-application", approveApplication);

router.put("/api/deny-application", denyApplication);

router.put("/api/confirm-user-details", confirmUserDetails);

module.exports = router;
