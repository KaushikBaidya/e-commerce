const express = require("express");

const {
	addAddress,
	fetchAllAddress,
	editAddress,
	deleteAddress,
} = require("../../controllers/shop/address-controller");
const { validateObjectId } = require("../../validator/validators");

const router = express.Router();

const { body, param, validationResult } = require("express-validator");

const validateAddressBody = [
	body("address").notEmpty().withMessage("Address is required"),
	body("city").notEmpty().withMessage("City is required"),
	body("pincode")
		.matches(/^\d{4,6}$/)
		.withMessage("Pincode must be 4-6 digits"),
	body("phone")
		.matches(/^\d{10,15}$/)
		.withMessage("Phone number must be valid"),
	(req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		next();
	},
];

const validateUpdateAddress = [
	param("userId").isMongoId().withMessage("Invalid userId"),
	param("addressId").isMongoId().withMessage("Invalid addressId"),
	...validateAddressBody,
];

const validateDeleteAddress = [
	validateObjectId("userId")[0],
	validateObjectId("addressId")[0],
	(req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		next();
	},
];

router.post("/add", validateAddressBody, addAddress);
router.put("/update/:userId/:addressId", validateUpdateAddress, editAddress);

router.get("/get/:userId", validateObjectId("userId"), fetchAllAddress);

router.delete(
	"/delete/:userId/:addressId",
	validateDeleteAddress,
	deleteAddress
);

module.exports = router;
