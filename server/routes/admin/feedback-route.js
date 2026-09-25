const express = require("express");

const { getFeedback, getUserMessages } = require("../../controllers/admin/feedback-controller");
const { authMiddleware, isAdmin } = require("../../controllers/auth/auth-controller");

const router = express.Router();

router.use(authMiddleware, isAdmin);

router.get("/get", getFeedback);
router.get("/user-message/get", getUserMessages);

module.exports = router;