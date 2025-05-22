const express = require("express");
const stripe = require("../../helper/stripe");

const {
	createOrder,
	getAllOrdersByUser,
	getOrderDetails,
	finalizeOrderFromSession,
} = require("../../controllers/shop/order-controller");

const router = express.Router();

router.post("/create", createOrder);
// router.post("/capture", capturePayment);
router.get("/list/:userId", getAllOrdersByUser);
router.get("/details/:id", getOrderDetails);
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
