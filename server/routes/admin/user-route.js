const express = require("express");

const {
	getAllUsers,
	getUserDetails,
} = require("../../controllers/admin/user-controller");

const { validateObjectId } = require("../../validator/validators");

const router = express.Router();

router.get("/get", getAllUsers);
router.get("/get/:id", validateObjectId("id"), getUserDetails);

module.exports = router;
