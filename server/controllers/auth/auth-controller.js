const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");

// register

const registerUser = async (req, res) => {
	const { userName, email, password } = req.body;

	if (!userName || !email || !password) {
		return res.status(400).json({
			success: false,
			message: "All fields are required",
		});
	}

	try {
		const checkUser = await User.findOne({ email });
		if (checkUser) {
			return res.json({
				success: false,
				message: "User already exists with this email",
			});
		}

		const hashPassword = await bcrypt.hash(password, 10);
		const newUser = new User({
			userName,
			email,
			password: hashPassword,
		});
		await newUser.save();
		res.status(200).json({
			success: true,
			message: "User created successfully",
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			success: false,
			message: "Something went wrong",
		});
	}
};

// login

const loginUser = async (req, res) => {
	const { email, password } = req.body;

	try {
		const checkUser = await User.findOne({ email });
		if (!checkUser) {
			return res.json({
				success: false,
				message: "User does not exist with this email",
			});
		}

		const checkPassword = await bcrypt.compare(password, checkUser.password);
		if (!checkPassword) {
			return res.json({
				success: false,
				message: "Password is incorrect",
			});
		}
		const token = jwt.sign(
			{
				id: checkUser._id,
				role: checkUser.role,
				email: checkUser.email,
				userName: checkUser.userName,
			},
			"CLIENT_SECRET",
			{
				expiresIn: "7d",
			}
		);

		res
			.cookie("token", token, {
				httpOnly: true,
				secure: false,
			})
			.json({
				success: true,
				message: "User logged in successfully",
				user: {
					email: checkUser.email,
					role: checkUser.role,
					id: checkUser._id,
					userName: checkUser.userName,
				},
			});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			success: false,
			message: "Something went wrong",
		});
	}
};

// logout
const logout = (req, res) => {
	res.clearCookie("token").json({
		success: true,
		message: "User logged out successfully",
	});
};

// auth-middleware

const authMiddleware = async (req, res, next) => {
	const token = req.cookies.token;
	if (!token)
		return res.status(401).json({
			success: false,
			message: "Unauthorized User!",
		});
	try {
		const decoded = jwt.verify(token, "CLIENT_SECRET");
		req.user = decoded;
		next();
	} catch (error) {
		res.status(401).json({
			success: false,
			message: "Unauthorized User!",
		});
	}
};

module.exports = { registerUser, loginUser, logout, authMiddleware };
