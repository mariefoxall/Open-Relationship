const initialState = {
  category: "All",
  reason: "All",
};

export default function filterReducer(state = initialState, action) {
  switch (action.type) {
    case "UPDATE_CATEGORY": {
      return { ...state, category: action.category };
    }
    case "UPDATE_REASON": {
      return { ...state, reason: action.reason };
    }
    case "RESET_FILTERS": {
      return initialState;
    }
    default: {
      return state;
    }
  }
}

export const getFilterCategory = (state) => {
  return state.filter.category;
};

export const getFilterReason = (state) => {
  return state.filter.reason;
};
