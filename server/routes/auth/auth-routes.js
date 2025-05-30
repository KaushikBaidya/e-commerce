const express = require("express");
const passport = require("passport");
const {
	registerUser,
	loginUser,
	logout,
	authMiddleware,
	refreshAccessToken,
	verifyEmail
} = require("../../controllers/auth/auth-controller");
const {
	sendResetLink,
	resetPassword,
} = require("../../controllers/auth/forgot-password-controller");

const router = express.Router();

router.post("/register", registerUser);
router.get("/verify-email", verifyEmail);

router.post("/login", loginUser);
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

// Handle Google callback
router.get(
	"/google/callback",
	passport.authenticate("google", { session: false }),
	(req, res) => {
		const { accessToken, refreshToken } = req.user.tokens;

		// Set cookies or send JSON response
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
			.redirect("http://localhost:5173"); // or send JSON if using SPA
	}
);

router.post("/refresh", refreshAccessToken);

router.post("/forgot-password", sendResetLink);
router.post("/reset-password/:token", resetPassword);

module.exports = router;
