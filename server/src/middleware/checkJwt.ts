import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
const config = require("../config/config");

export const checkJwt = (req: any, res: Response, next: NextFunction) => {
  //Get the jwt token from the head
  let token = <any>req.headers["authorization"];
  console.log("token -" + token);
  let jwtPayload;
  token = token.split(" ");
  token = token[1];

  //Try to validate the token and get data
  try {
    jwtPayload = <any>jwt.verify(
      token,
      config.jwtSecret,
      (err: any, payload: any) => {
        if (err) {
          res
            .status(config.unAuthStatusCode)
            .json({ message: "please  login", data: {}, status: 401 });
        } else {
          req.body["user_id"] = payload.id;
        }
      }
    );
    res.locals.jwtPayload = jwtPayload;
  } catch (error) {
    res
      .status(config.unAuthStatusCode)
      .json({ message: "please login", data: {}, status: 401 });
    return;
  }

  next();
};

// export let verifyToken = (request: Request, response: Response) => {
//   const token = request.params.token
//   jwt.verify(token, config.jwtSecret, (error: any, payload: any) => {
//   if(error){
//   response.status(config.unAuthStatusCode).json(" Unauthorized User")
//   return false
//   }else{
//     let user_id = payload.id
//     return user_id
//   }
//    return 
//   })
//   }

  export let tokenVerify = async (request: Request, response: Response) => {
   try{ const token = request.params.token
    let payload:any = await jwt.verify(token, config.jwtSecret)
    if(!payload){
      return false
    }
  else{
      let user_id = payload.id
      console.log(user_id)
      return user_id
    }
    }catch(error){
      console.log(error)
      return false
    }
    }

