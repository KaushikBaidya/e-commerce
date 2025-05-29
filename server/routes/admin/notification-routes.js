const express = require("express");

import {
	createNotification,
	getNotifications,
	markAsRead,
	deleteNotification,
} from "../controllers/notificationController.js";

const router = express.Router();

router.post("/", createNotification);

router.get("/", getNotifications);

router.patch("/:id/read", markAsRead);

router.delete("/:id", deleteNotification);

module.exports = router;
