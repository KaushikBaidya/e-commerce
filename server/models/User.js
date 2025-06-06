const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
	userName: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	password: {
		type: String,
		required: function () {
			return this.authProvider === "local";
		},
	},
	role: { type: String, default: "user" },
	authProvider: { type: String, default: "local" },
	googleId: { type: String, default: null },

	isVerified: { type: Boolean, default: false },
	verificationToken: { type: String, default: null },
	verificationExpires: { type: Date, default: null },

	resetPasswordToken: String,
	resetPasswordExpires: Date,
});

module.exports = mongoose.model("User", UserSchema);
