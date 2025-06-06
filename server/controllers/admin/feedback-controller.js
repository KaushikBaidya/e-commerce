const Feedback = require("../../models/Feedback");
const UserMessage = require("../../models/UserMessage");
const sanitize = require("mongo-sanitize");

const getFeedback = async (req, res) => {
	try {
		const feedback = await Feedback.find({}).sort({ createdAt: -1 });
		return res.status(200).json({
			success: true,
			message: "Feedback fetched successfully.",
			data: feedback,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Something went wrong while fetching feedback.",
			error: error.message,
		});
	}
};

const getUserMessages = async (req, res) => {
	try {
		const messages = await UserMessage.find({}).sort({ createdAt: -1 });
		return res.status(200).json({
			success: true,
			message: "User messages fetched successfully.",
			data: messages,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Something went wrong while fetching user messages.",
			error: error.message,
		});
	}
};

module.exports = { getFeedback, getUserMessages };