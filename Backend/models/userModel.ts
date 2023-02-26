export enum UserRole { "admin", "user", "guest" }

export default class User {
    user_id: number;
    f_name: string;
    l_name: string;
    user_name: string;
    user_pass: string;
    user_role: UserRole;

    constructor (user_id: number, f_name: string, l_name: string, user_name: string, user_pass: string, user_role: UserRole) {
        this.user_id = user_id;
        this.f_name = f_name;
        this.l_name = l_name;
        this.user_name = user_name;
        this.user_pass = user_pass;
        this.user_role = user_role;
    }
}

export class JWTtoken {
    user_id: number;
    user_name: string;
    //user_token: string;
    user_role: UserRole;

    constructor (user_id: number, user_name: string, user_role: UserRole) {
        this.user_id = user_id;
        this.user_name = user_name;
        //this.user_token = user_token;
        this.user_role = user_role;
    }
}