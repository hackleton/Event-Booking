import User from "../models/userModel";
const config = require("../config/config");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

export default class AuthService {
  async login(input: any) {
    try {
      const users: any = await User.findOne({ email: input.email });
      if (!users) {
        return { status: 200, msg: "user not exist", data: input };
      }
      if (!(await bcrypt.compare(input.password, users.password))) {
        return {
          status: 400,
          msg: "Invalid password",
          data: input,
        };
      }
      return {
        status: 200,
        msg: "Users returned successfully",
        data: this.createToken(users),
      };
    } catch (error) {
      console.error(error);
      return {
        message: "Unable to login",
        data: {},
        status: config.badRequestStatusCode,
      };
    }
  }
  createToken(user: any): any {
    const expiresIn = 60 * 60; // an hour
    const secret = "123456789";
    return {
      expiresIn,
      token: jwt.sign({ id: user._id, email: user.email }, secret, {
        expiresIn,
      }),
    };
  }
}
