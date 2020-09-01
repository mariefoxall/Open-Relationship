const initialState = {
  status: "idle",
};

export default function chatReducer(state = initialState, action) {
  switch (action.type) {
    case "SEND_CHAT": {
      return { ...state, status: "send-chat" };
    }
    case "RESET_CHAT": {
      return initialState;
    }
    default: {
      return state;
    }
  }
}
