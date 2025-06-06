const Feedback = require("../../models/Feedback");
const sanitize = require("mongo-sanitize");
const UserMessage = require("../../models/UserMessage");

// Create new feedback
const addFeedback = async (req, res) => {
	try {
		const body = sanitize(req.body);

		const newFeedback = new Feedback({
			userId: body.userId,
			userName: body.name,
			email: body.email,
			phone: body.phone,
			subject: body.subject,
			message: body.message,
			newsletter: body.newsletter || false,
			rating: body.rating || 0,
			feedbackType: body.feedbackType || "general",
			image: body.images || null,
			userAgent: req.headers["user-agent"] || "",
		});

		const savedFeedback = await newFeedback.save();

		return res.status(201).json({
			success: true,
			message: "Feedback submitted successfully.",
			data: savedFeedback,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Something went wrong while submitting feedback.",
			error: error.message,
		});
	}
};

const addUserMsg = async (req, res) => {
	try {
		const body = sanitize(req.body);

		const newMsg = new UserMessage({
			userName: body.name,
			email: body.email,
			subject: body.subject,
			message: body.message,
		});

		const savedMsg = await newMsg.save();

		return res.status(201).json({
			success: true,
			message: "Feedback submitted successfully.",
			data: savedMsg,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Something went wrong while submitting feedback.",
			error: error.message,
		});
	}
};

// Get feedback by ID (for user)
const getUserFeedbackById = async (req, res) => {
	try {
		const userId = sanitize(req.params.userId);

		const feedback = await Feedback.find({ userId });

		if (!feedback) {
			return res.status(404).json({
				success: false,
				message: "Feedback not found.",
			});
		}

		return res.status(200).json({
			success: true,
			data: feedback,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Error fetching feedback.",
			error: error.message,
		});
	}
};

module.exports = {
	addFeedback,
	addUserMsg,
	getUserFeedbackById,
};
