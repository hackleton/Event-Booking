"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cartOrder = exports.productValidator = exports.registerValidator = exports.orderValidator = exports.validateInput = exports.loginValidator = void 0;
const express_validator_1 = require("express-validator");
const config = require("../config/config");
const registerValidator = () => [
    (0, express_validator_1.check)("userName").notEmpty().withMessage("userName is required"),
    (0, express_validator_1.check)("phoneNumber").notEmpty().withMessage("phoneNumber is required"),
    (0, express_validator_1.check)("email").notEmpty().withMessage("email is required"),
    (0, express_validator_1.check)("email").isEmail().withMessage("email is not valid"),
    (0, express_validator_1.check)("password").notEmpty().withMessage("password is required"),
];
exports.registerValidator = registerValidator;
const loginValidator = () => [
    (0, express_validator_1.check)("email").notEmpty().withMessage("email is required"),
    (0, express_validator_1.check)("email").isEmail().withMessage("email is not valid"),
    (0, express_validator_1.check)("password").notEmpty().withMessage("password is required"),
];
exports.loginValidator = loginValidator;
const orderValidator = () => [
    (0, express_validator_1.check)("user_id").notEmpty().withMessage("user_id is required"),
    (0, express_validator_1.check)("product").notEmpty().withMessage("product is required"),
    (0, express_validator_1.check)("department").notEmpty().withMessage("field is required"),
    (0, express_validator_1.check)("description").notEmpty().withMessage("field is required"),
    (0, express_validator_1.check)("quantity").notEmpty().withMessage("quantity is required"),
    (0, express_validator_1.check)("stock").notEmpty().withMessage("stock is required"),
    (0, express_validator_1.check)("price").notEmpty().withMessage("price is required"),
    (0, express_validator_1.check)("address").notEmpty().withMessage("address is required"),
    (0, express_validator_1.check)("status").notEmpty().withMessage("status is required"),
    (0, express_validator_1.check)("image").notEmpty().withMessage("image is required"),
];
exports.orderValidator = orderValidator;
const productValidator = () => [
    (0, express_validator_1.check)("product").notEmpty().withMessage("product is required"),
    (0, express_validator_1.check)("department").notEmpty().withMessage("field is required"),
    (0, express_validator_1.check)("quantity").notEmpty().withMessage("quantity is required"),
    (0, express_validator_1.check)("price").notEmpty().withMessage("price is required"),
    (0, express_validator_1.check)("image").notEmpty().withMessage("image is required"),
];
exports.productValidator = productValidator;
const cartOrder = () => [
    (0, express_validator_1.check)("product").notEmpty().withMessage("product is required"),
    (0, express_validator_1.check)("department").notEmpty().withMessage("field is required"),
    (0, express_validator_1.check)("quantity").notEmpty().withMessage("quantity is required"),
    (0, express_validator_1.check)("price").notEmpty().withMessage("price is required"),
    (0, express_validator_1.check)("image").notEmpty().withMessage("image is required"),
];
exports.cartOrder = cartOrder;
const validateInput = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    const messages = [];
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
exports.validateInput = validateInput;
