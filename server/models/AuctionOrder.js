const mongoose = require("mongoose");

const auctionOrderSchema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	productId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Auction",
		required: true,
	},
	addressInfo: {
		addressId: String,
		address: String,
		city: String,
		pincode: String,
		phone: String,
		notes: String,
	},
	title: String,
	image: String,
	orderStatus: String,
	paymentMethod: String,
	paymentStatus: String,
	totalAmount: Number,
	orderDate: Date,
	paymentId: String,
	payerId: String,
});

module.exports = mongoose.model("AuctionOrder", auctionOrderSchema);
