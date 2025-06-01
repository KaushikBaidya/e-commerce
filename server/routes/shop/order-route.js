const express = require("express");
const stripe = require("../../helper/stripe");

const {
	createOrder,
	getAllOrdersByUser,
	getOrderDetails,
	finalizeOrderFromSession,
} = require("../../controllers/shop/order-controller");
const { validateObjectId } = require("../../validator/validators");

const router = express.Router();

const { body, validationResult } = require("express-validator");

const validateCreateOrder = [
	body("userId").isMongoId().withMessage("Invalid userId"),
	body("cartItems").isArray({ min: 1 }).withMessage("Cart must not be empty"),
	body("cartItems.*.productId").isMongoId().withMessage("Invalid productId"),
	body("cartItems.*.quantity")
		.isInt({ min: 1 })
		.withMessage("Quantity must be at least 1"),
	body("totalAmount")
		.isFloat({ gt: 0 })
		.withMessage("Total amount must be greater than 0"),
	body("paymentMethod")
		.isIn(["card", "paypal", "cod", "stripe"])
		.withMessage("Invalid payment method"),
	body("addressInfo.address").notEmpty().withMessage("Address is required"),
	body("addressInfo.city").notEmpty().withMessage("City is required"),
	body("addressInfo.pincode")
		.matches(/^\d{4,6}$/)
		.withMessage("Invalid pincode"),
	body("addressInfo.phone")
		.matches(/^\d{10,15}$/)
		.withMessage("Invalid phone number"),
	(req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		next();
	},
];
router.post("/create", validateCreateOrder, createOrder);

router.get("/list/:userId", validateObjectId("userId"), getAllOrdersByUser);
router.get("/details/:id", validateObjectId("id"), getOrderDetails);

router.get("/session/:sessionId", async (req, res) => {
	try {
		const session = await stripe.checkout.sessions.retrieve(
			req.params.sessionId
		);
		res.status(200).json({
			success: true,
			session,
		});
	} catch (error) {
		console.error("Failed to retrieve Stripe session:", error.message);
		res.status(500).json({
			success: false,
			message: "Failed to fetch session data",
		});
	}
});
router.post("/finalize", finalizeOrderFromSession);

module.exports = router;
