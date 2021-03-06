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
const bcrypt = require('bcryptjs');
const crypt = require('crypto');
const nodemailer = require('nodemailer');
const User = require('../models/users');
const passwordResetToken = require('../models/resettoken');
module.exports = {
    CreateUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userEmail = yield User.findOne({
                email: req.body.email
            });
            if (userEmail) {
                return res
                    .status(409)
                    .json({ message: 'Email already exist' });
            }
            const userName = yield User.findOne({
                username: req.body.username
            });
            if (userName) {
                return res
                    .status(409)
                    .json({ message: 'Username already exist' });
            }
            return bcrypt.hash(req.body.password, 10, (err, hash) => {
                if (err) {
                    return res
                        .status(400)
                        .json({ message: 'Error hashing password' });
                }
                const body = {
                    username: req.body.username,
                    email: req.body.email,
                    password: hash
                };
                User.create(body)
                    .then((user) => {
                    res;
                    res.status(201).json({ message: 'User created successfully', user });
                })
                    .catch(() => {
                    res
                        .status(500)
                        .json({ message: 'Error occured' });
                });
            });
        });
    },
    forgotPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.body.email) {
                return res
                    .status(500)
                    .json({ message: 'Email is required' });
            }
            const user = yield User.findOne({
                email: req.body.email
            });
            if (!user) {
                return res
                    .status(409)
                    .json({ message: 'Email does not exist' });
            }
            var resettoken = new passwordResetToken({ _userId: user._id, resettoken: crypt.randomBytes(16).toString('hex') });
            resettoken.save(function (err) {
                if (err) {
                    return res.status(500).send({ msg: err.message });
                }
                passwordResetToken.find({ _userId: user._id, resettoken: { $ne: resettoken.resettoken } }).remove().exec();
                res.status(200).json({ message: 'Reset Password successfully.' });
                var transporter = nodemailer.createTransport({
                    service: 'Gmail',
                    port: 465,
                    auth: {
                        user: 'user',
                        pass: 'password'
                    }
                });
                var mailOptions = {
                    to: user.email,
                    from: 'your email',
                    subject: 'Node.js Password Reset',
                    text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                        'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                        'http://localhost:4200/response-reset-password/' + resettoken.resettoken + '\n\n' +
                        'If you did not request this, please ignore this email and your password will remain unchanged.\n'
                };
                transporter.sendMail(mailOptions, (err, info) => {
                });
            });
        });
    },
    ValidPasswordToken(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.body.resettoken) {
                return res
                    .status(500)
                    .json({ message: 'Token is required' });
            }
            const user = yield passwordResetToken.findOne({
                resettoken: req.body.resettoken
            });
            if (!user) {
                return res
                    .status(409)
                    .json({ message: 'Invalid URL' });
            }
            User.findOneAndUpdate({ _id: user._userId }).then(() => {
                res.status(200).json({ message: 'Token verified successfully.' });
            }).catch((err) => {
                return res.status(500).send({ msg: err.message });
            });
        });
    },
    NewPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            passwordResetToken.findOne({ resettoken: req.body.resettoken }, function (err, userToken, next) {
                if (!userToken) {
                    return res
                        .status(409)
                        .json({ message: 'Token has expired' });
                }
                User.findOne({
                    _id: userToken._userId
                }, function (err, userEmail, next) {
                    if (!userEmail) {
                        return res
                            .status(409)
                            .json({ message: 'User does not exist' });
                    }
                    return bcrypt.hash(req.body.newPassword, 10, (err, hash) => {
                        if (err) {
                            return res
                                .status(400)
                                .json({ message: 'Error hashing password' });
                        }
                        userEmail.password = hash;
                        userEmail.save(function (err) {
                            if (err) {
                                return res
                                    .status(400)
                                    .json({ message: 'Password can not reset.' });
                            }
                            else {
                                userToken.remove();
                                return res
                                    .status(201)
                                    .json({ message: 'Password reset successfully' });
                            }
                        });
                    });
                });
            });
        });
    }
};
