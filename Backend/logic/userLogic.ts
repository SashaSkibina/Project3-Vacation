//(6)
import dal from "../utils/dal_mySQL";  
import { OkPacket } from "mysql";
import User, { JWTtoken, UserRole } from "../models/userModel";
import Like from "../models/likesModel";
import jwtHandler from "../utils/jwtHandler";


const checkUserName = async (userName: string): Promise<User[]> => {
    const sql = `SELECT user_name FROM users WHERE user_name = '${userName}'`;
    const response: User[] = await dal.execute(sql);
    console.log(response);
    if (response.length !== 0) {
        throw new Error("Username already exists");
    }
    return response;
}
//create User - POST (for user?)
const addUser = async (user: User): Promise<any> => {
    try {
        const userName = checkUserName (user.user_name);
        console.log ((await userName).length);
        if (!(await userName).length) {
            let sql: string;
            if (user.user_name === "admin" && user.user_pass === "admin") {
                sql = `
                    INSERT INTO users VALUES 
                    (DEFAULT,
                    '${user.f_name}',
                    '${user.l_name}',
                    '${user.user_name}', 
                    '${user.user_pass}', 
                    '0'
                    )`;
                user.user_role = UserRole.admin;
            } else {
                sql = `
                    INSERT INTO users VALUES 
                    (DEFAULT,
                    '${user.f_name}',
                    '${user.l_name}',
                    '${user.user_name}', 
                    '${user.user_pass}', 
                    DEFAULT
                    )`;
                user.user_role = UserRole.user;
            }
            const response:OkPacket = await dal.execute(sql);
            user.user_id = response.insertId;
            console.log(user);
            const JWTUser = new JWTtoken(user.user_id,user.user_name,user.user_role)                 
            return jwtHandler.createToken(JWTUser);
        }} catch (err) {
        throw new Error("Username already exists");
    }
}

//authorize user/admin
const loginUser = async (body: any): Promise<string> => {
    const sql = `
        SELECT user_id, user_name, user_role FROM users WHERE user_name = '${body.user_name}' AND user_pass = '${body.user_pass}'
        `;
    const user: User[] = await dal.execute(sql);
    if (user.length === 0) {
        throw new Error('Username or Password are incorrect!');
    } else {
        const JWTUser = new JWTtoken (user[0].user_id,user[0].user_name,user[0].user_role);
        return await jwtHandler.createToken(JWTUser);
    }
}

////////////////////////////////
//add Like - POST (for user)                ||| ADD FIELDS TO LIKE DB TABLE!!! |||
//                                          ||| or mabe i can create a view of likes+users but then i nees to send a second sql query:( 
const addLike = async (like: Like): Promise<string> => {
    const sql = `
        INSERT INTO vacations_users VALUES
        (DEFAULT,
        '${like.user_id}',
        '${like.v_id}'
        )`;
    const response:OkPacket = await dal.execute(sql);
    like.id = response.insertId;
    //return like;
    const JWTUser = new JWTtoken (like.user_id, like.user_name, like.user_role);
    return await jwtHandler.createToken(JWTUser)
}

//delete Like - DELETE (for user) //no need for token on delete?
const deleteLike = async (user_id: number, v_id: number): Promise<void>=> {
    console.log("before delete like query")
    const sql = `
        DELETE FROM vacations_users WHERE user_id = ${user_id} AND v_id = ${v_id}`;
    const response = await dal.execute(sql);
    return response;
}

const reLog = async(header:string):Promise<string>=>{
    console.log("relog gets header",header);
    const payload: JWTtoken = (jwtHandler.decodeToken(header));
    console.log("relog decoded token",payload);
    const JWTUser = new JWTtoken (payload.user_id,payload.user_name,payload.user_role);
    const newToken = jwtHandler.createToken(JWTUser);
    console.log(newToken);
    return newToken;
}

export default{
    addUser,
    loginUser,
    reLog,
    addLike,
    deleteLike
}