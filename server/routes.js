const { submitApplication } = require("./handlers");

const router = require("express").Router();

router.post("/api/submit-application", submitApplication);

module.exports = router;
