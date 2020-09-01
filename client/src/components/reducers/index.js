import { combineReducers } from "redux";

import application from "./application.reducer";
import newuser from "./newuser.reducer";
import currentuser from "./currentuser.reducer";
import users from "./users.reducer";
import profile from "./profile.reducer";
import messages from "./messages.reducer";
import filter from "./filter.reducer";
import chat from "./chat.reducer";
import projects from "./projects.reducer";

export default combineReducers({
  application,
  newuser,
  currentuser,
  users,
  profile,
  messages,
  filter,
  chat,
  projects,
});
