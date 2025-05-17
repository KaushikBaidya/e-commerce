const express = require("express");

const {
	getFilterdProducts,
	getProductDetails,
} = require("../../controllers/shop/products-controller");

const router = express.Router();

router.get("/get", getFilterdProducts);
router.get("/get/:id", getProductDetails);

module.exports = router;
