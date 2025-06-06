const express = require("express");

const { getFeedback, getUserMessages } = require("../../controllers/admin/feedback-controller");

const router = express.Router();

router.get("/get", getFeedback);
router.get("/user-message/get", getUserMessages);

module.exports = router;