const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
	{
		userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
		cartItems: [
			{
				productId: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "Product",
					required: true,
				},
				title: String,
				image: String,
				price: Number,
				quantity: Number,
			},
		],
		addressInfo: {
			addressId: { type: mongoose.Schema.Types.ObjectId, ref: "Address" },
			address: String,
			city: String,
			pincode: String,
			phone: String,
			notes: String,
		},
		orderStatus: {
			type: String,
			enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
			default: "pending",
		},
		paymentMethod: {
			type: String,
			enum: ["card", "paypal", "cod", "stripe"],
			required: true,
		},
		paymentStatus: {
			type: String,
			enum: ["pending", "paid", "failed"],
			default: "pending",
		},
		totalAmount: { type: Number, required: true },
		orderDate: { type: Date, default: Date.now },
		orderUpdateDate: Date,
		paymentId: String,
		payerId: String,
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
