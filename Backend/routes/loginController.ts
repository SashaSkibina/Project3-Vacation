//All the routed that connect the db and client
//using these routes data comes from frontend, then here we send it to functions in Logic and from there to the db
import express, {NextFunction, Request, Response, request} from "express";
import userLogic from "../logic/userLogic";
import { authentication } from "../MiddleWare/authentication";
import jwtHandler from "../utils/jwtHandler";

const loginRouter = express.Router();

loginRouter.get("/", async (request: Request, response: Response, next: NextFunction) => {
    response.status(200).json("loginRouter working")
})

//register user
loginRouter.post("/register", async (request: Request, response: Response, next: NextFunction) => {
    const body = request.body;
    try {
        const token = await userLogic.addUser(body);
        response.set("authorization", token);
        response.status(201).json(token);
    } catch (err) {
        console.log(err)
        response.status(400).json(err);
    }
})

//login user
loginRouter.post("/login", async (request: Request, response: Response, next: NextFunction) => {
    const body = request.body;
    try {
        const token = await userLogic.loginUser(body);
        //setting token in response header
        response.set('authorization',`Bearer ${token}`);
        response.status(200).json({ message: 'Success!' });
    } catch (err) {
        console.error(err)
        response.status(401).json({ message: 'Invalid username or password' });
    };
})

//authentication
loginRouter.post("/checkSession", authentication, async (request: Request, response: Response, next: NextFunction) =>{
    const authorization = await request.header("authorization")?.split(" ")[1] || "";
    
    console.log("/checksession req header",request.header("authorization"))
    //verifyToken returns a bool
    if (await jwtHandler.verifyToken(authorization)) {
        try {
            //try getting new token and set it in header
            response.set("authorization", "Bearer "+await userLogic.reLog(authorization));
            response.status(204).json();
        } catch(err) {
            console.log(err)
            next(err)
        }
    } else {
        response.status(400).json("Your session has expired, please log in again to continue")
    }
})

export default loginRouter