//All the routed that connect the db and client
//using these routes data comes from frontend, then here we send it to functions in Logic and from there to the db
import express, {NextFunction, Request, Response} from "express";
import userLogic from "../logic/userLogic";
import vacationLogic from "../logic/vacationLogic";

const mainRouter = express.Router();

mainRouter.get("/", async (request: Request, response: Response, next: NextFunction) => {
    response.status(200).json("mainRouter working")
});

//follow(like) vacation
mainRouter.post("/like", async (request: Request, response: Response, next: NextFunction) => {
    const body = request.body;
    response.status(201).json(await userLogic.addLike(body));
});

//unfollow vacation
mainRouter.delete("/like/:user_id/:v_id", async (request: Request, response: Response, next: NextFunction) => {
    //const id = +request.params.id;
    const user_id = +request.params.user_id;
    const v_id = +request.params.v_id;
    response.status(204).json(await userLogic.deleteLike(user_id,v_id));
});

//add vacation
mainRouter.post("/vacation", async (request: Request, response: Response, next: NextFunction) => {
    const body = request.body;
    if (request.files) {
        body.actual_image = request.files.actual_image;
    }
    //delete body.image;
    //response.set("Authorization", await userLogic.reLog(request.header("Authorization").split(" ")[1]));
    response.status(201).json(await vacationLogic.addVacation(body));
})

//edit vacation
mainRouter.put("/vacation", async (request: Request, response: Response, next:NextFunction) => {
    const body = request.body;
    if (request.files) {
        body.actual_image = request.files.actual_image;
    }
    //response.set("Authorization", await userLogic.reLog(request.header("Authorization").split(" ")[1]));
    response.status(201).json(await vacationLogic.editVacation(body));
})

//delete vacation
mainRouter.delete("/vacation/:id", async (request: Request, response: Response, next: NextFunction) => {
    const id = +request.params.id;
    console.log(id)
    response.status(204).json(await vacationLogic.deleteVacation(id));
})

//show all
mainRouter.get("/vacation/:id", async (request: Request, response: Response, next: NextFunction) => {
    const id = +request.params.id;
    response.status(200).json(await vacationLogic.getVacationCards(id));          //wait for our function to return something
})

//show followed by user id
mainRouter.get("/vacation/:id", async (request: Request, response: Response, next: NextFunction) => {
    const id = +request.params.id;
    try {
        response.status(200).json(await vacationLogic.getFavorites(id));          //wait for our function to return something
    } catch (err) {
        console.error(err)
        response.status(204).json(err)
    }
})



export default mainRouter