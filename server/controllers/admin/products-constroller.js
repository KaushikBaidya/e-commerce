const cloudinary = require("cloudinary").v2;
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

module.exports = handleImageUpload;

//add product
const addProduct = async (req, res) => {
	try {
		const {
			image,
			imagePublicId,
			title,
			description,
			category,
			price,
			salePrice,
			totalStock,
		} = req.body;

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

//get all products
const fetchAllProducts = async (req, res) => {
	try {
		const productList = await Product.find({});
		res.status(200).json({ success: true, data: productList });
	} catch (error) {
		console.log(error);
		res.status(500).json({ success: false, message: "Server error" });
	}
};

//update product
const editProduct = async (req, res) => {
	try {
		const { id } = req.params;
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
		} = req.body;

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
		findProduct.salePrice =
			salePrice === "" ? 0 : salePrice || findProduct.salePrice;
		findProduct.totalStock = totalStock || findProduct.totalStock;

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
		const { id } = req.params;

		const product = await Product.findById(id);
		if (!product) {
			return res.status(404).json({
				success: false,
				message: "Product not found",
			});
		}

		// Delete image from Cloudinary if present
		if (product.imagePublicId) {
			await cloudinary.uploader.destroy(product.imagePublicId);
		}

		await product.deleteOne(); // or use findByIdAndDelete(id)

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
