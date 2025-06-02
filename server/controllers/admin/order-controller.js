require("dotenv").config();

const nodemailer = require("nodemailer");
const sanitize = require("mongo-sanitize");

const Order = require("../../models/Order");
const User = require("../../models/User");
const AuctionOrder = require("../../models/AuctionOrder");

const getAllOrdersOfAllUsers = async (req, res) => {
	try {
		const orders = await Order.find({});

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

const getAllAuctionOrdersOfAllUsers = async (req, res) => {
	try {
		const orders = await AuctionOrder.find({}).sort({ createdAt: -1 });

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

const getOrderDetailsForAdmin = async (req, res) => {
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

const generateOrderStatusEmail = (userName, orderId, status) => {
	let statusColor = "#2196F3";
	let statusMessage = "";

	switch (status) {
		case "Delivered":
			statusColor = "#4CAF50";
			statusMessage = "Your order has been delivered successfully! 🎉";
			break;
		case "Cancelled":
			statusColor = "#f44336";
			statusMessage = "Unfortunately, your order has been cancelled.";
			break;
		case "Shipped":
			statusColor = "#FF9800";
			statusMessage =
				"Great news! Your order has been shipped and is on the way.";
			break;
		default:
			statusMessage = `Your order status has been updated to: ${status}`;
	}

	return `
    <div style="font-family: Arial, sans-serif; color: #333; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
      <h2 style="color: ${statusColor};">Hi ${userName},</h2>
      <p><strong>Order ID:</strong> ${orderId}</p>
      <p>${statusMessage}</p>
      <p style="font-size: 18px;"><strong>Status:</strong> <span style="color: ${statusColor};">${status}</span></p>
      <hr />
      <p style="margin-top: 20px;">Thank you for shopping with <strong>Galería</strong>!</p>
      <p style="font-size: 14px; color: #888;">If you have any questions, feel free to reply to this email.</p>
    </div>
  `;
};

const updateOrderStatus = async (req, res) => {
	try {
		const id = sanitize(req.params.id);
		const orderStatus = sanitize(req.body.orderStatus);

		const order = await Order.findById(id).populate("userId");

		if (!order) {
			return res.status(404).json({
				success: false,
				message: "Order not found!",
			});
		}

		await Order.findByIdAndUpdate(id, { orderStatus });

		if (
			orderStatus === "delivered" ||
			orderStatus === "cancelled" ||
			orderStatus === "shipped"
		) {
			const transporter = nodemailer.createTransport({
				service: "Gmail",
				auth: {
					user: process.env.EMAIL_USER,
					pass: process.env.EMAIL_PASS,
				},
			});

			const userName = order.userId.userName;
			const userEmail = order.userId.email;

			const htmlContent = generateOrderStatusEmail(
				userName,
				order._id,
				orderStatus
			);

			const mailOptions = {
				from: `"Galería" <${process.env.EMAIL_USER}>`,
				to: userEmail,
				subject: `📦 Order Update: ${orderStatus}`,
				text: `Hi ${userName},\n\nYour order with ID ${order._id} has been updated to: ${orderStatus}`,
				html: htmlContent,
			};

			await transporter.sendMail(mailOptions);
		}

		res.status(200).json({
			success: true,
			message: "Order status updated and email sent successfully!",
		});
	} catch (e) {
		console.error("Order status update error:", e);
		res.status(500).json({
			success: false,
			message: "An error occurred while updating order status.",
		});
	}
};

module.exports = updateOrderStatus;

module.exports = {
	getAllOrdersOfAllUsers,
	getAllAuctionOrdersOfAllUsers,
	getOrderDetailsForAdmin,
	updateOrderStatus,
};
