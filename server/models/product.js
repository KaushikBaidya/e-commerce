const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
	{
		image: String,
		imagePublicId: String,
		title: String,
		description: String,
		category: String,
		price: Number,
		salePrice: Number,
		totalStock: Number,
		averageReview: Number,
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
