import mongoose from "mongoose";

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
			enum: ["order", "review", "user", "bid"],
			default: "order",
		},
		isRead: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true }
);

export default mongoose.model("AdminNotifications", notificationSchema);
