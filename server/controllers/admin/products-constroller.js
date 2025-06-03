const cloudinary = require("cloudinary").v2;
const mongoSanitize = require("mongo-sanitize");
const {
	imageUploadUtil,
	deleteImageFromCloudinary,
} = require("../../helper/cloudinary");
const Product = require("../../models/Product");

const handleImageUpload = async (req, res) => {
	try {
		if (!req.file) {
			return res.status(400).json({
				success: false,
				message: "No image file uploaded",
			});
		}

		const result = await imageUploadUtil(req.file.buffer);

		res.status(200).json({
			success: true,
			message: "Image uploaded successfully",
			data: {
				public_id: result.public_id,
				url: result.secure_url,
			},
		});
	} catch (error) {
		console.error("Cloudinary Upload Error:", error);
		res.status(500).json({
			success: false,
			message: "Image upload failed",
		});
	}
};

const addProduct = async (req, res) => {
	try {
		const sanitizedBody = mongoSanitize(req.body);

		const {
			image,
			imagePublicId,
			title,
			description,
			category,
			price,
			salePrice,
			totalStock,
		} = sanitizedBody;

		if (!title || !category || !price || !totalStock) {
			return res.status(400).json({
				success: false,
				message: "Missing required fields",
			});
		}

		const newlyAddedProduct = new Product({
			image,
			imagePublicId,
			title,
			description,
			category,
			price,
			salePrice,
			totalStock,
		});

		await newlyAddedProduct.save();
		res.status(201).json({
			success: true,
			data: newlyAddedProduct,
			message: "Product added successfully",
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({ success: false, message: "Server error" });
	}
};

const fetchAllProducts = async (req, res) => {
	try {
		const sanitizedQuery = mongoSanitize(req.query);

		const productList = await Product.find({}).sort({ createdAt: -1 });
		res.status(200).json({ success: true, data: productList });
	} catch (error) {
		console.log(error);
		res.status(500).json({ success: false, message: "Server error" });
	}
};

const editProduct = async (req, res) => {
	try {
		const sanitizedParams = mongoSanitize(req.params);
		const sanitizedBody = mongoSanitize(req.body);

		const { id } = sanitizedParams;
		const {
			image,
			imagePublicId,
			title,
			description,
			category,
			brand,
			price,
			salePrice,
			totalStock,
		} = sanitizedBody;

		console.log("Editing product salePrice:", salePrice);

		const findProduct = await Product.findById(id);
		if (!findProduct) {
			return res.status(404).json({
				success: false,
				message: "Product not found",
			});
		}

		if (image && image !== findProduct.image && findProduct.imagePublicId) {
			await deleteImageFromCloudinary(findProduct.imagePublicId);
		}

		findProduct.title = title || findProduct.title;
		findProduct.description = description || findProduct.description;
		findProduct.category = category || findProduct.category;
		findProduct.brand = brand || findProduct.brand;
		findProduct.price = price === "" ? 0 : price || findProduct.price;
		findProduct.salePrice = salePrice ?? findProduct.salePrice;
		findProduct.totalStock = totalStock ?? findProduct.totalStock;

		findProduct.image = image || findProduct.image;
		findProduct.imagePublicId = imagePublicId || findProduct.imagePublicId;

		await findProduct.save();

		res.status(200).json({
			success: true,
			data: findProduct,
			message: "Product updated successfully",
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({ success: false, message: "Server error" });
	}
};

//delete product
const deleteProduct = async (req, res) => {
	try {
		const sanitizedParams = mongoSanitize(req.params);
		const { id } = sanitizedParams;

		const product = await Product.findById(id);
		if (!product) {
			return res.status(404).json({
				success: false,
				message: "Product not found",
			});
		}

		if (product.imagePublicId) {
			await cloudinary.uploader.destroy(product.imagePublicId);
		}

		await product.deleteOne();

		res.status(200).json({
			success: true,
			message: "Product deleted successfully",
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({ success: false, message: "Server error" });
	}
};

module.exports = {
	handleImageUpload,
	addProduct,
	fetchAllProducts,
	editProduct,
	deleteProduct,
};
