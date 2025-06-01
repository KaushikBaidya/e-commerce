const { body, param } = require("express-validator");

exports.createNotificationValidator = [
	body("title").notEmpty().withMessage("Title is required"),
	body("message").notEmpty().withMessage("Message is required"),
	body("type")
		.notEmpty()
		.withMessage("Type is required")
		.isIn(["info", "warning", "success", "error"])
		.withMessage("Type must be one of: info, warning, success, error"),
];

exports.validateNotificationId = [
	param("id").isMongoId().withMessage("Invalid notification ID"),
];
