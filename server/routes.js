const {
  submitApplication,
  viewApplications,
  approveApplication,
  denyApplication,
  checkApplicationForSignup,
} = require("./handlers");

const router = require("express").Router();

router.post("/api/submit-application", submitApplication);

router.get("/api/view-outstanding-applications", viewApplications);

router.put("/api/approve-application", approveApplication);

router.put("/api/deny-application", denyApplication);

router.get(
  "/api/check-application-for-signup/:signUpCode",
  checkApplicationForSignup
);

module.exports = router;
