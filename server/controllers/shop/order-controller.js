const stripe = require("../../helper/stripe");
const Order = require("../../models/Order");
const Cart = require("../../models/Cart");
const Product = require("../../models/Product");
const sanitize = require("mongo-sanitize");
const {
	createNotificationService,
} = require("../admin/notification-controller");

const createOrder = async (req, res) => {
	try {
		const {
			userId,
			cartItems,
			addressInfo,
			orderStatus,
			paymentMethod,
			paymentStatus,
			totalAmount,
			orderDate,
			orderUpdateDate,
			cartId,
		} = req.body;

		// Sanitize basic fields
		const sanitizedUserId = sanitize(userId);
		const sanitizedCartId = sanitize(cartId);
		const sanitizedOrderStatus = sanitize(orderStatus);
		const sanitizedPaymentMethod = sanitize(paymentMethod);
		const sanitizedPaymentStatus = sanitize(paymentStatus);
		const sanitizedTotalAmount = sanitize(totalAmount);
		const sanitizedOrderDate = sanitize(orderDate);
		const sanitizedOrderUpdateDate = sanitize(orderUpdateDate);

		// Sanitize cartItems array
		const sanitizedCartItems = cartItems.map((item) => ({
			productId: sanitize(item.productId),
			title: sanitize(item.title),
			quantity: sanitize(item.quantity),
			price: sanitize(item.price),
		}));

		// Sanitize addressInfo object
		const sanitizedAddressInfo = {};
		if (addressInfo && typeof addressInfo === "object") {
			for (const [key, value] of Object.entries(addressInfo)) {
				sanitizedAddressInfo[key] = sanitize(value);
			}
		}

		const session = await stripe.checkout.sessions.create({
			payment_method_types: ["card"],
			mode: "payment",
			line_items: sanitizedCartItems.map((item) => ({
				price_data: {
					currency: "bdt",
					product_data: {
						name: item.title,
					},
					unit_amount: Math.round(item.price * 100),
				},
				quantity: item.quantity,
			})),
			success_url: `${process.env.CLIENT_URL}/shop/stripe-success?session_id={CHECKOUT_SESSION_ID}`,
			cancel_url: `${process.env.CLIENT_URL}/shop/stripe-cancel`,
			metadata: {
				userId: sanitizedUserId.toString(),
				cartId: sanitizedCartId.toString(),
				orderStatus: sanitizedOrderStatus.toString(),
				paymentMethod: sanitizedPaymentMethod.toString(),
				paymentStatus: sanitizedPaymentStatus.toString(),
				totalAmount: sanitizedTotalAmount.toString(),
				orderDate: sanitizedOrderDate.toString(),
				orderUpdateDate: sanitizedOrderUpdateDate.toString(),
				cartItems: JSON.stringify(sanitizedCartItems),
				addressInfo: JSON.stringify(sanitizedAddressInfo),
			},
		});

		res.status(200).json({
			success: true,
			checkoutUrl: session.url,
		});
	} catch (e) {
		console.error(e);
		res.status(500).json({
			success: false,
			message: "Stripe Checkout Session creation failed",
		});
	}
};

const finalizeOrderFromSession = async (req, res) => {
	try {
		const sessionId = sanitize(req.body.sessionId);

		const session = await stripe.checkout.sessions.retrieve(sessionId);

		const existingOrder = await Order.findOne({
			paymentId: session.payment_intent,
		});

		if (existingOrder) {
			return res.status(200).json({
				success: true,
				message: "Order already finalized",
			});
		}

		const metadata = session.metadata;

		if (
			!metadata ||
			!metadata.userId ||
			!metadata.cartId ||
			!metadata.cartItems ||
			!metadata.addressInfo
		) {
			console.error("Missing metadata:", metadata);
			return res.status(400).json({
				success: false,
				message: "Missing required session metadata",
			});
		}

		// Sanitize metadata (though it comes from Stripe, extra safety)
		const sanitizedMetadata = {
			userId: sanitize(metadata.userId),
			cartId: sanitize(metadata.cartId),
			paymentMethod: sanitize(metadata.paymentMethod || "stripe"),
			totalAmount: sanitize(metadata.totalAmount),
			orderDate: sanitize(metadata.orderDate),
			orderUpdateDate: sanitize(metadata.orderUpdateDate),
		};

		// Log parsed values for debugging
		console.log("Finalizing order with metadata:", metadata);

		const newOrder = new Order({
			userId: sanitizedMetadata.userId,
			cartId: sanitizedMetadata.cartId,
			cartItems: JSON.parse(metadata.cartItems), // Already sanitized when stored
			addressInfo: JSON.parse(metadata.addressInfo), // Already sanitized when stored
			orderStatus: "confirmed",
			paymentMethod: sanitizedMetadata.paymentMethod,
			paymentStatus: "paid",
			totalAmount: sanitizedMetadata.totalAmount,
			orderDate: sanitizedMetadata.orderDate,
			orderUpdateDate: sanitizedMetadata.orderUpdateDate,
			paymentId: session.payment_intent,
			payerId: session.customer_details?.email || "N/A",
		});

		for (let item of newOrder.cartItems) {
			const product = await Product.findById(item.productId);

			if (!product) {
				return res.status(404).json({
					success: false,
					message: `Product not found with ID ${item.productId}`,
				});
			}

			if (product.totalStock < item.quantity) {
				return res.status(400).json({
					success: false,
					message: `Not enough stock for product: ${product.title}`,
				});
			}

			product.totalStock -= item.quantity;
			await product.save();
		}

		await newOrder.save();

		await createNotificationService({
			title: "New Order Placed",
			message: `An order has been placed. Order ID: ${newOrder._id}`,
			type: "order",
		});

		await Cart.findByIdAndDelete(sanitizedMetadata.cartId);

		res.status(200).json({
			success: true,
			message: "Order saved successfully",
		});
	} catch (err) {
		console.error("Error finalizing order from session:", err.message);
		res.status(500).json({
			success: false,
			message: "Failed to finalize order",
		});
	}
};

const getAllOrdersByUser = async (req, res) => {
	try {
		const userId = sanitize(req.params.userId);

		const orders = await Order.find({ userId }).sort({ createdAt: -1 });

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

const getOrderDetails = async (req, res) => {
	try {
		const id = sanitize(req.params.id);

		const order = await Order.findById(id);

		if (!order) {
			return res.status(404).json({
				success: false,
				message: "Order not found!",
			});
		}

		res.status(200).json({
			success: true,
			data: order,
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
	createOrder,
	getAllOrdersByUser,
	getOrderDetails,
	finalizeOrderFromSession,
};
