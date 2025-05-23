const express = require("express");

const {
	placeBid,
	fetchBidItems,
} = require("../../controllers/shop/bid-controller");

const router = express.Router();

router.get("/get/:userId", fetchBidItems);
router.put("/place-bid", placeBid);

module.exports = router;
