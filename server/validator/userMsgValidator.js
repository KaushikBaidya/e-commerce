const { body } = require("express-validator");

const validateAddUserMsg = [
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
];

module.exports = { validateAddUserMsg };
