import express from "express";
import config from "./utils/config";
//import dal_mySQL from "./utils/dal_mySQL";   
import sqlInit from "./utils/init";  
import cors from "cors";
import loginRouter from "./routes/loginController";
import reportsRouter from "./routes/reportsController";
import mainRouter from "./routes/mainController";
import ErrorHandler from "./MiddleWare/route-not-found";
import path from "path";
import fileUpload from "express-fileupload";


//(4)
const server = express();           //creating a server using express
const currentPort = config.port;    //if we'd like to change something we only need to do it in config.ts

//(2) ---Add CREATE SCHEMA IF NOT EXISTS, create tables and data
sqlInit();

const corsConfig = {
    origin: ['http://localhost:3000'],
    exposedHeaders: "authorization"
}
server.use(cors(corsConfig));         
server.use(express.json());   
server.use(fileUpload({
    createParentPath: true,
    // limits: { fileSize: 50 * 1024 * 1024 },
}));
server.use("/login",loginRouter);      // (9)  connect our controller to server.ts; this will be the main path to which 
server.use("/reports",reportsRouter);
server.use("/main",mainRouter);
//enabling file uploads; create a parent directory for the file if it doesn't exist
// server.use(fileUpload({
//     createParentPath: true,
//     limits: { fileSize: 50 * 1024 * 1024 },
// }));

server.use("/images", express.static('media'));
//console.log(__dirname);
server.use("*", ErrorHandler);
//(4)
server.listen(currentPort, () => {
    console.log(`Server listening on http://localhost:${currentPort}`)
});