import { Document } from "mongoose";

export interface IToken extends Document {
  [x: string]: any;
  email: string;
  token: string;
}