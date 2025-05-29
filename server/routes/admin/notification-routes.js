const express = require("express");

const {
	createNotification,
	getNotifications,
	markAsRead,
	deleteNotification,
} = require("../../controllers/admin/notification-controller");

const router = express.Router();

router.post("/", createNotification);
router.get("/", getNotifications);
router.patch("/:id/read", markAsRead);
router.delete("/:id", deleteNotification);

module.exports = router;
