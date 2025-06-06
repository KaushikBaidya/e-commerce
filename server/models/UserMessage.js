const moongoose = require("mongoose");

const userMessageSchema = new moongoose.Schema(
	{
		userName: String,
		email: String,
		subject: String,
		message: String,
	},
	{ timestamps: true }
);

module.exports = moongoose.model("UserMessage", userMessageSchema);
