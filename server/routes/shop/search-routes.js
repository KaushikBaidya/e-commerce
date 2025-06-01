const express = require("express");
const { param, validationResult } = require("express-validator");

const { searchProducts } = require("../../controllers/shop/search-controller");

const router = express.Router();

router.get(
	"/:keyword",
	[
		param("keyword")
			.trim()
			.notEmpty()
			.withMessage("Keyword is required")
			.isLength({ min: 3 })
			.withMessage("Keyword must be at least 3 characters"),
	],
	(req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		next();
	},
	searchProducts
);

module.exports = router;
