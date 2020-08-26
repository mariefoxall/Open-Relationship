import React from "react";
import styled from "styled-components";
import Header from "./Header";
import { useSelector, useDispatch } from "react-redux";
import {
  getCurrentUserEmail,
  getCurrentUserInfo,
} from "./reducers/currentuser.reducer";
import { loggedInUserDetails } from "../actions";
import Login from "./Login";

const Account = () => {
  const dispatch = useDispatch();

  const currentUserStatus = useSelector((state) => state.currentuser.status);

  const currentUserEmail = useSelector(getCurrentUserEmail);
  // if (currentUser) {
  console.log(currentUserEmail);
  // }

  const getUserDetails = () => {
    fetch("/api/get-user-details", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: currentUserEmail }),
    })
      .then((res) => res.json())
      .then((json) => {
        console.log(json);
        dispatch(loggedInUserDetails(json.data));
      });
  };

  React.useEffect(() => {
    if (currentUserEmail) {
      getUserDetails();
    }
  }, [currentUserEmail]);

  const currentUserInfo = useSelector(getCurrentUserInfo);
  console.log(currentUserInfo);

  let contact = {};
  let thisPortfolioArray = [];
  let reasonsArray = [];

  if (currentUserInfo) {
    contact = currentUserInfo.contact;

    const portfolioObject = currentUserInfo.portfolio;
    const portfolioAllArray = Object.entries(portfolioObject);
    console.log(portfolioAllArray);
    portfolioAllArray.forEach((option) => {
      if (option[1]) {
        if (option[0] === "graphicDesign") {
          thisPortfolioArray.push("graphic design");
        } else if (option[0] === "homeObjects") {
          thisPortfolioArray.push("home objects");
        } else if (option[0] === "otherCategory") {
          thisPortfolioArray.push(option[1]);
        } else {
          thisPortfolioArray.push(option[0]);
        }
      }
    });

    const reasonsAllArray = Object.entries(currentUserInfo.reasons);
    reasonsAllArray.forEach((reason) => {
      if (reason[1]) {
        reasonsArray.push(reason[0]);
      }
    });
  }

  return (
    <>
      {currentUserStatus === "idle" && <Login />}
      {currentUserStatus === "logged-in-info" && (
        <>
          {" "}
          <Header />
          <MyAccount>
            <TopDiv>
              <ProfilePicture>
                <button>add a highlight image</button>
              </ProfilePicture>

              <NameBio>
                <Name>{contact.displayName}</Name>
                <Bio>{currentUserInfo.longForm.bio}</Bio>
              </NameBio>
            </TopDiv>
            <div>
              {" "}
              {thisPortfolioArray.map((option) => {
                return <div key={option}>{option}</div>;
              })}
            </div>
            <div>
              {reasonsArray.map((reason) => {
                return <div key={reason}>{reason}</div>;
              })}
            </div>
            <div>Add images of your work</div>
          </MyAccount>
        </>
      )}
    </>
  );
};
// this is styled for desktop - need something for mobile
const MyAccount = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;

const Name = styled.h1`
  background-color: var(--pale-yellow);
  padding: 5px;
`;
const Bio = styled.div`
  padding: 5px;
  background-color: var(--mint-green);
`;
const ProfilePicture = styled.div`
  height: 300px;
  width: 300px;
  border-radius: 50%;
  background-color: var(--coral);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const NameBio = styled.div`
  width: 300px;
  margin-left: 20px;
`;

const TopDiv = styled.div`
  display: flex;
`;

export default Account;
