const initialState = {
  projects: null,
  status: "loading",
};

export default function projectsReducer(state = initialState, action) {
  switch (action.type) {
    case "RECEIVE_PROJECTS": {
      return { ...state, projects: action.data, status: "projects-loaded" };
    }
    case "ADD_PROJECT": {
      return {
        ...state,
        projects: [...state.projects, action.data],
      };
    }
    default: {
      return state;
    }
  }
}

export const getProjects = (state) => {
  return state.projects.projects;
};
