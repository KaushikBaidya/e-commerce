require("dotenv").config();

const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const {
	createNotificationService,
} = require("../controllers/admin/notification-controller");

const generateTokens = (user) => {
	const accessToken = jwt.sign(
		{
			id: user._id,
			email: user.email,
			role: user.role,
			userName: user.userName,
		},
		process.env.JWT_SECRET,
		{ expiresIn: "15m" }
	);

	const refreshToken = jwt.sign({ id: user._id }, process.env.REFRESH_SECRET, {
		expiresIn: "7d",
	});

	return { accessToken, refreshToken };
};

passport.use(
	new GoogleStrategy(
		{
			clientID: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
			callbackURL: `${process.env.BACKEND_URL}/api/auth/google/callback`,
			// callbackURL: "/api/auth/google/callback",
		},
		async (accessTokenFromGoogle, refreshTokenFromGoogle, profile, done) => {
			try {
				const email = profile.emails[0].value;
				let user = await User.findOne({ email });

				if (!user) {
					user = await User.create({
						userName: profile.displayName,
						email,
						googleId: profile.id,
						password: null,
						authProvider: "google",
						role: "user",
						isVerified: true,
					});
				}

				await createNotificationService({
					title: "New User Registered",
					message: `A new user has been registered: ${user.email}`,
					type: "user",
				});

				const { accessToken, refreshToken } = generateTokens(user);

				user.tokens = { accessToken, refreshToken };

				return done(null, user);
			} catch (error) {
				return done(error, null);
			}
		}
	)
);
