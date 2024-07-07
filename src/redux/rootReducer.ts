import { combineReducers } from "redux";
import eventReducer from "./eventReducer";

const rootReducer = combineReducers({
  event: eventReducer,
});

export default rootReducer;
