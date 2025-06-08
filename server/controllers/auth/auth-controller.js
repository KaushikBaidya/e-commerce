require("dotenv").config();

const crypto = require("crypto");
const sanitize = require("mongo-sanitize");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const {
	createNotificationService,
} = require("../admin/notification-controller");

const generateTokens = (user) => {
	const accessToken = jwt.sign(
		{ id: user._id, email: user.email, role: user.role },
		process.env.JWT_SECRET,
		{ expiresIn: "50m" }
	);

	const refreshToken = jwt.sign({ id: user._id }, process.env.REFRESH_SECRET, {
		expiresIn: "7d",
	});

	return { accessToken, refreshToken };
};

const refreshAccessToken = (req, res) => {
	const token = req.cookies.refreshToken;
	if (!token)
		return res.status(401).json({ success: false, message: "No token" });

	try {
		const decoded = jwt.verify(token, process.env.REFRESH_SECRET);
		// Fix: Need to get user details for new access token
		User.findById(decoded.id)
			.then((user) => {
				if (!user) {
					return res
						.status(403)
						.json({ success: false, message: "User not found" });
				}

				const accessToken = jwt.sign(
					{ id: user._id, email: user.email, role: user.role },
					process.env.JWT_SECRET,
					{ expiresIn: "50m" }
				);

				// Set the new access token as cookie
				res.cookie("accessToken", accessToken, {
					httpOnly: true,
					sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
					secure: process.env.NODE_ENV === "production",
					maxAge: 50 * 60 * 1000, // 50 minutes
				});

				res.json({ success: true, accessToken });
			})
			.catch((err) => {
				return res
					.status(403)
					.json({ success: false, message: "Invalid refresh token" });
			});
	} catch (err) {
		return res
			.status(403)
			.json({ success: false, message: "Invalid refresh token" });
	}
};

const registerUser = async (req, res) => {
	const userName = sanitize(req.body.userName);
	const email = sanitize(req.body.email);
	const password = sanitize(req.body.password);

	if (!userName || !email || !password)
		return res
			.status(400)
			.json({ success: false, message: "All fields are required" });

	try {
		const existing = await User.findOne({ email });
		if (existing)
			return res.json({
				success: false,
				message: "User already exists with this email",
			});

		const token = crypto.randomBytes(32).toString("hex");
		const expiry = Date.now() + 1000 * 60 * 60 * 24;

		const transporter = nodemailer.createTransport({
			service: "Gmail",
			auth: {
				user: process.env.EMAIL_USER,
				pass: process.env.EMAIL_PASS,
			},
		});

		const mailOptions = {
			from: process.env.EMAIL_USER,
			to: email,
			subject: "Account Verification",
			html: `<div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px; background-color: #f9f9f9;">
				<h2 style="color: #333;">Welcome to Galería! 🎉</h2>
				<p style="font-size: 16px; color: #555;">
					Hi there,<br />
					Thank you for registering! Please confirm your email address by clicking the button below:
				</p>

				<div style="text-align: center; margin: 30px 0;">
					<a
						href="${process.env.CLIENT_URL}/verify/${token}"
						style="background-color: #4f46e5; color: #fff; padding: 12px 20px; text-decoration: none; border-radius: 6px; font-size: 16px; display: inline-block;"
					>
						✅ Verify Email
					</a>
				</div>

				<p style="font-size: 14px; color: #777;">
					If you did not create an account, you can safely ignore this email.<br />
					This link will expire in 24 hours.
				</p>

				<hr style="margin: 30px 0;" />
				<p style="font-size: 12px; color: #aaa; text-align: center;">
					&copy; ${new Date().getFullYear()} Your Company Name. All rights reserved.
				</p>
			</div>
			`,
		};

		await transporter.sendMail(mailOptions);

		const hashedPassword = await bcrypt.hash(password, 10);

		const newUser = await User.create({
			userName,
			email,
			password: hashedPassword,
			verificationToken: token,
			verificationExpires: new Date(expiry),
			isVerified: false,
		});

		await createNotificationService({
			title: "New User Registered",
			message: `A new user has been registered: ${newUser.userName}`,
			type: "user",
		});

		res
			.status(200)
			.json({ success: true, message: "User created successfully" });
	} catch (err) {
		console.log(err);
		res.status(500).json({ success: false, message: "Server error" });
	}
};

const verifyEmail = async (req, res) => {
	// Fix: Get token from params instead of query
	const { token } = req.params;
	if (!token)
		return res.status(400).json({ success: false, message: "Token missing" });

	try {
		const user = await User.findOne({
			verificationToken: token,
			verificationExpires: { $gt: Date.now() },
		});

		if (!user)
			return res
				.status(400)
				.json({ success: false, message: "Invalid or expired token" });

		user.isVerified = true;
		user.verificationToken = undefined;
		user.verificationExpires = undefined;

		await user.save();

		res.json({ success: true, message: "Email verified successfully" });
	} catch (err) {
		console.log(err);
		res.status(500).json({ success: false, message: "Server error" });
	}
};

const loginUser = async (req, res) => {
	const email = sanitize(req.body.email);
	const password = sanitize(req.body.password);

	try {
		const user = await User.findOne({ email });
		if (!user) {
			return res.json({ success: false, message: "Invalid email or password" });
		}

		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			return res.json({ success: false, message: "Invalid email or password" });
		}

		if (!user.isVerified) {
			return res.status(403).json({
				success: false,
				message: "Please verify your email before logging in",
			});
		}

		const { accessToken, refreshToken } = generateTokens(user);

		// Fix: Cookie settings for production
		const cookieOptions = {
			httpOnly: true,
			sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
			secure: process.env.NODE_ENV === "production",
			maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days for refresh token
		};

		const accessCookieOptions = {
			...cookieOptions,
			maxAge: 50 * 60 * 1000, // 50 minutes for access token
		};

		res
			.cookie("accessToken", accessToken, accessCookieOptions)
			.cookie("refreshToken", refreshToken, cookieOptions)
			.json({
				success: true,
				message: "Logged in successfully",
				user: {
					id: user._id,
					userName: user.userName,
					email: user.email,
					role: user.role,
				},
			});
	} catch (err) {
		console.error("Login error:", err);
		res.status(500).json({ success: false, message: "Server error" });
	}
};

const logout = (req, res) => {
	const cookieOptions = {
		httpOnly: true,
		sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
		secure: process.env.NODE_ENV === "production",
	};

	res
		.clearCookie("token", cookieOptions)
		.clearCookie("accessToken", cookieOptions)
		.clearCookie("refreshToken", cookieOptions)
		.json({ success: true, message: "Logged out" });
};

const authMiddleware = (req, res, next) => {
	const token = req.cookies.accessToken;
	if (!token)
		return res.status(401).json({ success: false, message: "Unauthorized" });

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.user = decoded;
		next();
	} catch (err) {
		res.status(401).json({ success: false, message: "Unauthorized" });
	}
};

module.exports = {
	registerUser,
	verifyEmail,
	loginUser,
	logout,
	refreshAccessToken,
	generateTokens,
	authMiddleware,
};
