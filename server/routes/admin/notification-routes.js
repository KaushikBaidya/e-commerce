const express = require("express");

const {
	createNotification,
	getNotifications,
	markAsRead,
	deleteNotification,
	markAllAsRead,
} = require("../../controllers/admin/notification-controller");

const {
	createNotificationValidator,
	validateNotificationId,
} = require("../../validator/adminNotificationValidators");

const validateRequest = require("../../validator/validateRequest");

const router = express.Router();

router.post(
	"/",
	createNotificationValidator,
	validateRequest,
	createNotification
);
router.get("/", getNotifications);

router.patch("/:id/read", validateNotificationId, validateRequest, markAsRead);
router.patch("/read-all", markAllAsRead);

router.delete(
	"/:id",
	validateNotificationId,
	validateRequest,
	deleteNotification
);

module.exports = router;
