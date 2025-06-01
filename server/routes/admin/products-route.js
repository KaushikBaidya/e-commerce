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

const { validateObjectId } = require("../../validator/validators");

const { upload } = require("../../helper/cloudinary");
const {
	addProductValidator,
	editProductValidator,
} = require("../../validator/productValidators");

const {
	addAuctionProductValidator,
	editAuctionProductValidator,
} = require("../../validator/auctionProductValidators");
const validateRequest = require("../../validator/validateRequest");

const router = express.Router();

router.post("/upload-image", upload.single("image"), handleImageUpload);

router.post("/add", addProductValidator, validateRequest, addProduct);
router.put(
	"/edit/:id",
	validateObjectId("id"),
	editProductValidator,
	validateRequest,
	editProduct
);
router.delete("/delete/:id", validateObjectId("id"), deleteProduct);
router.get("/get", fetchAllProducts);

router.post(
	"/auction-product/add",
	addAuctionProductValidator,
	validateRequest,
	addAuctionProduct
);
router.put(
	"/auction-product/edit/:id",
	validateObjectId("id"),
	editAuctionProductValidator,
	validateRequest,
	editAuctionProduct
);
router.get("/auction-product/get", fetchAllAuctionProducts);
router.delete(
	"/auction-product/delete/:id",
	validateObjectId("id"),
	deleteAuctionProduct
);

module.exports = router;
