// ------------------------ not in use ------------------------ //

import Vacations from "../models/vacation";

export enum vacationActionType {"delete", "edit", "add", "addLike", "removeLike"}

export interface vacationAction {
    type: vacationActionType;
    payload: any;
}

//action creators:
export function deleteVacation(v_id: number): vacationAction {
    return {type: vacationActionType.delete, payload: v_id}
}

export function editVacation(vacation: Vacations): vacationAction {
    return {type: vacationActionType.edit, payload: vacation}
}

export function addVacation(vacation: Vacations): vacationAction {
    return {type: vacationActionType.add, payload: vacation}
}

export function addLike(v_id: number): vacationAction {
    return {type: vacationActionType.addLike, payload: v_id}
}
export function removeLike(v_id: number): vacationAction {
    return {type: vacationActionType.removeLike, payload: v_id}
}

// export function vacationReducer(currentState:Vacations[], action:vacationAction):Vacations {
//     let newVacationState = {...currentState};
//     switch (action.type) {
//         case vacationActionType.delete: {
//             newVacationState = newVacationState.filter(vacation => vacation.id!== action.payload);
//             break;
//         }
//         case vacationActionType.edit: {
//             const index = newVacationState.findIndex(action.payload.v_id);
//             newVacationState[index].v_id=action.payload.v_id;
//             newVacationState[index].description=action.payload.description;
//             newVacationState[index].destination=action.payload.destination;
//             newVacationState[index].image=action.payload.image;
//             newVacationState[index].start_date=action.payload.start_date;
//             newVacationState[index].end_date=action.payload.end_date;
//             newVacationState[index].price=action.payload.price;
//             newVacationState[index].likes=action.payload.likes;
//             newVacationState[index].is_liked=action.payload.is_liked;
//             newVacationState[index].id=action.payload.id;
//             newVacationState[index].user_id=action.payload.user_id;
//             break;
//         }
//         case vacationActionType.add: {
//             newVacationState.push(action.payload);
//             break;
//         }
//         case vacationActionType.addLike: {
//             const index = newVacationState.findIndex(action.payload);
//             newVacationState[index].is_liked=true;
//             break;
//         }
//         case vacationActionType.removeLike: {
//             const index = newVacationState.findIndex(action.payload);
//             newVacationState[index].is_liked=false;
//             break;
//         }
//         default :
//     }
//     return newVacationState;
// }