require("dotenv").config();
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const generateTokens = (user) => {
	const accessToken = jwt.sign(
		{
			id: user._id,
			email: user.email,
			role: user.role,
			userName: user.userName, // ✅ add this
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
			callbackURL: "/api/auth/google/callback",
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
					});
				}

				// ✅ Now that user is guaranteed to exist
				const { accessToken, refreshToken } = generateTokens(user);

				// You can attach tokens to user object or request if needed
				user.tokens = { accessToken, refreshToken };

				return done(null, user);
			} catch (error) {
				return done(error, null);
			}
		}
	)
);

// passport.use(
// 	new GoogleStrategy(
// 		{
// 			clientID: process.env.GOOGLE_CLIENT_ID,
// 			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
// 			callbackURL: "/api/auth/google/callback",
// 		},
// 		async (accessToken, refreshToken, profile, done) => {
// 			try {
// 				const email = profile.emails[0].value;
// 				let user = await User.findOne({ email });

// 				const { accessToken, refreshToken } = generateTokens(user);

// 				if (!user) {
// 					user = await User.create({
// 						userName: profile.displayName,
// 						email,
// 						googleId: profile.id,
// 						password: null,
// 						authProvider: "google",
// 						role: "user",
// 					});
// 				}
// 				return done(null, user);
// 			} catch (error) {
// 				return done(error, null);
// 			}
// 		}
// 	)
// );
