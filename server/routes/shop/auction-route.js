const express = require("express");

const {
	placeBid,
	fetchBidItems,
} = require("../../controllers/shop/bid-controller");
const { validateObjectId } = require("../../validator/validators");
const { body, validationResult } = require("express-validator");
const mongoose = require("mongoose");

const router = express.Router();

const validateBid = [
	body("userId")
		.custom((value) => mongoose.Types.ObjectId.isValid(value))
		.withMessage("Invalid userId"),
	body("auctionId")
		.custom((value) => mongoose.Types.ObjectId.isValid(value))
		.withMessage("Invalid auctionId"),
	body("bidAmount")
		.isFloat({ gt: 0 })
		.withMessage("Bid amount must be a positive number"),
	(req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		next();
	},
];

router.get("/get/:userId", validateObjectId("userId"), fetchBidItems);

router.put("/place-bid", validateBid, placeBid);

module.exports = router;
