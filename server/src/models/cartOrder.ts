import { IcartOrder } from "./../types/cartOrder";
import * as mongoose from 'mongoose';
import { model } from "mongoose";

const cartOrderSchema = new mongoose.Schema(
  {
    orderdetails:[
      {
      id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product'
      },
      quantity: {
        type: Number,
        required: true
      }  
    },
  ],
    user_id: {
      type: String,
      required: true
    },
    total: {
      type: Number,
      required: true
    }
  },
  { timestamps: true },
);

export default model<IcartOrder>("orderCart", cartOrderSchema);
