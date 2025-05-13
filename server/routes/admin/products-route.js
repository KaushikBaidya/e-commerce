const express = require("express");

const {
	handleImageUpload,
	addProduct,
	fetchAllProducts,
	editProduct,
	deleteProduct,
} = require("../../controllers/admin/products-constroller");

const { upload } = require("../../helper/cloudinary");
const router = express.Router();

router.post("/upload-image", upload.single("image"), handleImageUpload);
router.post("/add", addProduct);
router.put("/edit/:id", editProduct);
router.delete("/delete/:id", deleteProduct);
router.get("/get", fetchAllProducts);

module.exports = router;
