import { Response, Request } from "express";
import { product } from "../types/productModel";
import Product from "../models/productModel";
const config = require("../config/config");


const getOrder = async (req: Request, res: Response): Promise<void> => {
  Product.find({}, (err: Response, data: Response) => {
    if (err) {
      console.log(err);
      res.status(500).json({ message: "internal server problem" });
    } else {
      console.log(data);
      res.json(data);
    }
  });
};

const getOrderStatus = async (req: Request, res: Response): Promise<void> => {
  let statusData: Array<object> = await Product.aggregate()
    .match({ })
    .group({ _id: "$department", total: { $sum: 1 } })
    .project({ _id: 1, total: 1 });
  res.send(statusData);
  console.log(statusData)
};

const createOrder = async (req: Request, res: Response): Promise<void> => {
  let user = res.locals.jwtPayload;
  try {
    const order: product = new Product(req.body);
    console.log(req.body);
    const newOrder: product = await order.save();
    res
      .status(201)
      .json(response("order added", newOrder, config.successStatusCode));
  } catch (error) {
    console.error(error);
    res
      .status(config.badRequestStatusCode)
      .json(
        response("Unable to add  the order", {}, config.badRequestStatusCode)
      );
  }
};

const updateOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const newOrder = await Product.findOneAndUpdate(
      { _id: req.body.id },
      req.body
    );
    res
      .status(config.successStatusCode)
      .json(response("Order updated", newOrder, config.successStatusCode));
  } catch (error) {
    console.error(error);
    res
      .status(config.badRequestStatusCode)
      .json(
        response("Unable to update  the order", {}, config.badRequestStatusCode)
      );
  }
};

const deleteOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const deleteOrder = await Product.deleteOne({ _id: req.body.id });
    res
      .status(config.successStatusCode)
      .json(response("Order deleted", deleteOrder, config.successStatusCode));
  } catch (error) {
    console.error(error);
    res
      .status(config.badRequestStatusCode)
      .json(
        response("Unable to delete  the order", {}, config.badRequestStatusCode)
      );
  }
};

const orderId = async (req: Request, res: Response) => {
  const id = req.params.id;
  Product.find({ _id: id }, (err: Response, data: Response) => {
    res.send(data);
  });
};

let response = (message: string, data: any, status: number) => {
  return { message, data, status };
};

export {
  getOrder,
  createOrder,
  updateOrder,
  deleteOrder,
  orderId,
  getOrderStatus,
};
