const express = require("express");

const {
	getFilterdProducts,
} = require("../../controllers/shop/products-controller");

const router = express.Router();

router.get("/get", getFilterdProducts);

module.exports = router;
