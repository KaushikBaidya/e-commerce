const cloudinary = require("cloudinary").v2;
const multer = require("multer");
require("dotenv").config(); // Load env variables

// Configure Cloudinary with environment variables
cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer memory storage for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Utility function to upload image buffer to Cloudinary
const imageUploadUtil = (fileBuffer) => {
	return new Promise((resolve, reject) => {
		const stream = cloudinary.uploader.upload_stream(
			{ resource_type: "image" },
			(error, result) => {
				if (error) return reject(error);
				resolve(result);
			}
		);
		stream.end(fileBuffer);
	});
};

const deleteImageFromCloudinary = async (publicId) => {
	try {
		await cloudinary.uploader.destroy(publicId);
	} catch (error) {
		console.error("Error deleting image from Cloudinary:", error);
	}
};

module.exports = { upload, imageUploadUtil, deleteImageFromCloudinary };
