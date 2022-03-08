"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePassword = exports.checkUser = exports.postForgotPassword = exports.login = exports.createUser = exports.getUser = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
const checkJwt_1 = require("../middleware/checkJwt");
const nodemailer = require('nodemailer');
const config = require("../config/config");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield userModel_1.default.find();
        return res
            .status(config.successStatusCode)
            .json(response("Users returned successfully", users, config.successStatusCode));
    }
    catch (error) {
        return res
            .status(config.badRequestStatusCode)
            .json(response("Unable to get  the user", {}, config.badRequestStatusCode));
    }
});
exports.getUser = getUser;
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const user = new userModel_1.default({
            userName: body.userName,
            phoneNumber: body.phoneNumber,
            email: body.email,
            password: bcrypt.hashSync(body.password.toString(), 10),
            role: body.role
        });
        let userExist;
        userExist = yield checkEmail(body.email);
        if (userExist) {
            return res
                .status(config.badRequestStatusCode)
                .json(response("User already exist", body, config.badRequestStatusCode));
        }
        const newUser = yield user.save();
        if (user.role === "Admin") {
            return res
                .status(config.successStatusCode)
                .json(response("New admin added", newUser, config.successStatusCode));
        }
        if (user.role === "Customer") {
            return res
                .status(config.successStatusCode)
                .json(response("New customer added", newUser, config.successStatusCode));
        }
    }
    catch (error) {
        return res
            .status(config.badRequestStatusCode)
            .json(response("Unable to create the user", {}, config.badRequestStatusCode));
    }
});
exports.createUser = createUser;
const checkEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield userModel_1.default.findOne({ email: email });
        return users;
    }
    catch (error) {
        return null;
    }
});
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.body.email);
        const users = yield userModel_1.default.findOne({ email: req.body.email });
        console.log(users);
        if (!users) {
            return res
                .status(config.badRequestStatusCode)
                .json(response("user not exist", req.body, config.successStatusCode));
        }
        if (!(yield bcrypt.compare(req.body.password, users.password))) {
            return res
                .status(config.badRequestStatusCode)
                .json(response("Invalid password", req.body, config.badRequestStatusCode));
        }
        return res
            .status(config.successStatusCode)
            .json(response("Users returned successfully", [createToken(users), users.userName, users.role], config.successStatusCode));
    }
    catch (error) {
        return res
            .status(config.badRequestStatusCode)
            .json(response("Unable to login", {}, config.badRequestStatusCode));
    }
});
exports.login = login;
const postForgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield userModel_1.default.findOne({ email: req.body.email });
        if (!users) {
            return res
                .status(config.badRequestStatusCode)
                .json(response("user not exist", req.body, config.successStatusCode));
        }
        const token = createToken(users);
        const newToken = yield userModel_1.default.findOneAndUpdate({ email: req.body.email }, { resetToken: token.token });
        if (users) {
            sendMail(req.body.email, token.token, 'New Password');
        }
        return res
            .status(config.successStatusCode)
            .json(response("Users returned successfully", [token, users.userName], config.successStatusCode));
    }
    catch (error) {
        console.log(error);
        return res
            .status(config.badRequestStatusCode)
            .json(response("Unable to login", {}, config.badRequestStatusCode));
    }
});
exports.postForgotPassword = postForgotPassword;
const createToken = (user) => {
    const expiresIn = '1d';
    const secret = config.jwtSecret;
    return {
        expiresIn,
        token: jwt.sign({ id: user._id, email: user.email, userName: user.userName, role: user.role }, secret, { expiresIn }),
    };
};
let sendMail = (email, token, subject) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'demotest5597@gmail.com',
                pass: 'testing@143'
            }
        });
        let Link = "http://localhost:4200/resetPassword";
        var mailOptions = {
            from: 'prashanthravichandran1@gmail.com',
            to: email,
            subject: 'New Password',
            text: `
          Hi,

          Greetings.

          Your password link is generated. You can create a new password by clicking on this link. It will be valid for 30mins only.
          Link: ${Link}/${token}`
        };
        yield transporter.sendMail(mailOptions);
    }
    catch (error) {
        return console.log(error);
    }
});
let checkUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let token = req.params.token;
        (0, checkJwt_1.tokenVerify)(req, res);
        return res
            .status(config.successStatusCode)
            .json(response("Authorized user", {}, config.successStatusCode));
    }
    catch (error) {
        console.log(error);
        return res
            .status(config.badRequestStatusCode)
            .json(response("Unauthorized user", {}, config.badRequestStatusCode));
    }
});
exports.checkUser = checkUser;
let updatePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.params.token;
        const password = bcrypt.hashSync(req.body.password.toString(), 10);
        let user_id = yield (0, checkJwt_1.tokenVerify)(req, res);
        console.log(user_id);
        let change = yield userModel_1.default.findOneAndUpdate({ _id: user_id }, { password, resetToken: token });
        res
            .status(config.successStatusCode)
            .json(response("Password Changed", {}, config.successStatusCode));
    }
    catch (error) {
        console.error(error);
        res
            .status(config.badRequestStatusCode)
            .json(response("Unable to change  the password", {}, config.badRequestStatusCode));
    }
});
exports.updatePassword = updatePassword;
let response = (message, data, status) => {
    return { message, data, status };
};
