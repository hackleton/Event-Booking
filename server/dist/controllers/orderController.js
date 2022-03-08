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
exports.getOrderStatus = exports.orderId = exports.deleteOrder = exports.updateOrder = exports.createOrder = exports.getOrder = void 0;
const productModel_1 = __importDefault(require("../models/productModel"));
const config = require("../config/config");
const getOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    productModel_1.default.find({}, (err, data) => {
        if (err) {
            console.log(err);
            res.status(500).json({ message: "internal server problem" });
        }
        else {
            console.log(data);
            res.json(data);
        }
    });
});
exports.getOrder = getOrder;
const getOrderStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let statusData = yield productModel_1.default.aggregate()
        .match({})
        .group({ _id: "$department", total: { $sum: 1 } })
        .project({ _id: 1, total: 1 });
    res.send(statusData);
    console.log(statusData);
});
exports.getOrderStatus = getOrderStatus;
const createOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let user = res.locals.jwtPayload;
    try {
        const order = new productModel_1.default(req.body);
        console.log(req.body);
        const newOrder = yield order.save();
        res
            .status(201)
            .json(response("order added", newOrder, config.successStatusCode));
    }
    catch (error) {
        console.error(error);
        res
            .status(config.badRequestStatusCode)
            .json(response("Unable to add  the order", {}, config.badRequestStatusCode));
    }
});
exports.createOrder = createOrder;
const updateOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newOrder = yield productModel_1.default.findOneAndUpdate({ _id: req.body.id }, req.body);
        res
            .status(config.successStatusCode)
            .json(response("Order updated", newOrder, config.successStatusCode));
    }
    catch (error) {
        console.error(error);
        res
            .status(config.badRequestStatusCode)
            .json(response("Unable to update  the order", {}, config.badRequestStatusCode));
    }
});
exports.updateOrder = updateOrder;
const deleteOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deleteOrder = yield productModel_1.default.deleteOne({ _id: req.body.id });
        res
            .status(config.successStatusCode)
            .json(response("Order deleted", deleteOrder, config.successStatusCode));
    }
    catch (error) {
        console.error(error);
        res
            .status(config.badRequestStatusCode)
            .json(response("Unable to delete  the order", {}, config.badRequestStatusCode));
    }
});
exports.deleteOrder = deleteOrder;
const orderId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    productModel_1.default.find({ _id: id }, (err, data) => {
        res.send(data);
    });
});
exports.orderId = orderId;
let response = (message, data, status) => {
    return { message, data, status };
};
