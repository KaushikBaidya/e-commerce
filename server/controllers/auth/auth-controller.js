require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const {
	createNotificationService,
} = require("../admin/notification-controller");

// const { OAuth2Client } = require("google-auth-library");
// const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

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
		const accessToken = jwt.sign({ id: decoded.id }, process.env.JWT_SECRET, {
			expiresIn: "15m",
		});
		res.json({ success: true, accessToken });
	} catch (err) {
		return res
			.status(403)
			.json({ success: false, message: "Invalid refresh token" });
	}
};

const registerUser = async (req, res) => {
	const { userName, email, password } = req.body;
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

		const hashedPassword = await bcrypt.hash(password, 10);
		const newUser = await User.create({
			userName,
			email,
			password: hashedPassword,
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

const loginUser = async (req, res) => {
	const { email, password } = req.body;

	try {
		const user = await User.findOne({ email });
		if (!user) {
			return res.json({ success: false, message: "Invalid email or password" });
		}

		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			return res.json({ success: false, message: "Invalid email or password" });
		}

		const { accessToken, refreshToken } = generateTokens(user);

		res
			.cookie("accessToken", accessToken, {
				httpOnly: true,
				sameSite: "strict",
				secure: process.env.NODE_ENV === "production",
			})
			.cookie("refreshToken", refreshToken, {
				httpOnly: true,
				sameSite: "strict",
				secure: process.env.NODE_ENV === "production",
			})
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
	res.clearCookie("token");
	res.clearCookie("accessToken");
	res
		.clearCookie("refreshToken")
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
	loginUser,
	logout,
	refreshAccessToken,
	generateTokens,
	authMiddleware,
};
