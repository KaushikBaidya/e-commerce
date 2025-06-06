const express = require("express");

const {
	addFeedback,
	getUserFeedbackById,
	addUserMsg,
} = require("../../controllers/shop/feddback-controller");
const {
	validateObjectId,
	handleValidationErrors,
} = require("../../validator/validators");
const { validateAddFeedback } = require("../../validator/feedbackValidator");
const { validateAddUserMsg } = require("../../validator/userMsgValidator");

const router = express.Router();

router.post("/add", validateAddFeedback, handleValidationErrors, addFeedback);
router.post(
	"/user-message/add",
	validateAddUserMsg,
	handleValidationErrors,
	addUserMsg
);
router.get("/get/:userId", validateObjectId("userId"), getUserFeedbackById);

module.exports = router;
