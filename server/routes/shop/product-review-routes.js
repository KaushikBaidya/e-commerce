const express = require("express");
const { body, param, validationResult } = require("express-validator");

const {
	addProductReview,
	getProductReview,
} = require("../../controllers/shop/product-review-controller");
const { validateObjectId } = require("../../validator/validators");

const router = express.Router();

const validateReviewBody = [
	body("reviewValue")
		.isInt({ min: 1, max: 5 })
		.withMessage("Rating must be between 1 and 5"),
	body("reviewMessage").trim().notEmpty().withMessage("Comment is required"),
	body("productId").isMongoId().withMessage("Invalid productId"),
	(req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		next();
	},
];

router.post("/add", validateReviewBody, addProductReview);
router.get("/get/:productId", validateObjectId("productId"), getProductReview);

module.exports = router;
