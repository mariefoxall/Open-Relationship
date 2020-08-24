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
