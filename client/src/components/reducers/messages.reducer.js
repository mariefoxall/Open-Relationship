const initialState = {
  sentMessages: null,
  receivedMessages: null,
  allMessages: [],
  status: "idle",
};

export default function messagesReducer(state = initialState, action) {
  console.log(action);
  switch (action.type) {
    case "REQUEST_MESSAGES": {
      return { ...state, status: "messages-requested" };
    }
    case "RECEIVE_ALL_MESSAGES": {
      return {
        ...state,
        allMessages: action.data,
        status: "messages-received",
      };
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
    case "ADD_MESSAGE": {
      return {
        ...state,
        allMessages: [...state.allMessages, action.data],
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

export const getAllMessages = (state) => {
  return state.messages.allMessages;
};
