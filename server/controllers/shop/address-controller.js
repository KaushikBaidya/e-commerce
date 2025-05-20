const Address = require("../../models/Address");

const addAddress = async (req, res) => {
	try {
		const { userId, address, city, pincode, phone, notes } = req.body;

		if (!userId || !address || !city || !pincode || !phone || !notes) {
			return res.status(400).json({
				success: false,
				message: "All fields are required",
			});
		}
		const newlyCreatedAddress = await Address.create({
			userId,
			address,
			city,
			pincode,
			phone,
			notes,
		});

		res.status(201).json({
			success: true,
			data: newlyCreatedAddress,
			message: "Address added successfully",
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({ success: false, message: "Server error" });
	}
};

const fetchAllAddress = async (req, res) => {
	try {
		const { userId } = req.params;
		if (!userId) {
			return res
				.status(400)
				.json({ success: false, message: "User id is required" });
		}

		const addressesList = await Address.find({ userId });

		res.status(200).json({ success: true, data: addressesList });
	} catch (error) {
		console.log(error);
		res.status(500).json({ success: false, message: "Server error" });
	}
};

const editAddress = async (req, res) => {
	try {
		const { userId, addressId } = req.params;
		const formData = req.body;

		if (!userId || !addressId) {
			return res.status(400).json({
				success: false,
				message: "All fields are required",
			});
		}

		const address = await Address.findOneAndUpdate(
			{ _id: addressId, userId },
			formData,
			{ new: true }
		);

		if (!address) {
			return res.status(404).json({
				success: false,
				message: "Address not found",
			});
		}

		res.status(200).json({
			success: true,
			data: address,
			message: "Address updated successfully",
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({ success: false, message: "Server error" });
	}
};

const deleteAddress = async (req, res) => {
	try {
		const { userId, addressId } = req.params;

		if (!userId || !addressId) {
			return res.status(400).json({
				success: false,
				message: "All fields are required",
			});
		}

		const deletedAddress = await Address.findOneAndDelete({
			_id: addressId,
			userId,
		});

		if (!deletedAddress) {
			return res.status(404).json({
				success: false,
				message: "Address not found",
			});
		}

		res.status(200).json({
			success: true,
			message: "Address deleted successfully",
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({ success: false, message: "Server error" });
	}
};

module.exports = { addAddress, fetchAllAddress, editAddress, deleteAddress };
