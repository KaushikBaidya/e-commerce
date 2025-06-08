const stripe = require("../../helper/stripe");
const AuctionOrder = require("../../models/AuctionOrder");
const AuctionProduct = require("../../models/Auction");
const sanitize = require("mongo-sanitize");

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

		const sanitizedUserId = sanitize(userId);
		const sanitizedAuctionProductId = sanitize(auctionProductId);
		const sanitizedOrderStatus = sanitize(orderStatus);
		const sanitizedPaymentMethod = sanitize(paymentMethod);
		const sanitizedPaymentStatus = sanitize(paymentStatus);

		const sanitizedAddressInfo = {};
		if (addressInfo && typeof addressInfo === "object") {
			for (const [key, value] of Object.entries(addressInfo)) {
				sanitizedAddressInfo[key] = sanitize(value);
			}
		}

		const auctionProduct = await AuctionProduct.findById(
			sanitizedAuctionProductId
		);
		if (!auctionProduct) {
			return res
				.status(404)
				.json({ success: false, message: "Auction product not found" });
		}

		if (
			!auctionProduct.highestBidder ||
			auctionProduct.highestBidder.toString() !== sanitizedUserId
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
						currency: "bdt",
						product_data: {
							name: auctionProduct.title,
						},
						unit_amount: Math.round(auctionProduct.currentBid * 100),
					},
					quantity: 1,
				},
			],
			success_url: `${process.env.CLIENT_URL}/auction/stripe-success?session_id={CHECKOUT_SESSION_ID}`,
			cancel_url: `${process.env.CLIENT_URL}/auction/stripe-cancel`,
			metadata: {
				userId: sanitizedUserId.toString(),
				auctionProductId: sanitizedAuctionProductId.toString(),
				title: auctionProduct.title,
				image: auctionProduct.image,
				orderStatus: sanitizedOrderStatus.toString(),
				paymentMethod: sanitizedPaymentMethod.toString(),
				paymentStatus: sanitizedPaymentStatus.toString(),
				totalAmount: auctionProduct.currentBid.toString(),
				orderDate: new Date(orderDate).toISOString(),
				addressInfo: JSON.stringify(sanitizedAddressInfo),
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
		const sessionId = sanitize(req.body.sessionId);

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

		if (!metadata || !metadata.userId || !metadata.auctionProductId) {
			return res
				.status(400)
				.json({ success: false, message: "Missing session metadata" });
		}

		const sanitizedMetadata = {
			userId: sanitize(metadata.userId),
			auctionProductId: sanitize(metadata.auctionProductId),
			title: sanitize(metadata.title),
			image: sanitize(metadata.image),
			paymentMethod: sanitize(metadata.paymentMethod),
			totalAmount: sanitize(metadata.totalAmount),
			orderDate: sanitize(metadata.orderDate),
		};

		const newOrder = new AuctionOrder({
			userId: sanitizedMetadata.userId,
			addressInfo: JSON.parse(metadata.addressInfo),
			productId: sanitizedMetadata.auctionProductId,
			title: sanitizedMetadata.title,
			image: sanitizedMetadata.image,
			orderStatus: "confirmed",
			paymentMethod: sanitizedMetadata.paymentMethod,
			paymentStatus: "paid",
			totalAmount: sanitizedMetadata.totalAmount,
			orderDate: sanitizedMetadata.orderDate,
			paymentId: session.payment_intent,
			payerId: session.customer_details?.email || "N/A",
		});

		await newOrder.save();

		await AuctionProduct.findByIdAndUpdate(sanitizedMetadata.auctionProductId, {
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
		const userId = sanitize(req.params.userId);

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
