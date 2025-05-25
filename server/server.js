require("dotenv").config();

const express = require("express");

const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const authRouter = require("./routes/auth/auth-routes");
const adminProductsRouter = require("./routes/admin/products-route");
const adminOrderRouter = require("./routes/admin/order-route");
const adminUserRoute = require("./routes/admin/user-route");

const shopProductsRouter = require("./routes/shop/products-route");
const shopAuctionRouter = require("./routes/shop/auction-route");
const shopCartRouter = require("./routes/shop/cart-route");
const shopAddressRouter = require("./routes/shop/address-route");
const shopOrderRouter = require("./routes/shop/order-route");
const shopSearchRouter = require("./routes/shop/search-routes");

const auctionCheckoutRouter = require("./routes/shop/auction-checkout-route");

// connect database
mongoose
	.connect(process.env.MONGO_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => console.log("DB connected"))
	.catch((err) => {
		console.error("DB connection error:", err.message);
		process.exit(1); // Stop the server if DB fails to connect
	});

// Catch any unhandled promise rejections globally
process.on("unhandledRejection", (err) => {
	console.error("Unhandled Rejection:", err.message);
	process.exit(1);
});

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
	cors({
		origin: "http://localhost:5173",
		methods: ["GET", "POST", "PUT", "DELETE"],
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

// api-routes
app.use("/api/auth", authRouter);
app.use("/api/admin/products", adminProductsRouter);
app.use("/api/admin/orders", adminOrderRouter);
app.use("/api/admin/users", adminUserRoute);

app.use("/api/shop/products", shopProductsRouter);
app.use("/api/shop/auction", shopAuctionRouter);
app.use("/api/shop/cart", shopCartRouter);
app.use("/api/shop/address", shopAddressRouter);
app.use("/api/shop/order", shopOrderRouter);
app.use("/api/shop/search", shopSearchRouter);

app.use("/api/auction/checkout", auctionCheckoutRouter);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
