const initialState = {
  user: null,
  status: "idle",
};

export default function userReducer(state = initialState, action) {
  console.log(action);
  switch (action.type) {
    case "AUTHENTICATE_NEW_USER": {
      return { ...state, user: action.application, status: "signing-up" };
    }
    case "SIGNUP_CODE_NOT_FOUND": {
      return { ...state, status: "authentication-failed" };
    }
    case "NEW_USER_INFO_CONFIRMED": {
      return { ...state, user: action.application, status: "user-confirmed" };
    }
    case "USER_ALREADY_EXISTS": {
      return { ...state, status: "user-already-exists" };
    }
    case "SUCCESSFULLY_CREATED_NEW_USER": {
      return { ...state, user: null, status: "user-created" };
    }
    default: {
      return state;
    }
  }
}

export const getNewUserDetails = (state) => {
  if (state.user) {
    return state.user.user;
  } else {
    return null;
  }
};
