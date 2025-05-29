const Product = require("../../models/Product");

const getFilterdProducts = async (req, res) => {
	try {
		const {
			category = [],
			brand = [],
			sortBy = "price-lowtohigh",
			page = 1,
			limit = 12,
		} = req.query;

		let filters = {};

		if (category.length) {
			filters.category = { $in: category.split(",") };
		}
		if (brand.length) {
			filters.brand = { $in: brand.split(",") };
		}

		let sort = {};
		switch (sortBy) {
			case "price-lowtohigh":
				sort.price = 1;
				break;
			case "price-hightolow":
				sort.price = -1;
				break;
			case "title-atoz":
				sort.title = 1;
				break;
			case "title-ztoa":
				sort.title = -1;
				break;
			default:
				sort.price = 1;
				break;
		}

		const pageNumber = parseInt(page);
		const pageSize = parseInt(limit);
		const skip = (pageNumber - 1) * pageSize;

		const products = await Product.find(filters)
			.sort(sort)
			.skip(skip)
			.limit(pageSize);

		const totalCount = await Product.countDocuments(filters);

		res.status(200).json({
			success: true,
			data: products,
			totalCount,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({ success: false, message: "Server error" });
	}
};

const getProductDetails = async (req, res) => {
	try {
		const { id } = req.params;
		const product = await Product.findById(id);
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

module.exports = { getFilterdProducts, getProductDetails };
