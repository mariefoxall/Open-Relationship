const initialState = {
  users: null,
  status: "loading",
};

export default function usersReducer(state = initialState, action) {
  switch (action.type) {
    case "RECEIVE_USERS": {
      return { ...state, users: action.data, status: "users-loaded" };
    }
    default: {
      return state;
    }
  }
}

export const getUsers = (state) => {
  return state.users.users;
};
