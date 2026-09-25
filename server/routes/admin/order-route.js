const express = require("express");

const {
	getAllOrdersOfAllUsers,
	getOrderDetailsForAdmin,
	updateOrderStatus,
	getAllAuctionOrdersOfAllUsers,
} = require("../../controllers/admin/order-controller");

const { validateObjectId } = require("../../validator/validators");
const { authMiddleware, isAdmin } = require("../../controllers/auth/auth-controller");

const router = express.Router();

router.use(authMiddleware, isAdmin);

router.get("/get", getAllOrdersOfAllUsers);
router.get("/auction-order/get", getAllAuctionOrdersOfAllUsers);
router.get("/details/:id", validateObjectId("id"), getOrderDetailsForAdmin);
router.put("/update/:id", updateOrderStatus);

module.exports = router;
