import { Iproduct } from "./../types/product";
import { model, Schema } from "mongoose";


export const productSchema: Schema = new Schema(
  {
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
  },
  { timestamps: true }
);

export default model<Iproduct>("Product", productSchema);
