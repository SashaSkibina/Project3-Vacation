import { UserRole } from "./userModel";

export default class Like {
    id: number;
    v_id: number;
    user_id: number;
    user_name: string;
    user_role: UserRole;
}