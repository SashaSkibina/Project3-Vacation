//(3)
//DAL -> Data Abstract Layer

import mysql from "mysql";
import config from "./config";

//establishing a connection pool
const connection = mysql.createPool ({
    host: config.mySQLHost,
    port: config.mySQLPort,
    user: config.mySQLUser,
    password: config.mySQLPassword,
    database: config.mySQLdb,
});

console.log ("we are connected to the DB");

const execute = (sql: string): Promise<any> => {
    return new Promise<any>((resolve, reject) => {
        //execute the sql on mysql server
        connection.query(sql, (err, res) => {
            if (err) {
                reject(err);
                console.log ("db query failed:");
                return;
            }
            resolve (res);
        })
    });
}

export default {execute}