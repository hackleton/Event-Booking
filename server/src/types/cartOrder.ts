import { Document } from "mongoose";

export interface IcartOrder extends Document {
    orderdetails:[
      {
      id:{
        type: Object,
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
}
