export enum UserRole {"admin","user", "guest"}

export class userState {
    user_id:number = 0; 
    user_name: string = "";
    user_role: UserRole = UserRole.guest;
    user_token : string = "";
}

export enum authActionType {"logIn", "logOut", "updateToken"}

export interface authenticAction{
    type : authActionType,
    payload : any;//token/userobject
}
//action creator
export function logInUser(user:userState):authenticAction {
    return {type: authActionType.logIn, payload: user}
}
//action creator
export function logOut():authenticAction {
    localStorage.removeItem("userToken")
    return {type: authActionType.logOut, payload: null}
}
//action creator
export function updateToken(token:string):authenticAction {
    return {type: authActionType.updateToken, payload: token}
}
//the only place where we change the state is the reducer (dispatch method calls it)
export function userReducer(currentState:userState=new userState(), action:authenticAction):userState {
    let newUserState = {...currentState}
    switch (action.type) {
        case authActionType.logIn : {
            console.log(newUserState);
            newUserState.user_name= action.payload.user_name;
            newUserState.user_role= action.payload.user_role;
            newUserState.user_id= action.payload.user_id;
            newUserState.user_token= action.payload.user_token;
            console.log(newUserState);
            console.log(action.payload);
            
            localStorage.setItem("userToken",action.payload.user_token);
            break;
        }
        case authActionType.logOut : {
            newUserState.user_name= "guest";
            newUserState.user_role= UserRole.guest;
            newUserState.user_id= 0;
            newUserState.user_token= "";
            localStorage.removeItem("user_token");
            break;
        }
        case authActionType.updateToken : {
            newUserState.user_token= action.payload.user_token;
            localStorage.set("userToken",action.payload.user_token);

        }
    }
    return newUserState
}
