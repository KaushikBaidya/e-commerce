const { body } = require("express-validator");

const validateAddFeedback = [
	body("userId").trim().notEmpty().isMongoId().withMessage("Invalid user ID."),

	body("name")
		.trim()
		.notEmpty()
		.withMessage("Name is required.")
		.isLength({ min: 2, max: 100 })
		.withMessage("Name must be between 2 and 100 characters."),

	body("email")
		.trim()
		.notEmpty()
		.withMessage("Email is required.")
		.isEmail()
		.withMessage("Invalid email address."),

	body("phone").optional().isMobilePhone().withMessage("Invalid phone number."),

	body("subject")
		.trim()
		.notEmpty()
		.withMessage("Subject is required.")
		.isLength({ max: 200 })
		.withMessage("Subject can't exceed 200 characters."),

	body("message")
		.trim()
		.notEmpty()
		.withMessage("Message is required.")
		.isLength({ min: 10 })
		.withMessage("Message must be at least 10 characters."),

	body("newsletter")
		.optional()
		.isBoolean()
		.withMessage("Newsletter must be a boolean value."),

	body("rating")
		.optional()
		.isInt({ min: 1, max: 5 })
		.withMessage("Rating must be between 1 and 5."),

	body("feedbackType")
		.optional()
		.isIn(["general", "auction", "artist", "complaint"])
		.withMessage("Invalid feedback type."),

	body("images").optional().isURL().withMessage("Image must be a valid URL."),
];

module.exports = { validateAddFeedback };
