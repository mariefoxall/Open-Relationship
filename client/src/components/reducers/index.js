import { combineReducers } from "redux";

import application from "./application.reducer";
import user from "./user.reducer";

export default combineReducers({
  application,
  user,
});
