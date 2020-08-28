import React from "react";
import styled from "styled-components";
import Header from "./Header";
import { useSelector, useDispatch } from "react-redux";
import {
  getCurrentUserEmail,
  getCurrentUserInfo,
} from "./reducers/currentuser.reducer";
import { userLoggedIn, userLoggedOut } from "../actions";
import { useHistory } from "react-router-dom";

const MyAccount = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const currentUserStatus = useSelector((state) => state.currentuser.status);

  const currentUserInfo = useSelector(getCurrentUserInfo);
  let currentUsername = currentUserInfo ? currentUserInfo.username : null;
  console.log("currentUsername", currentUsername);

  let contact = {};
  let thisPortfolioArray = [];
  let reasonsArray = [];
  let profilePicURL = "";

  if (currentUserInfo) {
    contact = currentUserInfo.contact;
    profilePicURL = currentUserInfo.profilePicURL;

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

  const redirectLogin = () => {
    history.push("/login");
  };

  const [image, setImage] = React.useState({});
  console.log(image);

  const fileOnChange = (ev) => {
    setImage(ev.target.files[0]);
  };

  const [newProfilePicURL, setNewProfilePicURL] = React.useState("");
  console.log(newProfilePicURL);

  const postProfilePic = (url) => {
    console.log("url", url);
    console.log("currentUsername inside postProfilePic", currentUsername);
    fetch("/update-profile-pic", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: currentUsername,
        profilePicURL: url,
      }),
    })
      .then((res) => res.json())
      .then((json) => {
        console.log(json);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const sendImage = (ev) => {
    const data = new FormData();
    data.append("file", image);
    //could append title, body, other related info if we had other inputs - good for posts about projects
    data.append("upload_preset", "open-relationship");
    data.append("cloud_name", "open-relationship");

    fetch("https://api.cloudinary.com/v1_1/open-relationship/image/upload", {
      method: "POST",
      body: data,
    })
      .then((res) => res.json())
      .then((json) => {
        console.log(json);
        setNewProfilePicURL(json.url);
        postProfilePic(json.url);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      {currentUserStatus === "idle" && (
        <>
          <Header />
          <MyAccountDiv>
            <LoginDiv>
              <LoginButton
                onClick={(ev) => {
                  ev.preventDefault();
                  redirectLogin();
                }}
              >
                LOG IN
              </LoginButton>
            </LoginDiv>
          </MyAccountDiv>
        </>
      )}
      {currentUserStatus === "logged-in" && (
        <>
          {" "}
          <Header />
          <MyAccountDiv>
            <TopDiv>
              <div>
                <ProfilePicture>
                  {profilePicURL && profilePicURL.length > 0 && (
                    <Pic
                      src={profilePicURL}
                      alt={`profile pic for ${currentUsername}`}
                    />
                  )}
                  <HoverDiv>
                    <UpdateDiv>update profile image</UpdateDiv>
                    <ProfilePicInputDiv>
                      <ProfilePicInput type="file" onChange={fileOnChange} />
                      <UploadButton onClick={sendImage}>upload</UploadButton>
                    </ProfilePicInputDiv>
                  </HoverDiv>
                </ProfilePicture>
                <ConnectDiv>
                  <ReasonsDiv>OPEN TO:</ReasonsDiv>
                  {reasonsArray.map((reason) => {
                    return <Category key={reason}>{reason}</Category>;
                  })}
                </ConnectDiv>
              </div>

              <NameBio>
                <Name>
                  {contact.displayName}
                  <SignOutButton
                    type="submit"
                    onClick={(ev) => {
                      ev.preventDefault();
                      dispatch(userLoggedOut());
                    }}
                  >
                    SIGN ME OUT
                  </SignOutButton>
                </Name>
                <div></div>
                <div>
                  {" "}
                  {thisPortfolioArray.map((option) => {
                    return <Category key={option}>{option}</Category>;
                  })}
                </div>
                <Bio>{currentUserInfo.longForm.bio}</Bio>
              </NameBio>
            </TopDiv>
            <div>Add images of your work</div>
          </MyAccountDiv>
        </>
      )}
    </>
  );
};
// this is styled for desktop - need something for mobile
const MyAccountDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;

const Name = styled.h2`
  background-color: var(--pale-yellow);
  padding: 5px;
  border: 1px solid var(--coral);
`;
const Bio = styled.div`
  padding: 5px;
  background-color: var(--mint-green);
`;
const ProfilePicture = styled.div`
  height: 300px;
  width: 300px;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: var(--coral);
  position: relative;
`;

const ProfilePicInput = styled.input`
  /* display: flex;
  flex-direction: column;
  align-items: center; */
  text-align: center;
  font-family: "Spartan";
  & > button {
    background-color: var(--coral);
  }
`;

const HoverDiv = styled.div`
  position: absolute;
  width: 200px;
  height: 50px;
  top: 125px;
  left: 50px;
  /* border: 1px solid black; */
`;

const Pic = styled.img`
  height: 300px;
  width: 300px;
  border-radius: 50%;
  ${ProfilePicture}:hover & {
    opacity: 0.5;
  }
`;

const UpdateDiv = styled.div`
  /* height: 40px; */
  text-align: center;
  background-color: var(--mint-green);
  padding: 5px;
  ${HoverDiv}:hover & {
    display: none;
  }
`;

const ProfilePicInputDiv = styled.div`
  display: none;
  ${HoverDiv}:hover & {
    position: absolute;
    left: 0;
    top: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
  }
`;

const UploadButton = styled.button`
  width: 80px;
  position: absolute;
  left: 60px;
  top: 40px;
  padding: 10px;
  background-color: var(--mint-green);
  outline: none;
  border: none;

  &: hover {
    cursor: pointer;
    background-color: var(--lavender);
  }
`;

const NameBio = styled.div`
  width: 300px;
  margin-left: 20px;
`;

const TopDiv = styled.div`
  display: flex;
`;

const Category = styled.div`
  padding: 5px;
  background-color: var(--coral);
  &:hover {
    background-color: var(--lavender);
    cursor: pointer;
  }
`;

const LoginButton = styled.button`
  width: 80px;
  padding: 5px;
  background-color: var(--coral);
  outline: none;
  border: none;

  &: hover {
    cursor: pointer;
    background-color: var(--pale-yellow);
  }
`;

const LoginDiv = styled.div`
  width: 200px;
  height: 100px;
  background-color: var(--mint-green);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ConnectDiv = styled.div`
  background-color: var(--mint-green);
  margin-top: 20px;
  outline: none;
  border: none;
`;

const ReasonsDiv = styled.div`
  padding: 5px;
`;

const SignOutButton = styled.button`
  width: 150px;
  padding: 5px;
  background-color: var(--lavender);
  outline: none;
  border: none;

  &: hover {
    cursor: pointer;
    background-color: var(--mint-green);
  }
`;

export default MyAccount;
