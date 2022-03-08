import { product } from "../types/productModel";
import { model, Schema } from "mongoose";

export const productSchema: Schema = new Schema(
  {
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
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    }
  },
  { timestamps: true }
);

export default model<product>("Product", productSchema);
