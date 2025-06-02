const mongoose = require("mongoose");

const AuctionProductSchema = new mongoose.Schema(
	{
		image: String,
		imagePublicId: String,
		title: String,
		description: String,
		artist: String,
		startingBid: Number,
		currentBid: Number,
		bidIncrement: Number,
		highestBidder: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
		bidHistory: [
			{
				bidder: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "User",
				},
				amount: Number,
				time: Date,
			},
		],
		startTime: Date,
		endTime: Date,
		isActive: Boolean,
		status: {
			type: String,
			enum: ["upcoming", "running", "closed"],
			default: "upcoming",
		},
		isSold: {
			type: Boolean,
			default: false,
		},
		winnerNotified: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("AuctionProduct", AuctionProductSchema);
