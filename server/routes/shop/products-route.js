const express = require("express");

const {
	getFilterdProducts,
	getProductDetails,
} = require("../../controllers/shop/products-controller");

const {
	getAllAuctionProducts,
	getAuctionProductDetails,
} = require("../../controllers/shop/auction-products-controller");

const { validateObjectId } = require("../../validator/validators");

const router = express.Router();

router.get("/auction-product/get", getAllAuctionProducts);
router.get(
	"/auction-product/get/:id",
	validateObjectId(),
	getAuctionProductDetails
);

router.get("/get", getFilterdProducts);
router.get("/get/:id", validateObjectId("id"), getProductDetails);

module.exports = router;
