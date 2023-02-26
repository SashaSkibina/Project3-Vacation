//All the routed that connect the db and client
//using these routes data comes from frontend, then here we send it to functions in Logic and from there to the db
import express, {NextFunction, Request, Response} from "express";

const reportsRouter = express.Router();

reportsRouter.get("/", async (request: Request, response: Response, next: NextFunction) => {
    response.status(200).json("reportsRouter working")
})
export default reportsRouter