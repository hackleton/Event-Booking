import { Document } from "mongoose";

export interface Iproduct extends Document {
  image: String;
  product: String;
  department: String;
  price: number;
  quantity: number
  description: string
}
