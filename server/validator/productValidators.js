const { body } = require("express-validator");

exports.addProductValidator = [
	body("title").notEmpty().withMessage("Title is required"),
	body("category").notEmpty().withMessage("Category is required"),
	body("price")
		.notEmpty()
		.withMessage("Price is required")
		.isNumeric()
		.withMessage("Price must be a number"),
	body("totalStock")
		.notEmpty()
		.withMessage("Total stock is required")
		.isInt({ min: 0 })
		.withMessage("Total stock must be a non-negative integer"),
];

exports.editProductValidator = [
	body("title").optional().notEmpty().withMessage("Title cannot be empty"),
	body("category")
		.optional()
		.notEmpty()
		.withMessage("Category cannot be empty"),
	body("price").optional().isNumeric().withMessage("Price must be a number"),
	body("salePrice")
		.optional()
		.isNumeric()
		.withMessage("Sale price must be a number"),
	body("totalStock")
		.optional()
		.isInt({ min: 0 })
		.withMessage("Total stock must be a non-negative integer"),
];
