const express = require("express");

const {
	getAllUsers,
	getUserDetails,
} = require("../../controllers/admin/user-controller");

const { validateObjectId } = require("../../validator/validators");
const { authMiddleware, isAdmin } = require("../../controllers/auth/auth-controller");

const router = express.Router();

router.use(authMiddleware, isAdmin);

router.get("/get", getAllUsers);
router.get("/get/:id", validateObjectId("id"), getUserDetails);

module.exports = router;
