const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const authRouter = require("./routes/auth/auth-routes");
const adminProductsRouter = require("./routes/admin/products-route");

const shopProductsRouter = require("./routes/shop/products-route");
const shopCartRouter = require("./routes/shop/cart-route");
const shopAddressRouter = require("./routes/shop/address-route");

// connect database
mongoose
	.connect(
		"mongodb+srv://kdiganto29:myproject4916@cluster0.8anksjd.mongodb.net/"
	)
	.then(() => console.log("DB connected"))
	.catch((err) => console.log(err));

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

app.use("/api/shop/products", shopProductsRouter);
app.use("/api/shop/cart", shopCartRouter);
app.use("/api/shop/address", shopAddressRouter);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
