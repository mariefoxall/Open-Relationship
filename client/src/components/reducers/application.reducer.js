const initialState = {
  applications: null,
  status: "loading",
};

export default function applicationReducer(state = initialState, action) {
  switch (action.type) {
    case "RECEIVE_APPLICATIONS": {
      return { ...state, applications: action.applications, status: "idle" };
    }
    default: {
      return state;
    }
  }
}

export const getApplications = (state) => {
  return state.application.applications;
};

export const numApplications = (state) => {
  if (state.application.applications) {
    return state.application.applications.length;
  } else {
    return 0;
  }
};

console.log(getApplications);
