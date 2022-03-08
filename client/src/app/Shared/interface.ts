export interface newUserModel {
  userName: String;
  phoneNumber: Number;
  email: String;
  password: String;
}

export interface loginModel {
  email: String;
  password: String;
}

export interface orderModel {
  id: number;
  product: String;
  department: String;
  quantity: Number;
  price: Number;
  image: String;
  description: String;
}

export interface orderDetailsModel {
  id: Number;
  product: String;
  department: String;
  quantity: Number;
  price: Number;
  image: String;
  description: String;
  _id: Number;
}

export interface loginDetails {
  data: [{ expiresIn: number; token: string }, string, string];
  message: string;
  status: number;
}

export interface orderTestStatus {
  _id: string;
  total: number;
}
[];

export interface userModel {
  email: string;
  role: string[];
}

export interface productModel {
  product: String;
  department: String;
  quantity: number;
  price: number;
  image: String;
  _id: String;
  id: String;
  description:String;

}

export interface cartOrder {
  product: String;
  quantity: Number;
  _id: String;
}[]
