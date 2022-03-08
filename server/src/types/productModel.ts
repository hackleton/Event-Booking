import { Document } from "mongoose";

export interface product extends Document {
  product: String;
  department: String;
  quantity: number;
  price: number;
  image: String;
  description: string
}

