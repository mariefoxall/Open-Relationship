const initialState = {
  user: null,
  status: "idle",
};

export default function newuserReducer(state = initialState, action) {
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
    case "USERNAME_ALREADY_EXISTS": {
      return { ...state, status: "username-already-exists" };
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
  if (state.newuser) {
    return state.newuser.user;
  } else {
    return null;
  }
};
