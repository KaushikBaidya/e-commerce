const User = require("../../models/User");

const getAllUsers = async (req, res) => {
	try {
		const users = await User.find({});
		if (!users.length) {
			return res.status(404).json({
				success: false,
				message: "No users found!",
			});
		}
		res.status(200).json({
			success: true,
			data: users,
		});
	} catch (e) {
		console.log(e);
		res.status(500).json({
			success: false,
			message: "Some error occured!",
		});
	}
};

const getUserDetails = async (req, res) => {
	const { id } = req.params;
	try {
		const user = await User.findById(id);
		if (!user) {
			return res.status(404).json({
				success: false,
				message: "User not found!",
			});
		}
		res.status(200).json({
			success: true,
			data: user,
		});
	} catch (e) {
		console.log(e);
		res.status(500).json({
			success: false,
			message: "Some error occured!",
		});
	}
};

module.exports = { getAllUsers, getUserDetails };
