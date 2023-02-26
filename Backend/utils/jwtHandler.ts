import jwt from 'jsonwebtoken';
import { JWTtoken } from '../models/userModel';

const secretKey = "JWTBackendSecret";

const createToken = (user: JWTtoken): string => {
    const payload = { user };
    const tokenString = jwt.sign(payload, secretKey, { expiresIn: "30m" });
    return tokenString;
}

const verifyToken = async (authHeader: string): Promise<boolean> => {
    return new Promise<boolean>((resolve) => {
        if (!authHeader) {
            resolve(false);
            return;
        }
        console.log("Checking token")
        const token = authHeader

        if (!token) {
            resolve(false);
            return;
        }
        jwt.verify(token, secretKey, (err, payload)=>{
            if (err) {
                console.log(err);
                resolve(false);
                return;
            }
            resolve(true);
        })
    })
}

const decodeToken = (authHeader:string):JWTtoken => {
    console.log(authHeader);
    const token = authHeader;
    const payload = (jwt.decode(token) as any).user
    console.log(payload);
    return payload as JWTtoken;
}

export default {
    createToken,
    verifyToken,
    decodeToken
}