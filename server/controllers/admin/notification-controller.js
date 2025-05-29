const AdminNotifications = require("../../models/AdminNotifications");

const createNotificationService = async ({ title, message, type }) => {
	const notification = new AdminNotifications({
		title,
		message,
		type,
		createdAt: new Date(),
		read: false,
	});
	await notification.save();
	return notification;
};

const createNotification = async (req, res) => {
	try {
		const { title, message, type } = req.body;
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
		const { id } = req.params;
		await AdminNotifications.findByIdAndUpdate(id, { isRead: true });
		res.status(200).json({ success: true, message: "Marked as read" });
	} catch (error) {
		console.error("Mark As Read Error:", error);
		res.status(500).json({ success: false, message: "Server error" });
	}
};

const deleteNotification = async (req, res) => {
	try {
		const { id } = req.params;
		await AdminNotifications.findByIdAndDelete(id);
		res.status(200).json({ success: true, message: "Notification deleted" });
	} catch (error) {
		console.error("Delete Notification Error:", error);
		res.status(500).json({ success: false, message: "Server error" });
	}
};

module.exports = {
	createNotification,
	createNotificationService,
	getNotifications,
	markAsRead,
	deleteNotification,
};
