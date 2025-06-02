const AdminNotifications = require("../../models/AdminNotifications");
const mongoSanitize = require("mongo-sanitize");

const createNotificationService = async ({ title, message, type }) => {
	const sanitizedData = mongoSanitize({ title, message, type });

	const notification = new AdminNotifications({
		title: sanitizedData.title,
		message: sanitizedData.message,
		type: sanitizedData.type,
		createdAt: new Date(),
		read: false,
	});
	await notification.save();
	return notification;
};

const createNotification = async (req, res) => {
	try {
		const sanitizedBody = mongoSanitize(req.body);
		const { title, message, type } = sanitizedBody;

		const notification = await createNotificationService({
			title,
			message,
			type,
		});
		res.status(201).json({ success: true, notification });
	} catch (error) {
		console.error("Error creating notification:", error);
		res
			.status(500)
			.json({ success: false, message: "Failed to create notification" });
	}
};

const getNotifications = async (req, res) => {
	try {
		const sanitizedQuery = mongoSanitize(req.query);

		const notifications = await AdminNotifications.find()
			.sort({ createdAt: -1 })
			.limit(50);

		res.status(200).json({ success: true, data: notifications });
	} catch (error) {
		console.error("Get Notifications Error:", error);
		res.status(500).json({ success: false, message: "Server error" });
	}
};

const markAsRead = async (req, res) => {
	try {
		const sanitizedParams = mongoSanitize(req.params);
		const { id } = sanitizedParams;

		const updated = await AdminNotifications.findByIdAndUpdate(
			id,
			{ isRead: true },
			{ new: true }
		);

		if (!updated) {
			return res.status(404).json({
				success: false,
				message: "Notification not found",
			});
		}

		res.status(200).json({ success: true, data: updated });
	} catch (error) {
		console.error("Mark As Read Error:", error);
		res.status(500).json({ success: false, message: "Server error" });
	}
};

const markAllAsRead = async (req, res) => {
	try {
		const sanitizedQuery = mongoSanitize(req.query);
		const sanitizedBody = mongoSanitize(req.body);

		const result = await AdminNotifications.updateMany(
			{ isRead: false },
			{ isRead: true }
		);

		res.status(200).json({
			success: true,
			message: "All marked as read",
			modifiedCount: result.modifiedCount,
		});
	} catch (error) {
		console.error("Mark All As Read Error:", error);
		res.status(500).json({ success: false, message: "Server error" });
	}
};

const deleteNotification = async (req, res) => {
	try {
		const sanitizedParams = mongoSanitize(req.params);
		const { id } = sanitizedParams;

		const deleted = await AdminNotifications.findByIdAndDelete(id);

		if (!deleted) {
			return res.status(404).json({
				success: false,
				message: "Notification not found",
			});
		}

		res.status(200).json({ success: true, message: "Notification deleted" });
	} catch (error) {
		console.error("Delete Notification Error:", error);
		res.status(500).json({ success: false, message: "Server error" });
	}
};

const DeleteAllNotifications = async () => {
	try {
		await AdminNotifications.deleteMany({});
		console.log("All notifications deleted successfully.");
	} catch (error) {
		console.error("Error deleting all notifications:", error);
	}
};

module.exports = {
	createNotification,
	createNotificationService,
	getNotifications,
	markAsRead,
	markAllAsRead,
	deleteNotification,
	DeleteAllNotifications,
};
