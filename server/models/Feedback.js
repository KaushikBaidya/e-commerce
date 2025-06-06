const mongoose = require("mongoose");

const FeedbackSchema = new mongoose.Schema(
	{
		userId: String,
		userName: String,
		email: String,
		phone: String,

		feedbackType: String,
		subject: String,
		message: String,
		rating: Number,
		image: String,
		newsletter: Boolean,

		adminResponse: {
			message: String,
			respondedAt: Date,
		},

		userAgent: String,
		tags: [String],

		isDeleted: {
			type: Boolean,
			default: false,
		},
		deletedAt: Date,
	},
	{
		timestamps: true,
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

module.exports = mongoose.model("Feedback", FeedbackSchema);

