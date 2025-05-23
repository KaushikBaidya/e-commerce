const express = require("express");

const {
	getFilterdProducts,
	getProductDetails,
} = require("../../controllers/shop/products-controller");

const {
	getAllAuctionProducts,
	getAuctionProductDetails,
} = require("../../controllers/shop/auction-products-controller");

const router = express.Router();

router.get("/auction-product/get", getAllAuctionProducts);
router.get("/auction-product/get/:id", getAuctionProductDetails);

router.get("/get", getFilterdProducts);
router.get("/get/:id", getProductDetails);

module.exports = router;
