import React from "react";
import styled from "styled-components";
import Header from "./Header";
import { useSelector, useDispatch } from "react-redux";
import {
  getCurrentUserEmail,
  getCurrentUserInfo,
} from "./reducers/currentuser.reducer";
import { loggedInUserDetails, switchingProfile } from "../actions";
import { useParams } from "react-router-dom";
import { requestProfile, receiveProfile } from "../actions";
import { getUser } from "./reducers/profile.reducer";
import moment from "moment";

const Profile = () => {
  const [refreshPage, setRefreshPage] = React.useState(false);

  const dispatch = useDispatch();
  const params = useParams();
  const username = params.username;
  console.log(username);

  const [collaboration, setCollaboration] = React.useState(false);
  const [trade, setTrade] = React.useState(false);
  const [connecting, setConnecting] = React.useState(false);

  const [theyAlreadyAskedYou, setTheyAlreadyAskedYou] = React.useState(false);
  const [youAlreadyAskedThem, setYouAlreadyAskedThem] = React.useState(false);

  const currentUserStatus = useSelector((state) => state.currentuser.status);
  const currentUserInfo = useSelector(getCurrentUserInfo);
  console.log(currentUserInfo);

  let interestMessage = "";

  const collaborationMessage = "collaborating on a project together";
  const tradeMessage = "trading some of our work";
  const connectingMessage = "chatting about art, life and the universe";

  if (collaboration && trade && connecting) {
    interestMessage = `${collaborationMessage}, ${tradeMessage} and ${connectingMessage}.`;
  } else if (collaboration && trade) {
    interestMessage = `${collaborationMessage} and ${tradeMessage}.`;
  } else if (collaboration && connecting) {
    interestMessage = `${collaborationMessage} and ${connectingMessage}.`;
  } else if (trade && connecting) {
    interestMessage = `${tradeMessage} and ${connectingMessage}.`;
  } else if (collaboration) {
    interestMessage = `${collaborationMessage}.`;
  } else if (trade) {
    interestMessage = `${tradeMessage}.`;
  } else if (connecting) {
    interestMessage = `${connectingMessage}.`;
  }

  const currentTime = moment();
  console.log(currentTime);

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
  console.log(profileStatus);

  let currentUsername = "";

  if (currentUserInfo) {
    currentUsername = currentUserInfo.username;
  }

  React.useEffect(() => {
    dispatch(switchingProfile());
    getUserDetails(username);
    checkConnection();
  }, [username]);

  React.useEffect(() => {
    dispatch(switchingProfile());
    getUserDetails(username);
    checkConnection();
  }, [refreshPage]);

  let contact = {};
  let thisPortfolioArray = [];
  let portfolioObject = {};
  let longForm = {};
  let reasonsObject = {};
  let thisReasonsArray = [];
  let profilePicURL = "";

  let collaborationStyle = { display: "none" };
  let tradeStyle = { display: "none" };
  let connectingStyle = { display: "none" };

  if (profile) {
    contact = profile.contact;
    longForm = profile.longForm;
    portfolioObject = profile.portfolio;
    const portfolioAllArray = Object.entries(portfolioObject);
    console.log(portfolioAllArray);
    profilePicURL = profile.profilePicURL;
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

    reasonsObject = profile.reasons;
    const reasonsAllArray = Object.entries(reasonsObject);
    reasonsAllArray.forEach((reason) => {
      if (reason[1]) {
        thisReasonsArray.push(reason[0]);
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
        connectionApproved: false,
      }),
    })
      .then((res) => res.json())
      .then((json) => {
        console.log(json);
        setRefreshPage(!refreshPage);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const checkConnection = () => {
    fetch("/check-connection", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        currentUsername: currentUsername,
        profileUsername: username,
      }),
    })
      .then((res) => res.json())
      .then((json) => {
        console.log("json response from check conn", json);
        if (json.theyAlreadyAskedYou) {
          setTheyAlreadyAskedYou(true);
        } else if (json.youAlreadyAskedThem) {
          setYouAlreadyAskedThem(true);
        } else {
          setTheyAlreadyAskedYou(false);
          setYouAlreadyAskedThem(false);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const sendConnectionMessage = () => {
    fetch("/send-message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sender: currentUsername,
        receiver: username,
        message: `Hi! I'd love to connect with you. I'm interested in ${interestMessage}`,
        timestamp: currentTime,
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
      {profileStatus === "loading" && (
        <>
          <Header />
          <div>LOADING...</div>
        </>
      )}
      {profileStatus === "profile-requested" && (
        <>
          <Header />
          <div>Loading profile...</div>
        </>
      )}

      {profileStatus === "profile-received" && (
        <>
          {" "}
          <Header />
          <MyAccount>
            <TopDiv>
              <div>
                <ProfilePicture>
                  <Pic
                    src={profilePicURL}
                    alt={`profile pic for ${username}`}
                  />
                </ProfilePicture>
                <ConnectDiv>
                  <div>CONNECT</div>{" "}
                  <ConnectDropdown>
                    {currentUserStatus === "idle" && (
                      <>
                        <SectionHeading>{username} is into:</SectionHeading>
                        <CheckboxDiv>
                          <div>
                            {thisReasonsArray.map((option) => {
                              return <Category key={option}>{option}</Category>;
                            })}
                          </div>
                        </CheckboxDiv>
                      </>
                    )}

                    {youAlreadyAskedThem && (
                      <div>
                        You already reached out to this person! Connection
                        pending, please be patient :)
                      </div>
                    )}
                    {theyAlreadyAskedYou && (
                      <div>
                        This person has already made a request to connect! Check
                        your messages :)
                      </div>
                    )}
                    {currentUserStatus === "logged-in" &&
                      !theyAlreadyAskedYou &&
                      !youAlreadyAskedThem && (
                        <>
                          <SectionHeading>I WANT TO:</SectionHeading>
                          <CheckboxDiv>
                            <form>
                              <Option style={collaborationStyle}>
                                <input
                                  name="collaboration"
                                  id="collaboration"
                                  type="checkbox"
                                  value={collaboration}
                                  onChange={(ev) =>
                                    setCollaboration(!collaboration)
                                  }
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
                                  chat about art, life and the nature of the
                                  universe
                                </label>
                              </Option>
                              <ConnectButton
                                type="submit"
                                onClick={(ev) => {
                                  ev.preventDefault();
                                  handleConnection();
                                  sendConnectionMessage();
                                }}
                              >
                                MAKE THIS CONNECTION
                              </ConnectButton>
                            </form>
                          </CheckboxDiv>{" "}
                        </>
                      )}
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

const Pic = styled.img`
  height: 300px;
  width: 300px;
  border-radius: 50%;
`;

const Name = styled.h2`
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
