const { param, validationResult } = require("express-validator");

const handleValidationErrors = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).json({
			success: false,
			message: "Validation failed.",
			errors: errors.array(),
		});
	}
	next();
};

const validateObjectId = (field = "id") => {
	return [
		param(field).isMongoId().withMessage(`Invalid ${field}`),
		(req, res, next) => {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return res.status(400).json({ errors: errors.array() });
			}
			next();
		},
	];
};

// const validateObjectId = (field = "id") => [
// 	param(field).isMongoId().withMessage(`Invalid ${field}`),
// 	(req, res, next) => {
// 		const errors = validationResult(req);
// 		if (!errors.isEmpty()) {
// 			return res.status(400).json({ errors: errors.array() });
// 		}
// 		next();
// 	},
// ];

module.exports = { validateObjectId, handleValidationErrors };
