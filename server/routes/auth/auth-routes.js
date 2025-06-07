const express = require("express");
const passport = require("passport");
const rateLimit = require("express-rate-limit");
const {
	registerUser,
	loginUser,
	logout,
	authMiddleware,
	refreshAccessToken,
	verifyEmail,
} = require("../../controllers/auth/auth-controller");
const {
	sendResetLink,
	resetPassword,
} = require("../../controllers/auth/forgot-password-controller");

const {
	registerValidator,
	loginValidator,
	forgotPasswordValidator,
	resetPasswordValidator,
} = require("../../validator/authValidators");

const validateRequest = require("../../validator/validateRequest");

const router = express.Router();

router.post("/register", registerValidator, validateRequest, registerUser);
router.get("/verify-email", verifyEmail);

const loginLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 5,
	message: "Too many login attempts, try again later",
});

router.post("/login", loginLimiter, loginValidator, validateRequest, loginUser);
router.post("/logout", logout);

router.get("/check-auth", authMiddleware, (req, res) => {
	const user = req.user;
	res.json({ success: true, message: "Authenticated User", user });
});

router.get(
	"/google",
	passport.authenticate("google", {
		scope: ["profile", "email"],
		session: false,
	})
);

router.get(
	"/google/callback",
	passport.authenticate("google", { session: false }),
	(req, res) => {
		const { accessToken, refreshToken } = req.user.tokens;

		res
			.cookie("accessToken", accessToken, {
				httpOnly: true,
				secure: process.env.NODE_ENV === "production",
				sameSite: "strict",
			})
			.cookie("refreshToken", refreshToken, {
				httpOnly: true,
				secure: process.env.NODE_ENV === "production",
				sameSite: "strict",
			})
			.redirect(process.env.CLIENT_URL || "http://localhost:5173");
	}
);

router.post("/refresh", refreshAccessToken);

router.post(
	"/forgot-password",
	forgotPasswordValidator,
	validateRequest,
	sendResetLink
);
router.post(
	"/reset-password/:token",
	resetPasswordValidator,
	validateRequest,
	resetPassword
);

module.exports = router;
