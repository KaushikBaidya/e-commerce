const express = require("express");
const stripe = require("../../helper/stripe");

const {
	createAuctionCheckoutSession,
	finalizeAuctionOrderFromSession,
	getAllAuctionOrdersByUser,
} = require("../../controllers/shop/auction-checkout-controller");
const { validateObjectId } = require("../../validator/validators");

const router = express.Router();
const { body, validationResult } = require("express-validator");

const validateAuctionCheckoutSession = [
	body("userId").isMongoId().withMessage("Invalid userId"),

	body("auctionProductId").isMongoId().withMessage("Invalid auctionProductId"),

	body("addressInfo.address").notEmpty().withMessage("Address is required"),

	body("addressInfo.city").notEmpty().withMessage("City is required"),

	body("addressInfo.pincode")
		.matches(/^\d{4,6}$/)
		.withMessage("Invalid pincode"),

	body("addressInfo.phone")
		.matches(/^\d{10,15}$/)
		.withMessage("Invalid phone number"),

	body("orderStatus")
		.optional()
		.isIn(["pending", "confirmed", "shipped", "delivered", "cancelled"])
		.withMessage("Invalid order status"),

	body("paymentMethod")
		.optional()
		.isIn(["card", "paypal", "cod", "stripe"])
		.withMessage("Invalid payment method"),

	body("paymentStatus")
		.optional()
		.isIn(["unpaid", "paid"])
		.withMessage("Invalid payment status"),

	(req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		next();
	},
];

router.post(
	"/create",
	validateAuctionCheckoutSession,
	createAuctionCheckoutSession
);
router.get(
	"/list/:userId",
	validateObjectId("userId"),
	getAllAuctionOrdersByUser
);

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
router.post("/finalize", finalizeAuctionOrderFromSession);

module.exports = router;
