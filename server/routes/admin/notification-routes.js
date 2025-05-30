const express = require("express");

const {
	createNotification,
	getNotifications,
	markAsRead,
	deleteNotification,
	markAllAsRead,
} = require("../../controllers/admin/notification-controller");

const router = express.Router();

router.post("/", createNotification);
router.get("/", getNotifications);

router.patch("/:id/read", markAsRead);
router.patch("/read-all", markAllAsRead);

router.delete("/:id", deleteNotification);

module.exports = router;
