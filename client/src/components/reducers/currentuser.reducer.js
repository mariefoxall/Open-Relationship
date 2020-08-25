const initialState = {
  userInfo: null,
};

export default function currentuserReducer(state = initialState, action) {
  switch (action.type) {
    case "APP_REFRESH": {
      return { ...state };
    }
    case "USER_LOGGED_IN": {
      return { ...state, userInfo: action.data };
    }
    case "USER_LOGGED_OUT": {
      return initialState;
    }
    default: {
      return state;
    }
  }
}

export const getCurrentUser = (state) => {
  if (state.userInfo) {
    return state.currentuser.userInfo;
  }
};
