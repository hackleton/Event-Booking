"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenVerify = exports.checkJwt = void 0;
const jwt = __importStar(require("jsonwebtoken"));
const config = require("../config/config");
const checkJwt = (req, res, next) => {
    //Get the jwt token from the head
    let token = req.headers["authorization"];
    console.log("token -" + token);
    let jwtPayload;
    token = token.split(" ");
    token = token[1];
    //Try to validate the token and get data
    try {
        jwtPayload = jwt.verify(token, config.jwtSecret, (err, payload) => {
            if (err) {
                res
                    .status(config.unAuthStatusCode)
                    .json({ message: "please  login", data: {}, status: 401 });
            }
            else {
                req.body["user_id"] = payload.id;
            }
        });
        res.locals.jwtPayload = jwtPayload;
    }
    catch (error) {
        res
            .status(config.unAuthStatusCode)
            .json({ message: "please login", data: {}, status: 401 });
        return;
    }
    next();
};
exports.checkJwt = checkJwt;
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
let tokenVerify = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = request.params.token;
        let payload = yield jwt.verify(token, config.jwtSecret);
        if (!payload) {
            return false;
        }
        else {
            let user_id = payload.id;
            console.log(user_id);
            return user_id;
        }
    }
    catch (error) {
        console.log(error);
        return false;
    }
});
exports.tokenVerify = tokenVerify;
