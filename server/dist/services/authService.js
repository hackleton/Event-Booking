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
const userModel_1 = __importDefault(require("../models/userModel"));
const config = require("../config/config");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
class AuthService {
    login(input) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield userModel_1.default.findOne({ email: input.email });
                if (!users) {
                    return { status: 200, msg: "user not exist", data: input };
                }
                if (!(yield bcrypt.compare(input.password, users.password))) {
                    return {
                        status: 400,
                        msg: "Invalid password",
                        data: input,
                    };
                }
                return {
                    status: 200,
                    msg: "Users returned successfully",
                    data: this.createToken(users),
                };
            }
            catch (error) {
                console.error(error);
                return {
                    message: "Unable to login",
                    data: {},
                    status: config.badRequestStatusCode,
                };
            }
        });
    }
    createToken(user) {
        const expiresIn = 60 * 60; // an hour
        const secret = "123456789";
        return {
            expiresIn,
            token: jwt.sign({ id: user._id, email: user.email }, secret, {
                expiresIn,
            }),
        };
    }
}
exports.default = AuthService;
