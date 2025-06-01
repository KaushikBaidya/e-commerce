// validators/auctionProductValidators.js
const { body } = require("express-validator");

exports.addAuctionProductValidator = [
	body("title").notEmpty().withMessage("Title is required"),
	body("artist").notEmpty().withMessage("Artist is required"),
	body("startingBid")
		.notEmpty()
		.withMessage("Starting bid is required")
		.isFloat({ min: 0 })
		.withMessage("Starting bid must be a non-negative number"),
	body("bidIncrement")
		.optional()
		.isFloat({ min: 0 })
		.withMessage("Bid increment must be a non-negative number"),
	body("startTime")
		.notEmpty()
		.withMessage("Start time is required")
		.isISO8601()
		.withMessage("Start time must be a valid ISO8601 date"),
	body("endTime")
		.notEmpty()
		.withMessage("End time is required")
		.isISO8601()
		.withMessage("End time must be a valid ISO8601 date"),
	body("isActive")
		.optional()
		.isBoolean()
		.withMessage("isActive must be a boolean"),
];

exports.editAuctionProductValidator = [
	body("title").optional().notEmpty().withMessage("Title cannot be empty"),
	body("artist").optional().notEmpty().withMessage("Artist cannot be empty"),
	body("startingBid")
		.optional()
		.isFloat({ min: 0 })
		.withMessage("Starting bid must be a non-negative number"),
	body("bidIncrement")
		.optional()
		.isFloat({ min: 0 })
		.withMessage("Bid increment must be a non-negative number"),
	body("startTime")
		.optional()
		.isISO8601()
		.withMessage("Start time must be a valid ISO8601 date"),
	body("endTime")
		.optional()
		.isISO8601()
		.withMessage("End time must be a valid ISO8601 date"),
	body("isActive")
		.optional()
		.isBoolean()
		.withMessage("isActive must be a boolean"),
];
