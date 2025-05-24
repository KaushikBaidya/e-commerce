const express = require("express");

const {
	getAllOrdersOfAllUsers,
	getOrderDetailsForAdmin,
	updateOrderStatus,
	getAllAuctionOrdersOfAllUsers,
	getAllUsers,
} = require("../../controllers/admin/order-controller");

const router = express.Router();

router.get("/users/get", getAllUsers);
router.get("/get", getAllOrdersOfAllUsers);
router.get("/auction-order/get", getAllAuctionOrdersOfAllUsers);
router.get("/details/:id", getOrderDetailsForAdmin);
router.put("/update/:id", updateOrderStatus);

module.exports = router;
