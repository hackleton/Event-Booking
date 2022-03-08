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
exports.makePayment = exports.clearCart = exports.getcartOrders = exports.checkout = exports.deleteProduct = exports.getCartProducts = exports.updateCart = exports.addToCart = exports.getProduct = void 0;
const productModel_1 = __importDefault(require("../models/productModel"));
const cart_1 = __importDefault(require("../models/cart"));
const cartOrder_1 = __importDefault(require("../models/cartOrder"));
const config = require("../config/config");
const stripe = require("stripe")("sk_test_51KRvc0SIrrXAtd13rbytR4V5GpDhUnKTmMoXY2eTm9Z9i9Thd8CoosUumYJejQb9mXzt1sAkPDky4NKW0OdCZUmR00LhOLDcHg");
const getProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    productModel_1.default.find({}, (err, data) => {
        if (err) {
            res.status(500).json({ message: "internal server problem" });
        }
        else {
            res.status(200).json(data);
        }
    });
});
exports.getProduct = getProduct;
const addToCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let isExistingCart = yield cart_1.default.find({ user_id: req.body.user_id });
        if (isExistingCart.length) {
            let temp = isExistingCart[0].product;
            let isAlreadyExistedProduct = false;
            let existingProducts = temp.map((element) => {
                if (element.product.equals(req.body.id)) {
                    isAlreadyExistedProduct = true;
                    element.quantity++;
                }
                return element;
            });
            let updatedProducts = [...existingProducts];
            if (isAlreadyExistedProduct === false) {
                updatedProducts.push({ product: req.body.id, quantity: 1 });
            }
            yield cart_1.default.findOneAndUpdate({ _id: isExistingCart[0]._id }, { product: updatedProducts });
        }
        else {
            const product = new cart_1.default({
                user_id: req.body.user_id,
                product: [{ product: req.body.id, quantity: 1 }],
            });
            const cartProduct = yield product.save();
            res
                .status(200)
                .json(response("Product added to cart", cartProduct, config.successStatusCode));
        }
    }
    catch (error) {
        console.error(error);
        res
            .status(config.badRequestStatusCode)
            .json(response("Unable to add  the product to cart", { error }, config.badRequestStatusCode));
    }
});
exports.addToCart = addToCart;
const updateCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let existedProduct = yield cart_1.default.find({
            user_id: req.body.user_id,
        });
        console.log(existedProduct);
        let temp = existedProduct[0].product.flat();
        let demo = temp.map((element) => {
            if (element.product.equals(req.body._id)) {
                element.quantity = req.body.quantity;
            }
            return element;
        });
        let updated = yield cart_1.default.findOneAndUpdate({ user_id: req.body.user_id }, { product: demo });
        res
            .status(config.successStatusCode)
            .json(response("Cart updated", updated, config.successStatusCode));
    }
    catch (error) {
        console.error(error);
        res
            .status(config.badRequestStatusCode)
            .json(response("Unable to update  the cart", {}, config.badRequestStatusCode));
    }
});
exports.updateCart = updateCart;
const getCartProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const getProduct = yield cart_1.default.aggregate()
            .match({ user_id: req.body.user_id })
            .unwind("$product")
            .lookup({
            from: "products",
            localField: "product.product",
            foreignField: "_id",
            as: "productDetails",
        })
            .group({
            _id: "$_id",
            user_id: { $first: "$user_id" },
            productdetails: { $push: "$productDetails" },
            quantity: { $push: "$product" },
        })
            .project({
            user_id: 1,
            productdetails: {
                $reduce: {
                    input: "$productdetails",
                    initialValue: [],
                    in: { $concatArrays: ["$$value", "$$this"] },
                },
            },
            quantity: 1,
        });
        getProduct.map((data) => {
            let orderDetails = data.quantity;
            let productDetails = data.productdetails;
            for (let i in orderDetails) {
                productDetails[i].quantity = orderDetails[i].quantity;
                console.log(productDetails[i].quantity = orderDetails[i].quantity, '********');
            }
            return { product: data.productdetails };
        });
        res
            .status(config.successStatusCode)
            .json(response("Cart updated", getProduct, config.successStatusCode));
    }
    catch (error) {
        console.error(error);
        res
            .status(config.badRequestStatusCode)
            .json(response("Unable to update the cart", {}, config.badRequestStatusCode));
    }
});
exports.getCartProducts = getCartProducts;
const getcartOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cart = yield cartOrder_1.default
            .aggregate()
            .match({ user_id: req.body.user_id })
            .unwind("$orderdetails")
            .lookup({
            from: "products",
            localField: "orderdetails.id",
            foreignField: "_id",
            as: "productdetails",
        })
            .group({
            _id: "$_id",
            orderdetails: { $push: "$orderdetails" },
            user_id: { $first: "$user_id" },
            total: { $first: "$total" },
            productdetails: { $push: "$productdetails" },
            createdAt: { $first: "$createdAt" }
        })
            .project({
            product: {
                $reduce: {
                    input: "$productdetails",
                    initialValue: [],
                    in: { $concatArrays: ["$$value", "$$this"] },
                },
            },
            orderdetails: 1,
            total: 1,
            createdAt: 1
        });
        cart.map((data) => {
            let orderDetails = data.orderdetails;
            let productDetails = data.product;
            console.log(productDetails, orderDetails);
            for (let i in orderDetails) {
                productDetails[i].quantity = orderDetails[i].quantity;
            }
            return {
                product: data.product,
                total: data.total,
            };
        });
        res
            .status(config.successStatusCode)
            .json(response("Cart updated", cart, config.successStatusCode));
    }
    catch (error) {
        console.error(error);
        res
            .status(config.badRequestStatusCode)
            .json(response("Unable to update the cart", {}, config.badRequestStatusCode));
    }
});
exports.getcartOrders = getcartOrders;
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let temp = req.body.product_id[0];
        console.log(temp);
        const findProduct = yield cart_1.default.findOne({ user_id: req.body.user_id });
        let test = findProduct.product.map((item, index) => {
            if (item._id.equals(temp)) {
                findProduct.product.remove(item);
            }
        });
        console.log(findProduct);
        const replaceProduct = yield cart_1.default.findOneAndUpdate({ user_id: req.body.user_id }, { product: findProduct.product });
        res
            .status(config.successStatusCode)
            .json(response("Product is removed from the cart", replaceProduct, config.successStatusCode));
    }
    catch (error) {
        console.error(error);
        res
            .status(config.badRequestStatusCode)
            .json(response("Unable to remove the peoduct from the cart", {}, config.badRequestStatusCode));
    }
});
exports.deleteProduct = deleteProduct;
const checkout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let body = req.body.body;
        let temp = [];
        yield body.orderdetails.map((element) => {
            temp.push({ id: element._id, quantity: element.quantity });
        });
        let orderproduct = new cartOrder_1.default({
            orderdetails: temp,
            user_id: req.body.user_id,
            total: req.body.total,
        });
        const cartProduct = yield orderproduct.save();
        res
            .status(200)
            .json(response("Product added to cart", cartProduct, config.successStatusCode));
    }
    catch (error) {
        console.error(error);
        res
            .status(config.badRequestStatusCode)
            .json(response("Unable to add  the product to cart", { error }, config.badRequestStatusCode));
    }
});
exports.checkout = checkout;
const clearCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.body.user_id);
        const deleteCart = yield cart_1.default.deleteMany({
            user_id: req.body.user_id,
        });
        res
            .status(config.successStatusCode)
            .json(response("Product is removed from the cart", deleteCart, config.successStatusCode));
    }
    catch (error) {
        console.error(error);
        res
            .status(config.badRequestStatusCode)
            .json(response("Unable to remove the product from the cart", {}, config.badRequestStatusCode));
    }
});
exports.clearCart = clearCart;
const makePayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.body);
        let token = req.body.token;
        let customer = stripe.customers
            .create({
            email: "agchetz@gmail.com",
            source: token.id
        })
            .then((customer) => {
            console.log(customer);
            return stripe.charges.create({
                amount: 1000,
                description: "Test Purchase of card payment",
                currency: "INR",
                customer: customer.id,
            });
        })
            .then((charge) => {
            console.log(charge, '***************');
            res.json({
                data: "success"
            });
        })
            .catch((err) => {
            console.log(err);
            res.json({
                data: "failure",
            });
        });
        return true;
    }
    catch (error) {
        return false;
    }
});
exports.makePayment = makePayment;
let response = (message, data, status) => {
    return { message, data, status };
};
