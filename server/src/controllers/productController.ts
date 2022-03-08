import { Response, Request } from "express";
import product from "../models/productModel";
import { cartType } from "../types/cart";
import Cart from "../models/cart";
import { IcartOrder } from "../types/cartOrder";
import cartOrder from "../models/cartOrder";
const config = require("../config/config");
const stripe = require("stripe")("sk_test_51KRvc0SIrrXAtd13rbytR4V5GpDhUnKTmMoXY2eTm9Z9i9Thd8CoosUumYJejQb9mXzt1sAkPDky4NKW0OdCZUmR00LhOLDcHg");

const getProduct = async (req: Request, res: Response): Promise<void> => {
  product.find({}, (err: Response, data: Response) => {
    if (err) {
      res.status(500).json({ message: "internal server problem" });
    } else {
      res.status(200).json(data);
    }
  });
};

const addToCart = async (req: Request, res: Response): Promise<void> => {
  try {
    let isExistingCart = await Cart.find({ user_id: req.body.user_id });
    if (isExistingCart.length) {
      let temp = isExistingCart[0].product;
      let isAlreadyExistedProduct = false;
      let existingProducts = temp.map((element: any) => {
        if (element.product.equals(req.body.id)) {
          isAlreadyExistedProduct = true;
          element.quantity++;
        }
        return element;
      });
      let updatedProducts: any = [...existingProducts];
      if (isAlreadyExistedProduct === false) {
        updatedProducts.push({ product: req.body.id, quantity: 1 });
      }

      await Cart.findOneAndUpdate(
        { _id: isExistingCart[0]._id },
        { product: updatedProducts }
      );
    } else {
      const product = new Cart({
        user_id: req.body.user_id,
        product: [{ product: req.body.id, quantity: 1 }],
      });
      const cartProduct = await product.save();
      res
        .status(200)
        .json(
          response(
            "Product added to cart",
            cartProduct,
            config.successStatusCode
          )
        );
    }
  } catch (error) {
    console.error(error);
    res
      .status(config.badRequestStatusCode)
      .json(
        response(
          "Unable to add  the product to cart",
          { error },
          config.badRequestStatusCode
        )
      );
  }
};

const updateCart = async (req: Request, res: Response): Promise<void> => {
  try {
    let existedProduct: cartType | any = await Cart.find({
      user_id: req.body.user_id,
    });
    console.log(existedProduct)
    let temp = existedProduct[0].product.flat();
    let demo = temp.map((element: any) => {
      if (element.product.equals(req.body._id)) {
        element.quantity = req.body.quantity;
      }
      return element;
    });
    let updated = await Cart.findOneAndUpdate(
      { user_id: req.body.user_id },
      { product: demo }
    );
    res
      .status(config.successStatusCode)
      .json(response("Cart updated", updated, config.successStatusCode));
  } catch (error) {
    console.error(error);
    res
      .status(config.badRequestStatusCode)
      .json(
        response("Unable to update  the cart", {}, config.badRequestStatusCode)
      );
  }
};

const getCartProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const getProduct: any | null = await Cart.aggregate()
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
    getProduct.map((data: any) => {
      let orderDetails = data.quantity;
      let productDetails = data.productdetails;
      for (let i in orderDetails) {
        productDetails[i].quantity = orderDetails[i].quantity;
        console.log(productDetails[i].quantity = orderDetails[i].quantity, '********')
      }
      return { product: data.productdetails };
    });
    res
      .status(config.successStatusCode)
      .json(response("Cart updated", getProduct, config.successStatusCode));
  } catch (error) {
    console.error(error);
    res
      .status(config.badRequestStatusCode)
      .json(
        response("Unable to update the cart", {}, config.badRequestStatusCode)
      );
  }
};

const getcartOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const cart: IcartOrder[] = await cartOrder
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
        createdAt: {$first: "$createdAt"}
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
    cart.map((data: any) => {
      let orderDetails = data.orderdetails;
      let productDetails = data.product;
      console.log(productDetails ,orderDetails)
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
  } catch (error) {
    console.error(error);
    res
      .status(config.badRequestStatusCode)
      .json(
        response("Unable to update the cart", {}, config.badRequestStatusCode)
      );
  }
};

const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    let temp = req.body.product_id[0]
    console.log(temp);
    const findProduct:any = await Cart.findOne({user_id: req.body.user_id})
    let test = findProduct.product.map((item:any, index:number)=>{
       if(item._id.equals(temp)){
        findProduct.product.remove(item)
      }
    })
    console.log(findProduct)
    const replaceProduct = await Cart.findOneAndUpdate({user_id: req.body.user_id}, {product:findProduct.product})
    res
      .status(config.successStatusCode)
      .json(
        response(
          "Product is removed from the cart",
          replaceProduct,
          config.successStatusCode
        )
      );
  } catch (error) {
    console.error(error);
    res
      .status(config.badRequestStatusCode)
      .json(
        response(
          "Unable to remove the peoduct from the cart",
          {},
          config.badRequestStatusCode
        )
      );
  }
};

const checkout = async (req: Request, res: Response): Promise<void> => {
  try {
    let body = req.body.body;
    let temp: Array<object> = [];
    await body.orderdetails.map((element: any) => {
      temp.push({ id: element._id, quantity: element.quantity });
    });
    let orderproduct: IcartOrder = new cartOrder({
      orderdetails: temp,
      user_id: req.body.user_id,
      total: req.body.total,
    });
    const cartProduct: IcartOrder = await orderproduct.save();
    res
      .status(200)
      .json(
        response("Product added to cart", cartProduct, config.successStatusCode)
      );
  } catch (error) {
    console.error(error);
    res
      .status(config.badRequestStatusCode)
      .json(
        response(
          "Unable to add  the product to cart",
          { error },
          config.badRequestStatusCode
        )
      );
  }
};

const clearCart = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log(req.body.user_id);
    const deleteCart = await Cart.deleteMany({
      user_id: req.body.user_id,
    });
    res
      .status(config.successStatusCode)
      .json(
        response(
          "Product is removed from the cart",
          deleteCart,
          config.successStatusCode
        )
      );
  } catch (error) {
    console.error(error);
    res
      .status(config.badRequestStatusCode)
      .json(
        response(
          "Unable to remove the product from the cart",
          {},
          config.badRequestStatusCode
        )
      );
  }
};

const makePayment = async (req: Request, res: Response): Promise<any> => {
  try {
    console.log(req.body);
    let token = req.body.token
    let customer = stripe.customers
    .create({
      email: "agchetz@gmail.com",
      source: token.id
    })
    .then((customer:any) => {
      console.log(customer);
      return stripe.charges.create({
        amount: 1000,
        description: "Test Purchase of card payment",
        currency: "INR",
        customer: customer.id,
      });
    })
    .then((charge:any) => {
      console.log(charge, '***************');
        res.json({
          data:"success"
      })
    })
    .catch((err:any) => {
        console.log(err)
        res.json({
          data: "failure",
        });
    });
  return true;
} catch (error) {
  return false;
}
}

let response = (message: string, data: any, status: number) => {
  return { message, data, status };
};

export {
  getProduct,
  addToCart,
  updateCart,
  getCartProducts,
  deleteProduct,
  checkout,
  getcartOrders,
  clearCart,
  makePayment
};
