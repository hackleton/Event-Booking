import { Document } from "mongoose";

export interface IUser extends Document {
  [x: string]: any;
  userName: string;
  phoneNumber: Number;
  email: string;
  password: string;
  role: string;
}
