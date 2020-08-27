const initialState = {
  userInfo: null,
  status: "idle",
};

export default function currentuserReducer(state = initialState, action) {
  console.log(action);
  switch (action.type) {
    case "LOGGING_IN": {
      return { ...state, status: "loading" };
    }
    case "USER_LOGGED_IN": {
      return { ...state, userInfo: action.data, status: "logged-in" };
    }
    // case "LOGGED_IN_USER_DETAILS": {
    //   return { ...state, userInfo: action.data, status: "logged-in-info" };
    // }

    case "USER_LOGGED_OUT": {
      return initialState;
    }
    case "USER_NOT_FOUND": {
      return { ...state, status: "idle" };
    }
    case "INVALID_PASSWORD": {
      return { ...state, status: "idle" };
    }
    default: {
      return state;
    }
  }
}

export const getCurrentUserInfo = (state) => {
  if (state.currentuser.userInfo) {
    return state.currentuser.userInfo;
  }
};
