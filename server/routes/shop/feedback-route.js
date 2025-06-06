const express = require("express");

const {
	addFeedback,
	getUserFeedbackById,
} = require("../../controllers/shop/feddback-controller");
const {
	validateObjectId,
	handleValidationErrors,
} = require("../../validator/validators");
const { validateAddFeedback } = require("../../validator/feedbackValidator");

const router = express.Router();

router.post("/add", validateAddFeedback, handleValidationErrors, addFeedback);
router.get("/get/:userId", validateObjectId("userId"), getUserFeedbackById);

module.exports = router;
