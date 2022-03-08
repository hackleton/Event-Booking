import { NextFunction, Request, Response } from "express";
import { check, validationResult, ValidationError, ValidationChain, Result } from "express-validator";
const config = require("../config/config");

const registerValidator = (): ValidationChain[] => [
  check("userName").notEmpty().withMessage("userName is required"),
  check("phoneNumber").notEmpty().withMessage("phoneNumber is required"),
  check("email").notEmpty().withMessage("email is required"),
  check("email").isEmail().withMessage("email is not valid"),
  check("password").notEmpty().withMessage("password is required"),
];

const loginValidator = (): ValidationChain[] => [
  check("email").notEmpty().withMessage("email is required"),
  check("email").isEmail().withMessage("email is not valid"),
  check("password").notEmpty().withMessage("password is required"),
];

const orderValidator = (): ValidationChain[] => [
  check("user_id").notEmpty().withMessage("user_id is required"),
  check("product").notEmpty().withMessage("product is required"),
  check("department").notEmpty().withMessage("field is required"),
  check("description").notEmpty().withMessage("field is required"),
  check("quantity").notEmpty().withMessage("quantity is required"),
  check("stock").notEmpty().withMessage("stock is required"),
  check("price").notEmpty().withMessage("price is required"),
  check("address").notEmpty().withMessage("address is required"),
  check("status").notEmpty().withMessage("status is required"),
  check("image").notEmpty().withMessage("image is required"),

];

const productValidator = (): ValidationChain[] => [
  check("product").notEmpty().withMessage("product is required"),
  check("department").notEmpty().withMessage("field is required"),
  check("quantity").notEmpty().withMessage("quantity is required"),
  check("price").notEmpty().withMessage("price is required"),
  check("image").notEmpty().withMessage("image is required"),
];

const cartOrder = (): ValidationChain[] => [
  check("product").notEmpty().withMessage("product is required"),
  check("department").notEmpty().withMessage("field is required"),
  check("quantity").notEmpty().withMessage("quantity is required"),
  check("price").notEmpty().withMessage("price is required"),
  check("image").notEmpty().withMessage("image is required"),
];

const validateInput = (req: Request, res: Response, next: NextFunction) => {
  const errors: Result<ValidationError> = validationResult(req);
  const messages: ValidationError[] = [];
  if (!errors.isEmpty()) {
    for (const i of errors.array()) {
      messages.push(i);
    }
  }

  if (messages.length) {
    return res
      .status(config.badRequestStatusCode)
      .json({
        data: {},
        status: config.badRequestStatusCode,
        message: messages[0].msg,
      });
  }
  return next();
};
export { loginValidator, validateInput, orderValidator, registerValidator, productValidator, cartOrder };
