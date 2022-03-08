"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productSchema = void 0;
const mongoose_1 = require("mongoose");
exports.productSchema = new mongoose_1.Schema({
    image: {
        type: String,
    },
    product: {
        type: String,
        required: true,
    },
    department: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
    },
    price: {
        type: Number,
        required: true,
    },
    user_id: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("Product", exports.productSchema);
