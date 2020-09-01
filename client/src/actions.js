export const receiveOutstandingApplications = (applications) => ({
  type: "RECEIVE_APPLICATIONS",
  applications,
});

export const authenticateNewUser = (application) => ({
  type: "AUTHENTICATE_NEW_USER",
  application,
});

export const signUpCodeNotFound = () => ({
  type: "SIGNUP_CODE_NOT_FOUND",
});

export const newUserInfoConfirmed = (application) => ({
  type: "NEW_USER_INFO_CONFIRMED",
  application,
});

export const usernameAlreadyExists = () => ({
  type: "USERNAME_ALREADY_EXISTS",
});

export const succesfullycreatedNewUser = () => ({
  type: "SUCCESSFULLY_CREATED_NEW_USER",
});

export const userLoggedIn = (data) => ({
  type: "USER_LOGGED_IN",
  data,
});

export const loggingIn = (data) => ({
  type: "LOGGING_IN",
});

export const userNotFound = () => ({
  type: "USER_NOT_FOUND",
});

export const invalidPassword = () => ({
  type: "INVALID_PASSWORD",
});

export const userLoggedOut = () => ({
  type: "USER_LOGGED_OUT",
});

// export const loggedInUserDetails = (data) => ({
//   type: "LOGGED_IN_USER_DETAILS",
//   data,
// });

export const receiveUsers = (data) => ({
  type: "RECEIVE_USERS",
  data,
});

export const switchingProfile = () => ({
  type: "SWITCHING_PROFILE",
});

export const requestProfile = () => ({ type: "REQUEST_PROFILE" });

export const receiveProfile = (data) => ({ type: "RECEIVE_PROFILE", data });

export const requestMessages = () => ({ type: "REQUEST_MESSAGES" });

export const receiveSentMessages = (data) => ({
  type: "RECEIVE_SENT_MESSAGES",
  data,
});

export const receiveReceivedMessages = (data) => ({
  type: "RECEIVE_RECEIVED_MESSAGES",
  data,
});

export const updateCategory = (category) => ({
  type: "UPDATE_CATEGORY",
  category,
});

export const updateReason = (reason) => ({
  type: "UPDATE_REASON",
  reason,
});

export const resetFilters = () => ({
  type: "RESET_FILTERS",
});

export const sendChat = () => ({
  type: "SEND_CHAT",
});

export const resetChat = () => ({
  type: "RESET_CHAT",
});

export const addMessage = (data) => ({
  type: "ADD_MESSAGE",
  data,
});

export const receiveAllMessages = (data) => ({
  type: "RECEIVE_ALL_MESSAGES",
  data,
});

export const receiveProjects = (data) => ({
  type: "RECEIVE_PROJECTS",
  data,
});

export const addProject = (data) => ({
  type: "ADD_PROJECT",
  data,
});
