const ProductReview = require("../../models/Review");
const Product = require("../../models/Product");
const User = require("../../models/User");

const addProductReview = async (req, res) => {
	try {
		const { productId, userId, userName, reviewMessage, reviewValue } =
			req.body;
	} catch (error) {
		console.log(error);
		res.status(500).json({ success: false, message: "Server error" });
	}
};
const getProductReview = async (req, res) => {
	try {
	} catch (error) {
		console.log(error);
		res.status(500).json({ success: false, message: "Server error" });
	}
};

module.exports = { addProductReview, getProductReview };
