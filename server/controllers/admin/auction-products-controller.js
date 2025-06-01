const AuctionProduct = require("../../models/Auction");
const cloudinary = require("cloudinary").v2;
const mongoSanitize = require("mongo-sanitize");
const { deleteImageFromCloudinary } = require("../../helper/cloudinary");

const addAuctionProduct = async (req, res) => {
	try {
		const sanitizedBody = mongoSanitize(req.body);

		const {
			image,
			imagePublicId,
			title,
			description,
			artist,
			startingBid,
			bidIncrement,
			startTime,
			endTime,
			isActive,
		} = sanitizedBody;

		if (!title || !artist || !startingBid || !startTime || !endTime) {
			return res.status(400).json({
				success: false,
				message: "Missing required fields",
			});
		}

		const newlyAddedProduct = new AuctionProduct({
			image,
			imagePublicId,
			title,
			description,
			artist,
			startingBid,
			currentBid: startingBid,
			bidIncrement,
			startTime,
			endTime,
			isActive,
		});

		await newlyAddedProduct.save();

		res.status(201).json({
			success: true,
			data: newlyAddedProduct,
			message: "Auctionable product added successfully",
		});
	} catch (error) {
		console.error("Error adding auction product:", error);
		res.status(500).json({
			success: false,
			message: "Server error",
		});
	}
};

const fetchAllAuctionProducts = async (req, res) => {
	try {
		const sanitizedQuery = mongoSanitize(req.query);

		const auctionProductList = await AuctionProduct.find({}).sort({
			createdAt: -1,
		});
		res.status(200).json({ success: true, data: auctionProductList });
	} catch (error) {
		console.log(error);
		res.status(500).json({ success: false, message: "Server error" });
	}
};

//update auctionable product
const editAuctionProduct = async (req, res) => {
	try {
		const sanitizedParams = mongoSanitize(req.params);
		const sanitizedBody = mongoSanitize(req.body);

		const { id } = sanitizedParams;
		const {
			image,
			imagePublicId,
			title,
			description,
			artist,
			startingBid,
			bidIncrement,
			startTime,
			endTime,
			isActive,
		} = sanitizedBody;

		const findAuctionProduct = await AuctionProduct.findById(id);
		if (!findAuctionProduct) {
			return res.status(404).json({
				success: false,
				message: "Auction Product not found",
			});
		}

		if (
			image &&
			image !== findAuctionProduct.image &&
			findAuctionProduct.imagePublicId
		) {
			await deleteImageFromCloudinary(findAuctionProduct.imagePublicId);
		}

		findAuctionProduct.title = title || findAuctionProduct.title;
		findAuctionProduct.description =
			description || findAuctionProduct.description;
		findAuctionProduct.artist = artist || findAuctionProduct.artist;
		findAuctionProduct.startingBid =
			startingBid === "" ? 0 : startingBid || findAuctionProduct.startingBid;
		findAuctionProduct.bidIncrement =
			bidIncrement === "" ? 0 : bidIncrement || findAuctionProduct.bidIncrement;
		findAuctionProduct.startTime = startTime || findAuctionProduct.startTime;
		findAuctionProduct.endTime = endTime || findAuctionProduct.endTime;
		if (typeof isActive === "boolean") {
			findAuctionProduct.isActive = isActive;
		}
		findAuctionProduct.image = image || findAuctionProduct.image;

		await findAuctionProduct.save();

		res.status(200).json({
			success: true,
			data: findAuctionProduct,
			message: "Auctionable product updated successfully",
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({ success: false, message: "Server error" });
	}
};

const deleteAuctionProduct = async (req, res) => {
	try {
		const sanitizedParams = mongoSanitize(req.params);
		const { id } = sanitizedParams;

		const deletedProduct = await AuctionProduct.findById(id);
		if (!deletedProduct) {
			return res.status(404).json({
				success: false,
				message: "Auctionable product not found",
			});
		}

		if (deletedProduct.imagePublicId) {
			await cloudinary.uploader.destroy(deletedProduct.imagePublicId);
		}

		await deletedProduct.deleteOne();
		res.status(200).json({
			success: true,
			message: "Auctionable product deleted successfully",
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({ success: false, message: "Server error" });
	}
};

module.exports = {
	addAuctionProduct,
	editAuctionProduct,
	fetchAllAuctionProducts,
	deleteAuctionProduct,
};
