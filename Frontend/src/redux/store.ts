import { userReducer } from "./userAuth";
import { configureStore, combineReducers } from "@reduxjs/toolkit";

//combine reducers to root object using key-value pairs(each reducer handles a state)
const rootReducer = combineReducers({ authState: userReducer });
const store = configureStore({ reducer: rootReducer});

export default store;