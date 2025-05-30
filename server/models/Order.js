const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
	{
		userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
		cartItems: [
			{
				productId: String,
				title: String,
				image: String,
				price: Number,
				quantity: Number,
			},
		],
		addressInfo: {
			addressId: String,
			address: String,
			city: String,
			pincode: String,
			phone: String,
			notes: String,
		},
		orderStatus: String,
		paymentMethod: String,
		paymentStatus: String,
		totalAmount: Number,
		orderDate: Date,
		orderUpdateDate: Date,
		paymentId: String,
		payerId: String,
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
