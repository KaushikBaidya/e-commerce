const express = require("express");

const {
	getAllUsers,
	getUserDetails,
} = require("../../controllers/admin/user-controller");

const router = express.Router();

router.get("/get", getAllUsers);
router.get("/get/:id", getUserDetails);

module.exports = router;
