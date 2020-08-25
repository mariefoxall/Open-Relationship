import React from "react";
import styled from "styled-components";
import Header from "./Header";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { authenticateNewUser, signUpCodeNotFound } from "../actions";

const Login = () => {
  const [signUpCode, setSignUpCode] = React.useState("");
  const dispatch = useDispatch();
  let history = useHistory();

  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleSignUp = (signUpCode) => {
    //check if applications collection has special code (only created when application is approved)
    //link to signup page with all of user's info entered and allow them to double-check
    fetch(`/api/check-application-for-signup/${signUpCode}`)
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
    //check if user exists in "users" collection
    //dispatch userLoggedIn (email, password)
  };
  return (
    <>
      <Header />
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
                placeholder="username (email address)"
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
        </LoginDiv>
      </LoginPage>
    </>
  );
};

const LoginPage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 100px);
  background-color: var(--pale-yellow);
`;

const LoginDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  height: calc(100vh - 140px);
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

const SignIn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  background-color: var(--mint-green);
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

export default Login;
