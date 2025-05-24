const express = require("express");
const stripe = require("../../helper/stripe");

const {
	createAuctionCheckoutSession,
	finalizeAuctionOrderFromSession,
	getAllAuctionOrdersByUser,
} = require("../../controllers/shop/auction-checkout-controller");

const router = express.Router();

router.post("/create", createAuctionCheckoutSession);
router.get("/list/:userId", getAllAuctionOrdersByUser);

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
