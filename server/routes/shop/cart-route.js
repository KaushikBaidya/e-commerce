const express = require("express");

const {
	addToCart,
	fetchCartItems,
	updateCartItemQty,
	deleteCartItem,
} = require("../../controllers/shop/cart-controller");

const { validateObjectId } = require("../../validator/validators");

const { body, validationResult } = require("express-validator");
const router = express.Router();

const validateAddToCart = [
	body("userId").isMongoId().withMessage("Invalid userId"),
	body("productId").isMongoId().withMessage("Invalid productId"),
	body("quantity")
		.isInt({ min: 1 })
		.withMessage("Quantity must be a positive integer"),
	(req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		next();
	},
];

const validateUpdateCart = [
	body("userId").isMongoId().withMessage("Invalid userId"),
	body("productId").isMongoId().withMessage("Invalid productId"),
	body("quantity").isInt({ min: 1 }).withMessage("Quantity must be at least 1"),
	(req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		next();
	},
];

const validateDeleteCart = [
	validateObjectId("userId")[0],
	validateObjectId("productId")[0],
	(req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		next();
	},
];

router.post("/add", validateAddToCart, addToCart);
router.put("/update-cart", validateUpdateCart, updateCartItemQty);

router.get("/get/:userId", validateObjectId("userId"), fetchCartItems);

router.delete("/delete/:userId/:productId", validateDeleteCart, deleteCartItem);

module.exports = router;
