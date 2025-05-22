const stripe = require("../../helper/stripe");
const Order = require("../../models/Order");
const Cart = require("../../models/Cart");
const Product = require("../../models/Product");

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

		const session = await stripe.checkout.sessions.create({
			payment_method_types: ["card"],
			mode: "payment",
			line_items: cartItems.map((item) => ({
				price_data: {
					currency: "usd",
					product_data: {
						name: item.title,
					},
					unit_amount: Math.round(item.price * 100), // Stripe expects cents
				},
				quantity: item.quantity,
			})),
			success_url: `http://localhost:5173/shop/stripe-success?session_id={CHECKOUT_SESSION_ID}`,
			cancel_url: `http://localhost:5173/shop/stripe-cancel`,
			metadata: {
				userId,
				cartId,
				orderStatus,
				paymentMethod,
				paymentStatus,
				totalAmount,
				orderDate,
				orderUpdateDate,
				cartItems: JSON.stringify(cartItems),
				addressInfo: JSON.stringify(addressInfo),
			},
		});

		res.status(200).json({
			success: true,
			checkoutUrl: session.url,
		});
	} catch (e) {
		console.log(e);
		res.status(500).json({
			success: false,
			message: "Stripe Checkout Session creation failed",
		});
	}
};

const finalizeOrderFromSession = async (req, res) => {
	try {
		const { sessionId } = req.body;

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

		if (!metadata || !metadata.cartItems || !metadata.addressInfo) {
			return res.status(400).json({
				success: false,
				message: "Missing required session metadata",
			});
		}

		const newOrder = new Order({
			userId: metadata.userId,
			cartId: metadata.cartId,
			cartItems: JSON.parse(metadata.cartItems),
			addressInfo: JSON.parse(metadata.addressInfo),
			orderStatus: "confirmed",
			paymentMethod: metadata.paymentMethod || "stripe",
			paymentStatus: "paid",
			totalAmount: metadata.totalAmount,
			orderDate: metadata.orderDate,
			orderUpdateDate: metadata.orderUpdateDate,
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
		await Cart.findByIdAndDelete(metadata.cartId);

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
		const { userId } = req.params;

		const orders = await Order.find({ userId });

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
		const { id } = req.params;

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
