import React from "react";
import styled from "styled-components";
import Header from "./Header";
import { useSelector, useDispatch } from "react-redux";
import {
  getCurrentUserEmail,
  getCurrentUserInfo,
} from "./reducers/currentuser.reducer";
import { loggedInUserDetails } from "../actions";
import { useParams } from "react-router-dom";
import { requestProfile, receiveProfile } from "../actions";
import { getUser } from "./reducers/profile.reducer";

const Profile = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const username = params.username;

  const [collaboration, setCollaboration] = React.useState(false);
  const [trade, setTrade] = React.useState(false);
  const [connecting, setConnecting] = React.useState(false);

  const currentUserStatus = useSelector((state) => state.currentuser.status);
  const currentUserInfo = useSelector(getCurrentUserInfo);
  console.log(currentUserInfo);

  //   const currentUserEmail = useSelector(getCurrentUserEmail);
  //   console.log(currentUserEmail);

  const getUserDetails = (username) => {
    dispatch(requestProfile());
    fetch(`/users/${username}`)
      .then((res) => res.json())
      .then((json) => {
        console.log(json);
        dispatch(receiveProfile(json.data));
      })
      .catch((error) => console.log(error));
  };

  const profile = useSelector(getUser);
  console.log(profile);

  const profileStatus = useSelector((state) => state.profile.status);

  React.useEffect(() => {
    getUserDetails(username);
  }, [username]);

  let contact = {};
  let thisPortfolioArray = [];
  let portfolioObject = {};
  let longForm = {};
  let collaborationStyle = { display: "none" };

  let tradeStyle = { display: "none" };

  let connectingStyle = { display: "none" };

  if (profile) {
    contact = profile.contact;
    longForm = profile.longForm;
    portfolioObject = profile.portfolio;
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
    collaborationStyle = profile.reasons.collaboration
      ? { display: "block" }
      : { display: "none" };

    tradeStyle = profile.reasons.trade
      ? { display: "block" }
      : { display: "none" };

    connectingStyle = profile.reasons.connecting
      ? { display: "block" }
      : { display: "none" };
  }

  const handleConnection = () => {
    fetch("/make-connection", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        requestingUser: currentUserInfo.username,
        receivingUser: username,
        reasons: { connecting, trade, collaboration },
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

  return (
    <>
      {profileStatus === "profile-received" && (
        <>
          {" "}
          <Header />
          <MyAccount>
            <TopDiv>
              <div>
                <ProfilePicture></ProfilePicture>
                <ConnectDiv>
                  <div>CONNECT</div>{" "}
                  <ConnectDropdown>
                    <SectionHeading>I WANT TO:</SectionHeading>
                    <CheckboxDiv>
                      <form>
                        <Option style={collaborationStyle}>
                          <input
                            name="collaboration"
                            id="collaboration"
                            type="checkbox"
                            value={collaboration}
                            onChange={(ev) => setCollaboration(!collaboration)}
                          />
                          <label htmlFor="collaboration">
                            collaborate on a project
                          </label>
                        </Option>
                        <Option style={tradeStyle}>
                          <input
                            name="trade"
                            id="trade"
                            type="checkbox"
                            value={trade}
                            onChange={(ev) => setTrade(!trade)}
                          />
                          <label htmlFor="trade">
                            trade goods and/or services
                          </label>
                        </Option>
                        <Option style={connectingStyle}>
                          <input
                            name="connecting"
                            id="connecting"
                            type="checkbox"
                            value={connecting}
                            onChange={(ev) => setConnecting(!connecting)}
                          />
                          <label htmlFor="connecting">
                            chat about art, life and the nature of the universe
                          </label>
                        </Option>
                        <ConnectButton
                          type="submit"
                          onClick={(ev) => {
                            ev.preventDefault();
                            handleConnection();
                          }}
                        >
                          MAKE THIS CONNECTION
                        </ConnectButton>
                      </form>
                    </CheckboxDiv>
                  </ConnectDropdown>
                </ConnectDiv>
              </div>

              <NameBio>
                <div>
                  <Name>{contact.displayName}</Name>
                </div>
                <div>
                  {thisPortfolioArray.map((option) => {
                    return <Category key={option}>{option}</Category>;
                  })}
                </div>
                <Bio>{longForm.bio}</Bio>
              </NameBio>
            </TopDiv>
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

const ConnectDiv = styled.div`
  margin-top: 20px;
  padding: 5px;
  background-color: var(--coral);
  outline: none;
  border: none;
  position: relative;

  &: hover {
    cursor: pointer;
    background-color: var(--lavender);
  }
`;

const ConnectDropdown = styled.fieldset`
  background-color: var(--pale-yellow);
  display: none;
  ${ConnectDiv}: hover & {
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 0;
    left: 0;
  }
`;

const SectionHeading = styled.legend`
  background-color: var(--lavender);
  padding: 5px;
  width: 100%;
`;

const CheckboxDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-right: 20px;
  &: last-child {
    margin-right: 0;
  }
`;

const Option = styled.div`
  width: 100%;
  &:hover {
    background-color: var(--mint-green);
  }
`;

const ConnectButton = styled.button`
  width: 100%;
  padding: 10px;
  font-size: 15px;
  border: 1px solid var(--forest-green);
  background-color: var(--coral);
  outline: none;
  text-align: left;

  &: hover {
    cursor: pointer;
    background-color: var(--mint-green);
  }
`;

const Category = styled.div`
  padding: 5px;
  background-color: var(--coral);
  &:hover {
    background-color: var(--lavender);
  }
`;

export default Profile;
