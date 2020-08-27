const initialState = {
  profile: null,
  status: "loading",
};

export default function profileReducer(state = initialState, action) {
  switch (action.type) {
    case "REQUEST_PROFILE": {
      return { ...state, status: "profile-requested" };
    }
    case "RECEIVE_PROFILE": {
      return { ...state, profile: action.data, status: "profile-received" };
    }
    default: {
      return state;
    }
  }
}

export const getUser = (state) => {
  return state.profile.profile;
};
