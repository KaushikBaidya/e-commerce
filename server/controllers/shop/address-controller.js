const Address = require("../../models/Address");
const sanitize = require("mongo-sanitize");

const addAddress = async (req, res) => {
	try {
		const userId = sanitize(req.body.userId);
		const address = sanitize(req.body.address);
		const city = sanitize(req.body.city);
		const pincode = sanitize(req.body.pincode);
		const phone = sanitize(req.body.phone);
		const notes = sanitize(req.body.notes);

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
		const userId = sanitize(req.params.userId);
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
		// const { userId, addressId } = req.params;
		const userId = sanitize(req.params.userId);
		const addressId = sanitize(req.params.addressId);

		const sanitizedFormData = {};
		for (const [key, value] of Object.entries(req.body)) {
			sanitizedFormData[key] = sanitize(value);
		}

		if (!userId || !addressId) {
			return res.status(400).json({
				success: false,
				message: "All fields are required",
			});
		}

		const address = await Address.findOneAndUpdate(
			{ _id: addressId, userId },
			sanitizedFormData,
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
		// const { userId, addressId } = req.params;
		const userId = sanitize(req.params.userId);
		const addressId = sanitize(req.params.addressId);

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
