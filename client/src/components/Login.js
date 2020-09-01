import React from "react";
import styled from "styled-components";
import Header from "./Header";
import { useHistory, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  authenticateNewUser,
  signUpCodeNotFound,
  userLoggedIn,
  loggingIn,
  userNotFound,
  invalidPassword,
  userLoggedOut,
} from "../actions";
import Loading from "./Loading";

const Login = () => {
  const [signUpCode, setSignUpCode] = React.useState("");
  const dispatch = useDispatch();
  const currentUserStatus = useSelector((state) => state.currentuser.status);
  console.log("currentUserStatus", currentUserStatus);
  let history = useHistory();

  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");

  const [badPassword, setBadPassword] = React.useState(false);
  const [badUser, setBadUser] = React.useState(false);

  const invalidPasswordStyle = badPassword
    ? { display: "flex", color: "red" }
    : { display: "none" };

  const invalidUserStyle = badUser
    ? { display: "flex", color: "red" }
    : { display: "none" };

  const handleSignUp = (signUpCode) => {
    //check if applications collection has special code (only created when application is approved)
    //link to signup page with all of user's info entered and allow them to double-check
    fetch(`/check-application-for-signup/${signUpCode}`)
      .then((res) => res.json())
      .then((json) => {
        console.log(json);
        if (json.data) {
          dispatch(authenticateNewUser(json.data));
        } else {
          dispatch(signUpCodeNotFound());
        }
        history.push("/signup");
      })
      .catch((error) => {
        console.log(error);
        //render error message on page
        history.push("/signup");
      });
  };

  const handleSignIn = () => {
    dispatch(loggingIn());
    //check if user exists in "users" collection
    //dispatch userLoggedIn (email, password)
    fetch("/verify-user-for-signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    })
      .then((res) => res.json())
      .then((json) => {
        console.log(json);
        if (json.userNotFound) {
          setBadUser(true);
          setBadPassword(false);
          dispatch(userNotFound());
          return;
        } else if (json.invalidPassword) {
          setBadPassword(true);
          setBadUser(false);
          dispatch(invalidPassword());
          return;
        } else {
          setBadPassword(false);
          setBadUser(false);
          dispatch(userLoggedIn(json.data));
          history.push("/myaccount");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <>
      <Header />
      {currentUserStatus === "idle" && (
        <LoginPage>
          <LoginDiv>
            <SignUp>
              <label htmlFor="signUpCode">NEW USER?</label>
              <SignUpCodeInput
                type="text"
                id="signUpCode"
                name="signUpCode"
                value={signUpCode}
                placeholder="Enter your secret code here to sign up!"
                onChange={(ev) => setSignUpCode(ev.target.value)}
                required
              />
              <SignUpButton
                type="submit"
                onClick={(ev) => {
                  ev.preventDefault();
                  handleSignUp(signUpCode);
                }}
              >
                SIGN UP
              </SignUpButton>
            </SignUp>
            <SignIn>
              <p>ONE OF US?</p>
              <SignInForm>
                <TextInput
                  placeholder="username"
                  type="text"
                  name="username"
                  id="username"
                  value={username}
                  onChange={(ev) => setUsername(ev.target.value)}
                  required
                />

                <TextInput
                  placeholder="password"
                  type="password"
                  name="password"
                  id="password"
                  value={password}
                  onChange={(ev) => setPassword(ev.target.value)}
                  required
                />
                <NotFound style={invalidPasswordStyle}>
                  <p>Sorry, wrong password! Please try again.</p>
                </NotFound>
                <NotFound style={invalidUserStyle}>
                  <p>Sorry, we can't find that username! Please try again.</p>
                </NotFound>
                <SignInButton
                  type="submit"
                  onClick={(ev) => {
                    ev.preventDefault();
                    handleSignIn();
                  }}
                >
                  SIGN IN
                </SignInButton>
              </SignInForm>
            </SignIn>
            <Apply>
              INTERESTED IN APPLYING?
              <ApplyLink to="/applicationform">APPLY</ApplyLink>
            </Apply>
          </LoginDiv>
        </LoginPage>
      )}
      {currentUserStatus === "loading" && (
        <LoginPage>
          <Loading />{" "}
        </LoginPage>
      )}
      {currentUserStatus === "logged-in" && (
        <LoginPage>
          <LoginDiv>
            <SignIn>
              <p>DONE FOR NOW?</p>
              <SignInForm>
                <SignOutButton
                  type="submit"
                  onClick={(ev) => {
                    ev.preventDefault();
                    dispatch(userLoggedOut());
                  }}
                >
                  SIGN OUT
                </SignOutButton>
              </SignInForm>
            </SignIn>
          </LoginDiv>
        </LoginPage>
      )}
    </>
  );
};

const LoginPage = styled.div`
  display: flex;
  justify-content: center;
  /* align-items: center; */
  min-height: calc(100vh - 100px);
  background-color: var(--pale-yellow);
`;

const LoginDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  /* height: calc(100vh - 140px); */
`;
const SignUp = styled.form`
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: var(--mint-green);
`;

const SignUpCodeInput = styled.input`
  width: 275px;
  margin: 10px 0;
`;

const SignUpButton = styled.button`
  width: 80px;
  padding: 5px;
  background-color: var(--coral);
  outline: none;
  border: none;

  &: hover {
    cursor: pointer;
    background-color: var(--lavender);
  }
`;

const SignInButton = styled(SignUpButton)`
  margin-top: 10px;
`;
const SignOutButton = styled(SignInButton)`
  width: 100px;
`;

const SignIn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  background-color: var(--mint-green);
`;

const Apply = styled(SignIn)``;

const ApplyLink = styled(Link)`
  /* width: 80px; */
  padding: 5px;
  font-size: 14px;
  text-align: center;
  color: black;
  background-color: var(--coral);
  outline: none;
  border: none;
  margin-top: 10px;

  &: hover {
    cursor: pointer;
    background-color: var(--lavender);
  }
`;

const SignInForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  background-color: var(--mint-green);
`;

const TextInput = styled.input`
  width: 200px;
`;

const NotFound = styled.div`
  margin-top: 10px;
`;

export default Login;
