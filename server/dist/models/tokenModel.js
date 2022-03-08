"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const tokenSchema = new mongoose_1.Schema({
    email: {
        type: String,
        required: true,
    },
    token: {
        type: String,
    }
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("IToken", tokenSchema);
