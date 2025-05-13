// helper/cloudinary.js
const cloudinary = require("cloudinary").v2;
const multer = require("multer");

cloudinary.config({
	cloud_name: "dn3aizefp",
	api_key: 693322322539291,
	api_secret: "lHejMaSRaEXefMOIZ0Of5GzMJjA",
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

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

module.exports = { upload, imageUploadUtil };

// const cloudinary = require("cloudinary").v2;
// const multer = require("multer");

// cloudinary.config({
// cloud_name: "dn3aizefp",
// api_key: 693322322539291,
// api_secret: "lHejMaSRaEXefMOIZ0Of5GzMJjA",
// });

// const storage = new multer.memoryStorage();

// async function imageUploadUtil(file) {
// 	const result = await cloudinary.uploader.upload(file, {
// 		resource_type: "auto",
// 	});

// 	return result;
// }

// const upload = multer({ storage });

// module.exports = { upload, imageUploadUtil };
