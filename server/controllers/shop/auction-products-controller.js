const AuctionProduct = require("../../models/Auction");
const sanitize = require("mongo-sanitize");

const getAllAuctionProducts = async (req, res) => {
	try {
		const auctionProductList = await AuctionProduct.find({}).sort({
			createdAt: -1,
		});
		res.status(200).json({ success: true, data: auctionProductList });
	} catch (error) {
		console.log(error);
		res.status(500).json({ success: false, message: "Server error" });
	}
};

const getAuctionProductDetails = async (req, res) => {
	try {
		const id = sanitize(req.params.id);
		const product = await AuctionProduct.findById(id);
		if (!product)
			return res
				.status(404)
				.json({ success: false, message: "Product not found" });

		res.status(200).json({ success: true, data: product });
	} catch (error) {
		console.log(error);
		res.status(500).json({ success: false, message: "Server error" });
	}
};

module.exports = { getAllAuctionProducts, getAuctionProductDetails };
