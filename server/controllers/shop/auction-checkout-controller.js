const stripe = require("../../helper/stripe");
const AuctionOrder = require("../../models/AuctionOrder");
const AuctionProduct = require("../../models/Auction");

const createAuctionCheckoutSession = async (req, res) => {
	try {
		const {
			userId,
			addressInfo,
			auctionProductId,
			orderStatus = "pending",
			paymentMethod = "stripe",
			paymentStatus = "unpaid",
			orderDate = new Date(),
		} = req.body;

		const auctionProduct = await AuctionProduct.findById(auctionProductId);
		if (!auctionProduct) {
			return res
				.status(404)
				.json({ success: false, message: "Auction product not found" });
		}

		if (
			!auctionProduct.highestBidder ||
			auctionProduct.highestBidder.toString() !== userId
		) {
			return res.status(403).json({
				success: false,
				message: "You are not the highest bidder for this product",
			});
		}

		const session = await stripe.checkout.sessions.create({
			payment_method_types: ["card"],
			mode: "payment",
			line_items: [
				{
					price_data: {
						currency: "usd",
						product_data: {
							name: auctionProduct.title,
						},
						unit_amount: Math.round(auctionProduct.currentBid * 100),
					},
					quantity: 1,
				},
			],
			success_url: `http://localhost:5173/auction/stripe-success?session_id={CHECKOUT_SESSION_ID}`,
			cancel_url: `http://localhost:5173/auction/stripe-cancel`,
			metadata: {
				userId: userId.toString(),
				auctionProductId: auctionProductId.toString(),
				title: auctionProduct.title,
				image: auctionProduct.image,
				orderStatus: orderStatus.toString(),
				paymentMethod: paymentMethod.toString(),
				paymentStatus: paymentStatus.toString(),
				totalAmount: auctionProduct.currentBid.toString(),
				orderDate: new Date(orderDate).toISOString(),
				addressInfo: JSON.stringify(addressInfo), // this is fine as a JSON string
			},
		});

		res.status(200).json({
			success: true,
			checkoutUrl: session.url,
		});
	} catch (err) {
		console.error("Error creating checkout session:", err.message);
		res
			.status(500)
			.json({ success: false, message: "Failed to create checkout session" });
	}
};

const finalizeAuctionOrderFromSession = async (req, res) => {
	try {
		const { sessionId } = req.body;

		const session = await stripe.checkout.sessions.retrieve(sessionId);

		const existingOrder = await AuctionOrder.findOne({
			paymentId: session.payment_intent,
		});
		if (existingOrder) {
			return res
				.status(200)
				.json({ success: true, message: "Order already finalized" });
		}

		const metadata = session.metadata;
		console.log("Metadata:", metadata);
		console.log("Metadata userId:", metadata.userId);
		console.log("Metadata auctionProductId:", metadata.auctionProductId);

		if (!metadata || !metadata.userId || !metadata.auctionProductId) {
			return res
				.status(400)
				.json({ success: false, message: "Missing session metadata" });
		}

		const newOrder = new AuctionOrder({
			userId: metadata.userId,
			addressInfo: JSON.parse(metadata.addressInfo),
			productId: metadata.auctionProductId,
			title: metadata.title,
			image: metadata.image,
			orderStatus: "confirmed",
			paymentMethod: metadata.paymentMethod,
			paymentStatus: "paid",
			totalAmount: metadata.totalAmount,
			orderDate: metadata.orderDate,
			paymentId: session.payment_intent,
			payerId: session.customer_details?.email || "N/A",
		});

		await newOrder.save();

		// Optionally mark auction product as inactive
		await AuctionProduct.findByIdAndUpdate(metadata.auctionProductId, {
			isActive: false,
		});

		res.status(200).json({
			success: true,
			message: "Auction order completed successfully",
		});
	} catch (err) {
		console.error("Error finalizing auction order:", err.message);
		res.status(500).json({
			success: false,
			message: "Failed to finalize auction order",
		});
	}
};

const getAllAuctionOrdersByUser = async (req, res) => {
	try {
		const { userId } = req.params;

		const orders = await AuctionOrder.find({ userId });

		if (!orders.length) {
			return res.status(404).json({
				success: false,
				message: "No orders found!",
			});
		}

		res.status(200).json({
			success: true,
			data: orders,
		});
	} catch (e) {
		console.log(e);
		res.status(500).json({
			success: false,
			message: "Some error occured!",
		});
	}
};

module.exports = {
	createAuctionCheckoutSession,
	finalizeAuctionOrderFromSession,
	getAllAuctionOrdersByUser,
};
