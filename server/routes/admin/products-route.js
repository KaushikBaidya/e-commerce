const express = require("express");

const {
	handleImageUpload,
	addProduct,
	fetchAllProducts,
	editProduct,
	deleteProduct,
} = require("../../controllers/admin/products-constroller");

const {
	addAuctionProduct,
	fetchAllAuctionProducts,
	deleteAuctionProduct,
} = require("../../controllers/admin/auction-productss-controller");

const { upload } = require("../../helper/cloudinary");
const router = express.Router();

router.post("/upload-image", upload.single("image"), handleImageUpload);
router.post("/add", addProduct);
router.put("/edit/:id", editProduct);
router.delete("/delete/:id", deleteProduct);
router.get("/get", fetchAllProducts);

router.post("/auction-product/add", addAuctionProduct);
router.get("/auction-product/get", fetchAllAuctionProducts);
router.delete("/auction-product/delete/:id", deleteAuctionProduct);

module.exports = router;
