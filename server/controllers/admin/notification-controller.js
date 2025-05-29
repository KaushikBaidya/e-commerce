import AdminNotifications from "../../models/AdminNotifications";

const createNotification = async (req, res) => {
	try {
		const { title, message, type } = req.body;

		const newNotification = new AdminNotifications({
			title,
			message,
			type,
		});

		await newNotification.save();
		res.status(201).json({ success: true, message: "Notification created" });
	} catch (error) {
		console.error("Create Notification Error:", error);
		res.status(500).json({ success: false, message: "Server error" });
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
	getNotifications,
	markAsRead,
	deleteNotification,
};
