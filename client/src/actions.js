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

export const userAlreadyExists = () => ({
  type: "USER_ALREADY_EXISTS",
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

export const loggedInUserDetails = (data) => ({
  type: "LOGGED_IN_USER_DETAILS",
  data,
});
