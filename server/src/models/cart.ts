import { cartType } from "./../types/cart";
import * as mongoose from "mongoose";

export const cartSchema = new mongoose.Schema(
  {
    user_id: {
      type: String,
      required: true,
    },
    product: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "product",
        },
        quantity: {
          type: Number,
          required: true
        }
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model<cartType>("Cart", cartSchema);
