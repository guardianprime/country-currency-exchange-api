import { body, validationResult } from "express-validator";

export const validateCountry = [
  body("name").notEmpty().withMessage("Name is required"),
  body("population")
    .notEmpty()
    .isNumeric()
    .withMessage("Population is required and must be numeric"),
  body("currency_code").notEmpty().withMessage("Currency code is required"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: "Validation failed",
        details: errors.array().reduce((acc, err) => {
          acc[err.param] = err.msg;
          return acc;
        }, {}),
      });
    }
    next();
  },
];
