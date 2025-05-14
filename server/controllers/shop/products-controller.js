const Product = require("../../models/Product");

const getFilterdProducts = async (req, res) => {
	const products = await Product.find({});
	res.status(200).json({ success: true, data: products });
	try {
	} catch (error) {
		console.log(error);
		res.status(500).json({ success: false, message: "Server error" });
	}
};

module.exports = { getFilterdProducts };
