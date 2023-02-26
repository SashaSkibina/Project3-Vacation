//import { client_error } from './../modal/client_error'; --> not my import - it's a copypaste
import { Request, Response, NextFunction } from "express";
//import {appendFileSync} from "fs";         --> not my import - it's a copypaste
//import logger from '../util/errorsLogger'; --> not my import - it's a copypaste
import jwtHandler from '../utils/jwtHandler';

const authentication = async ( request: Request, response: Response, next:NextFunction)=>{
    //save token from header in const
    const authorization = request.header("authorization");
    //split token from bearer
try{
    const isValid = await jwtHandler.verifyToken(authorization?.split(" ")[1] || "");
    isValid ? next() : next(new Error("Your session has expired, please log in again to continue"));
}catch(err){
    console.log(err);

    //logger.error(err.message)
}
}

export { 
    authentication
}