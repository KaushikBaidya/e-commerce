const ProductReview = require("../../models/Review");
const Product = require("../../models/Product");
const Order = require("../../models/Order");
const {
	createNotificationService,
} = require("../admin/notification-controller");

// Add a product review
const addProductReview = async (req, res) => {
	try {
		const { productId, userId, userName, reviewMessage, reviewValue } =
			req.body;

		const order = await Order.findOne({
			userId,
			"cartItems.productId": productId,
		});

		if (!order) {
			return res.status(400).json({
				success: false,
				message: "You need to purchase the product first",
			});
		}

		// Check if the user has already reviewed the product
		const checkExsistingReview = await ProductReview.findOne({
			productId,
			userId,
		});
		if (checkExsistingReview) {
			return res.status(400).json({
				success: false,
				message: "You have already reviewed this product",
			});
		}

		// Create a new product review

		const newProductReview = new ProductReview({
			productId,
			userId,
			userName,
			reviewMessage,
			reviewValue,
		});

		await newProductReview.save();

		await createNotificationService({
			title: "New Review Added",
			message: `A new review has been added: ${newProductReview.reviewMessage}`,
			type: "review",
		});

		// Update the product rating and review count
		const reviews = await ProductReview.find({ productId });
		const totalReviewsLength = reviews.length;
		const averageReview =
			reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) /
			totalReviewsLength;

		await Product.findByIdAndUpdate(productId, { averageReview });

		res.status(201).json({
			success: true,
			data: newProductReview,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({ success: false, message: "Server error" });
	}
};

// Get all product reviews
const getProductReview = async (req, res) => {
	const { productId } = req.params;
	const reviews = await ProductReview.find({ productId }).sort({
		createdAt: -1,
	});
	res.status(200).json({ success: true, data: reviews });
	try {
	} catch (error) {
		console.log(error);
		res.status(500).json({ success: false, message: "Server error" });
	}
};

module.exports = { addProductReview, getProductReview };
