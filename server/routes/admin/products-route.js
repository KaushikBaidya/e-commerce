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
	editAuctionProduct,
} = require("../../controllers/admin/auction-products-controller");

const { upload } = require("../../helper/cloudinary");
const router = express.Router();

router.post("/upload-image", upload.single("image"), handleImageUpload);

router.post("/add", addProduct);
router.put("/edit/:id", editProduct);
router.delete("/delete/:id", deleteProduct);
router.get("/get", fetchAllProducts);

router.post("/auction-product/add", addAuctionProduct);
router.put("/auction-product/edit/:id", editAuctionProduct);
router.get("/auction-product/get", fetchAllAuctionProducts);
router.delete("/auction-product/delete/:id", deleteAuctionProduct);

module.exports = router;
