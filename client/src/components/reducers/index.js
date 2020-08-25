import { combineReducers } from "redux";

import application from "./application.reducer";
import user from "./user.reducer";
import currentuser from "./currentuser.reducer";

export default combineReducers({
  application,
  user,
  currentuser,
});
