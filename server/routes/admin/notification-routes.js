const express = require("express");

const {
	createNotification,
	getNotifications,
	markAsRead,
	deleteNotification,
	markAllAsRead,
	DeleteAllNotifications,
} = require("../../controllers/admin/notification-controller");

const {
	createNotificationValidator,
	validateNotificationId,
} = require("../../validator/adminNotificationValidators");

const validateRequest = require("../../validator/validateRequest");
const { authMiddleware, isAdmin } = require("../../controllers/auth/auth-controller");

const router = express.Router();

router.use(authMiddleware, isAdmin);

router.post(
	"/",
	createNotificationValidator,
	validateRequest,
	createNotification
);
router.get("/", getNotifications);

router.patch("/:id/read", validateNotificationId, validateRequest, markAsRead);
router.patch("/read-all", markAllAsRead);

router.delete("/delete-all", DeleteAllNotifications);

router.delete(
	"/:id",
	validateNotificationId,
	validateRequest,
	deleteNotification
);

module.exports = router;
