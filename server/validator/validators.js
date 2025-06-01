const { param, validationResult } = require("express-validator");

const validateObjectId = (field = "id") => [
	param(field).isMongoId().withMessage(`Invalid ${field}`),
	(req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		next();
	},
];

module.exports = { validateObjectId };
