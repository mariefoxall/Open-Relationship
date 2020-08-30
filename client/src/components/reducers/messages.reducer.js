const initialState = {
  sentMessages: null,
  receivedMessages: null,
  status: "idle",
};

export default function messagesReducer(state = initialState, action) {
  console.log(action);
  switch (action.type) {
    case "REQUEST_MESSAGES": {
      return { ...state, status: "messages-requested" };
    }
    case "RECEIVE_RECEIVED_MESSAGES": {
      return {
        ...state,
        receivedMessages: action.data,
        status: "messages-requested",
      };
    }
    case "RECEIVE_SENT_MESSAGES": {
      return {
        ...state,
        sentMessages: action.data,
        status: "messages-received",
      };
    }

    default: {
      return state;
    }
  }
}

export const getSentMessages = (state) => {
  return state.messages.sentMessages;
};

export const getReceivedMessages = (state) => {
  return state.messages.receivedMessages;
};
