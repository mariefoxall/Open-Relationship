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
  checkConnection,
  sendMessage,
  getSentMessages,
  getReceivedMessages,
  approveConnection,
  getAllMessages,
  addProject,
  getAllProjects,
} = require("./handlers");

const router = require("express").Router();

router.get("/view-outstanding-applications", viewApplications);

router.get(
  "/check-application-for-signup/:signUpCode",
  checkApplicationForSignup
);

router.get("/users", getUsers);

router.get("/projects", getAllProjects);

router.get("/users/:username", getUserProfile);

router.get("/messages", getAllMessages);

router.post("/check-connection", checkConnection);

router.post("/verify-user-for-signin", verifyUserForSignin);

router.post("/submit-application", submitApplication);

router.post("/create-new-user", createNewUser);

// router.post("/get-user-details", getUserDetails);

router.post("/make-connection", makeConnection);

router.post("/get-sent-messages", getSentMessages);
router.post("/get-received-messages", getReceivedMessages);

router.post("/send-message", sendMessage);

router.post("/add-project", addProject);

router.put("/approve-application", approveApplication);

router.put("/deny-application", denyApplication);

router.put("/confirm-user", confirmUser);

router.put("/update-profile-pic", updateProfilePic);

router.put("/approve-connection", approveConnection);

module.exports = router;
