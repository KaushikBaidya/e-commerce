const Product = require("../../models/Product");
const sanitize = require("mongo-sanitize");

const getFilterdProducts = async (req, res) => {
	try {
		const {
			category = [],
			brand = [],
			sortBy = "price-lowtohigh",
			page = 1,
			limit = 12,
		} = req.query;

		const sanitizedCategory = sanitize(category);
		const sanitizedBrand = sanitize(brand);
		const sanitizedSortBy = sanitize(sortBy);
		const sanitizedPage = sanitize(page);
		const sanitizedLimit = sanitize(limit);

		let filters = {};

		if (sanitizedCategory.length) {
			const categoryArray = sanitizedCategory.split(",").map(item => sanitize(item.trim()));
			filters.category = { $in: categoryArray };
		}
		if (sanitizedBrand.length) {
			const brandArray = sanitizedBrand.split(",").map(item => sanitize(item.trim()));
			filters.brand = { $in: brandArray };
		}

		let sort = {};
		switch (sanitizedSortBy) {
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

		const pageNumber = parseInt(sanitizedPage);
		const pageSize = parseInt(sanitizedLimit);
		const skip = (pageNumber - 1) * pageSize;

		const validPageNumber = Math.max(1, pageNumber || 1);
		const validPageSize = Math.min(Math.max(1, pageSize || 12), 100);
		const validSkip = (validPageNumber - 1) * validPageSize;

		const products = await Product.find(filters)
			.sort(sort)
			.skip(validSkip)
			.limit(validPageSize);

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
		const id = sanitize(req.params.id);
		
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