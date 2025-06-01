const express = require("express");

const {
	getAllOrdersOfAllUsers,
	getOrderDetailsForAdmin,
	updateOrderStatus,
	getAllAuctionOrdersOfAllUsers,
} = require("../../controllers/admin/order-controller");

const { validateObjectId } = require("../../validator/validators");

const router = express.Router();

router.get("/get", getAllOrdersOfAllUsers);
router.get("/auction-order/get", getAllAuctionOrdersOfAllUsers);
router.get("/details/:id", validateObjectId("id"), getOrderDetailsForAdmin);
router.put("/update/:id", updateOrderStatus);

module.exports = router;
