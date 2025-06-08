const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const User = require("../../models/User");
const sanitize = require("mongo-sanitize");

const sendResetLink = async (req, res) => {
	const email = sanitize(req.body.email);

	if (!email) {
		return res
			.status(400)
			.json({ success: false, message: "Email is required" });
	}

	try {
		const user = await User.findOne({ email });
		if (!user) {
			return res
				.status(404)
				.json({ success: false, message: "No user with that email" });
		}

		const token = crypto.randomBytes(32).toString("hex");
		// Fix: Correct expiry time (1 hour = 1000 * 60 * 60)
		const expiry = Date.now() + 1000 * 60 * 60;

		user.resetPasswordToken = token;
		user.resetPasswordExpires = expiry;

		await user.save();

		const transporter = nodemailer.createTransport({
			service: "Gmail",
			auth: {
				user: process.env.EMAIL_USER,
				pass: process.env.EMAIL_PASS,
			},
		});

		// Fix: Use token in params instead of query
		const resetUrl = `${process.env.CLIENT_URL}/reset-password/${token}`;

		await transporter.sendMail({
			from: `"Galería Support" <${process.env.EMAIL_USER}>`,
			to: user.email,
			subject: "Password Reset Request - Galería",
			html: `	<div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
  					 	<h2>Password Reset Request</h2>
  						<p>Hello ${user.userName || "there"},</p>
							<p>
								We received a request to reset your password for your Galería account. If you made this request, please click the button below to reset your password:
							</p>
							<p style="text-align: center; margin: 30px 0;">
								<a href="${resetUrl}" 
									style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">
									Reset Password
								</a>
							</p>
							<p>
								This link will expire in 1 hour. If you did not request a password reset, you can safely ignore this email — your password will remain unchanged.
							</p>
							<hr style="margin: 30px 0;" />
							<p style="font-size: 14px; color: #777;">
								If you're having trouble clicking the button, copy and paste the URL below into your web browser:
								<br />
								<a href="${resetUrl}" style="color: #4CAF50;">${resetUrl}</a>
							</p>
							<p style="font-size: 12px; color: #aaa; text-align: center;">
								&copy; ${new Date().getFullYear()} Galería. All rights reserved.
							</p>
						</div>`,
		});

		res.json({ success: true, message: "Reset link sent to your email" });
	} catch (error) {
		console.error("Error in sendResetLink:", error);
		res.status(500).json({ success: false, message: "Server error" });
	}
};

const resetPassword = async (req, res) => {
	const token = sanitize(req.params.token);
	const password = String(req.body.password || "").trim();

	if (!password || password.length < 6) {
		return res
			.status(400)
			.json({
				success: false,
				message: "Password must be at least 6 characters long",
			});
	}

	try {
		const user = await User.findOne({
			resetPasswordToken: token,
			resetPasswordExpires: { $gt: Date.now() },
		});

		if (!user) {
			return res
				.status(400)
				.json({ success: false, message: "Invalid or expired token" });
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		user.password = hashedPassword;
		user.resetPasswordToken = undefined;
		user.resetPasswordExpires = undefined;

		await user.save();

		res
			.status(200)
			.json({ success: true, message: "Password reset successfully" });
	} catch (error) {
		console.error("Reset Password Error:", error);
		res.status(500).json({ success: false, message: "Something went wrong" });
	}
};

module.exports = {
	sendResetLink,
	resetPassword,
};
