import { UserRole } from "../redux/userAuth";

export default interface Like {
    id?: number;
    v_id: number;
    user_id: number;
    user_name: string;
    user_role: UserRole;
}