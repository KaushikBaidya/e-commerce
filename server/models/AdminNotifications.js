const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
		},
		message: {
			type: String,
			required: true,
		},
		type: {
			type: String,
			enum: ["order", "review", "user", "auction"],
			default: "order",
		},
		isRead: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("AdminNotifications", notificationSchema);
