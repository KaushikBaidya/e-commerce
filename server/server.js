require("dotenv").config();

const express = require("express");
require("./helper/passport");
const http = require("http");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const passport = require("passport");

// Socket.IO init
const { initSocket } = require("./helper/socket");

// Routes
const authRouter = require("./routes/auth/auth-routes");
const adminProductsRouter = require("./routes/admin/products-route");
const adminOrderRouter = require("./routes/admin/order-route");
const adminUserRoute = require("./routes/admin/user-route");
const adminNotificationRoute = require("./routes/admin/notification-routes");
const adminFeedbackRoute = require("./routes/admin/feedback-route");

const shopProductsRouter = require("./routes/shop/products-route");
const shopAuctionRouter = require("./routes/shop/auction-route");
const shopCartRouter = require("./routes/shop/cart-route");
const shopAddressRouter = require("./routes/shop/address-route");
const shopOrderRouter = require("./routes/shop/order-route");
const shopSearchRouter = require("./routes/shop/search-routes");
const shopReviewRouter = require("./routes/shop/product-review-routes");
const shopFeedbackRouter = require("./routes/shop/feedback-route");

const auctionCheckoutRouter = require("./routes/shop/auction-checkout-route");
const { startAuctionMonitor } = require("./helper/auction-monitor");

// Connect to MongoDB
mongoose
	.connect(process.env.MONGO_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => console.log("DB connected"))
	.catch((err) => {
		console.error("DB connection error:", err.message);
		process.exit(1);
	});

process.on("unhandledRejection", (err) => {
	console.error("Unhandled Rejection:", err.message);
	process.exit(1);
});

const app = express();
const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

// Middlewares
app.use(
	cors({
		origin: (origin, callback) => {
			const allowedOrigins = process.env.CORS_ORIGIN
				? process.env.CORS_ORIGIN.split(",")
				: ["http://localhost:5173"];

			console.log("🔍 CORS Debug Info:");
			console.log("Request Origin:", origin);
			console.log("CORS_ORIGIN env var:", process.env.CORS_ORIGIN);
			console.log("Allowed Origins:", allowedOrigins);

			if (!origin || allowedOrigins.includes(origin)) {
				console.log("✅ CORS: Origin allowed");
				callback(null, true);
			} else {
				console.log("❌ CORS: Origin blocked");
				console.warn(`Blocked by CORS: ${origin}`);
				callback(new Error("Not allowed by CORS"));
			}
		},
		methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
		allowedHeaders: [
			"Content-Type",
			"Authorization",
			"Cache-Control",
			"Expires",
			"Pragma",
		],
		credentials: true,
	})
);

app.use(cookieParser());
app.use(express.json());
app.use(passport.initialize());

// Initialize Socket.IO (moved to separate file)
initSocket(server);
startAuctionMonitor();

// API Routes
app.use("/api/auth", authRouter);
app.use("/api/admin/products", adminProductsRouter);
app.use("/api/admin/orders", adminOrderRouter);
app.use("/api/admin/users", adminUserRoute);
app.use("/api/admin/notifications", adminNotificationRoute);
app.use("/api/admin/feedback", adminFeedbackRoute);

app.use("/api/shop/products", shopProductsRouter);
app.use("/api/shop/auction", shopAuctionRouter);
app.use("/api/shop/cart", shopCartRouter);
app.use("/api/shop/address", shopAddressRouter);
app.use("/api/shop/order", shopOrderRouter);
app.use("/api/shop/search", shopSearchRouter);
app.use("/api/shop/review", shopReviewRouter);
app.use("/api/shop/feedback", shopFeedbackRouter);

app.use("/api/auction/checkout", auctionCheckoutRouter);

// Start Server
server.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});

module.exports = { server };
