import React from "react";
import styled from "styled-components";
import Header from "./Header";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import {
  getCurrentUserEmail,
  getCurrentUserInfo,
} from "./reducers/currentuser.reducer";
import {
  loggedInUserDetails,
  switchingProfile,
  updateReason,
  updateCategory,
} from "../actions";
import { useParams } from "react-router-dom";
import { requestProfile, receiveProfile } from "../actions";
import { getUser } from "./reducers/profile.reducer";
import blob from "../assets/blob300.png";
import { getProjects } from "./reducers/projects.reducer";
import Loading from "./Loading";

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

  const allProjects = useSelector(getProjects);
  const projectsStatus = useSelector((state) => state.projects.status);

  let userProjects = [];
  if (allProjects) {
    const userProjectsWrongOrder = allProjects.filter(
      (project) => project.username === username
    );
    userProjects = userProjectsWrongOrder.reverse();
  }
  console.log("allProjects", allProjects);
  console.log("userProjects", userProjects);

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

  const currentTime = new Date();
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

  let requestConnectionArray = [];

  const [connectionReasons, setConnectionReasons] = React.useState({});
  const connectionReasonsArray = Object.entries(connectionReasons);
  connectionReasonsArray.forEach((reason) => {
    if (reason[1]) {
      requestConnectionArray.push(reason[0]);
    }
  });

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

  const handleApproveConnection = () => {
    fetch("/approve-connection", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        requestingUser: username,
        receivingUser: currentUserInfo.username,
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
  const sendConnectionApprovalMessage = () => {
    fetch("/send-message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sender: currentUsername,
        receiver: username,
        message: "Yes! Let's chat! :)",
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

  const [connectionApproved, setConnectionApproved] = React.useState(false);
  console.log("connectionApproved", connectionApproved);

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
          setConnectionReasons(json.data.reasons);
          setConnectionApproved(json.data.connectionApproved);
        } else if (json.youAlreadyAskedThem) {
          setYouAlreadyAskedThem(true);
          setConnectionApproved(json.data.connectionApproved);
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
        invitationToConnect: true,
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

  const toggleCategory = (target) => {
    if (target === "home objects") {
      dispatch(updateCategory("homeObjects"));
    } else if (target === "graphic design") {
      dispatch(updateCategory("graphicDesign"));
    } else {
      dispatch(updateCategory(target));
    }
  };

  const toggleReason = (target) => {
    dispatch(updateReason(target));
  };

  return (
    <>
      {profileStatus === "loading" && (
        <>
          <Header />
          <Loading />
        </>
      )}
      {profileStatus === "profile-requested" && (
        <>
          <Header />
          <Loading />
        </>
      )}

      {profileStatus === "profile-received" && (
        <>
          {" "}
          <Header />
          <MyAccountFullPage>
            <MyAccount>
              <SectionDiv>
                <ProfilePicture>
                  <Pic
                    src={profilePicURL}
                    alt={`profile pic for ${username}`}
                  />
                </ProfilePicture>
              </SectionDiv>

              <SectionDiv>
                <BlobDiv>
                  <Name>{contact.displayName}</Name>
                </BlobDiv>{" "}
                <ConnectDiv>
                  <div>CONNECT</div>{" "}
                  <ConnectDropdown>
                    {currentUserStatus === "idle" && (
                      <>
                        <SectionHeading>{username} is into:</SectionHeading>
                        <CheckboxDiv>
                          <ReasonsDiv>
                            {thisReasonsArray.map((option) => {
                              return (
                                <NoClickCategory key={option}>
                                  {option}
                                </NoClickCategory>
                              );
                            })}
                          </ReasonsDiv>
                          <LoginToConnect to="/login">
                            login to connect!
                          </LoginToConnect>
                        </CheckboxDiv>
                      </>
                    )}
                    {connectionApproved && (
                      <SectionHeading>
                        You and {username} are connected
                      </SectionHeading>
                    )}

                    {youAlreadyAskedThem && (
                      <AlreadyAskedDiv>
                        You already reached out to this person! Connection
                        pending, please be patient!
                      </AlreadyAskedDiv>
                    )}
                    {theyAlreadyAskedYou && !connectionApproved && (
                      <>
                        <SectionHeading>
                          {username} wants to talk:
                        </SectionHeading>
                        <CheckboxDiv>
                          <div>
                            {requestConnectionArray.map((option) => {
                              return <Category key={option}>{option}</Category>;
                            })}
                          </div>
                          <ConnectButton
                            type="submit"
                            onClick={(ev) => {
                              ev.preventDefault();
                              handleApproveConnection();
                              sendConnectionApprovalMessage();
                            }}
                          >
                            APPROVE THIS CONNECTION
                          </ConnectButton>
                        </CheckboxDiv>
                      </>
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
                <WebInstaDiv>
                  <WebInstaLink>
                    website:{" "}
                    <a
                      target="blank"
                      href={
                        contact.website.includes("http")
                          ? contact.website
                          : `http://${contact.website}`
                      }
                    >
                      {contact.website.includes("http://")
                        ? contact.website.slice(7)
                        : contact.website}
                    </a>
                  </WebInstaLink>
                  <WebInstaLink>
                    instagram:{" "}
                    <a
                      target="blank"
                      href={
                        contact.instagram.includes("@")
                          ? `http://instagram.com/${contact.instagram.slice(1)}`
                          : `http://instagram.com/${contact.instagram}`
                      }
                    >
                      {contact.instagram.includes("@")
                        ? contact.instagram.slice(1)
                        : contact.instagram}
                    </a>
                  </WebInstaLink>
                </WebInstaDiv>
              </SectionDiv>
              <SectionDiv>
                <Heading>CATEGORIES: </Heading>
                <div>
                  {thisPortfolioArray.map((option) => {
                    return (
                      <CategoryLink
                        key={option}
                        to="/scout"
                        onClick={() => {
                          toggleCategory(option);
                          toggleReason("All");
                        }}
                      >
                        <Category>{option}</Category>
                      </CategoryLink>
                    );
                  })}
                </div>
              </SectionDiv>
              <SectionDiv>
                <Heading>BIO:</Heading>
                <Bio>{longForm.bio}</Bio>{" "}
              </SectionDiv>
            </MyAccount>
            {projectsStatus === "projects-loaded" && userProjects.length > 0 && (
              <>
                <TheWordProjects>PROJECTS</TheWordProjects>
                <ProjectsDiv>
                  <ProjectsList>
                    {userProjects.map((project) => {
                      return (
                        <SectionDiv key={project._id} to="/scout">
                          <ProjectTitleDiv>
                            {project.projectTitle}
                          </ProjectTitleDiv>
                          <ProjectImg src={project.projectPicURL} />
                          <ProjectDescriptionDiv>
                            {project.projectDescription}
                          </ProjectDescriptionDiv>
                        </SectionDiv>
                      );
                    })}
                  </ProjectsList>
                </ProjectsDiv>
              </>
            )}
          </MyAccountFullPage>
        </>
      )}
    </>
  );
};
// this is styled for desktop - need something for mobile

const AlreadyAskedDiv = styled.div`
  padding: 5px;
`;

const Bio = styled.div`
  padding: 5px;
  background-color: var(--mint-green);
  margin-top: 20px;
`;

const BlobDiv = styled.div`
  width: 100%;
  height: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url(${blob});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
`;

const Category = styled.div`
  padding: 5px;
  background-color: var(--forest-green);
  color: white;
  width: 100%;

  &:hover {
    background-color: var(--lavender);
  }
`;

const CategoryLink = styled(Link)`
  padding: 5px;
`;

const CheckboxDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-right: 20px;
  width: 100%;
  /* cursor: auto; */

  &:last-child {
    margin-right: 0;
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

  &:hover {
    cursor: pointer;
    background-color: var(--mint-green);
  }
`;

const ConnectDiv = styled.div`
  margin-top: 10px;
  padding: 5px;
  background-color: var(--coral);
  outline: none;
  border: none;
  position: relative;

  &:hover {
    /* cursor: pointer; */
    background-color: var(--lavender);
  }
`;

const ConnectDropdown = styled.fieldset`
  background-color: var(--pale-yellow);
  display: none;
  width: 100%;
  height: 130px;
  /* cursor: auto; */

  ${ConnectDiv}:hover & {
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 0;
    left: 0;
    /* cursor: auto; */
  }
`;

const Heading = styled.div`
  padding: 5px;
  background-color: var(--pale-yellow);
  margin-top: 20px;
  border: 1px solid var(--forest-green);
  color: var(--forest-green);
`;

const LoginToConnect = styled(Link)`
  background-color: var(--pale-yellow);
  padding: 10px 5px;
  width: 100%;
`;

const MyAccount = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  padding: 20px;
  @media (min-width: 640px) {
    max-width: 70%;
  }
  @media (min-width: 1800px) {
    max-width: 50%;
  }
`;

const MyAccountFullPage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Name = styled.h2`
  padding: 5px;
`;

const NoClickCategory = styled.div`
  padding: 5px;
  background-color: var(--coral);
  width: 100%;
  /* cursor: auto; */
`;

const Option = styled.div`
  width: 100%;
  &:hover {
    background-color: var(--mint-green);
  }
`;

const Pic = styled.img`
  height: 300px;
  width: 300px;
  border-radius: 50%;
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

const ProjectImg = styled.img`
  width: 100%;
`;
const ProjectsDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ProjectsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  padding: 20px;
  @media (min-width: 640px) {
    max-width: 70%;
  }
  @media (min-width: 1800px) {
    max-width: 50%;
  }
`;

const ProjectTitleDiv = styled.h3`
  width: 100%;
  height: 80px;
  text-align: center;
  background-color: var(--lavender);
  padding: 10px;
`;

const ProjectDescriptionDiv = styled.div`
  width: 100%;
  background-color: var(--mint-green);
  padding: 5px;
  font-size: 14px;
`;

const ReasonsDiv = styled.div`
  width: 100%;
  /* cursor: auto; */
`;

const SectionDiv = styled.div`
  width: 30%;
  min-width: 300px;
  margin: 20px;
`;

const SectionHeading = styled.legend`
  background-color: var(--lavender);
  padding: 5px;
  width: 100%;
`;

const TheWordProjects = styled.h2`
  background-color: var(--coral);
  padding: 10px;
`;

const WebInstaDiv = styled.div``;

const WebInstaLink = styled.div`
  padding: 5px;
  margin: 10px 0;
  background-color: var(--coral);
  width: 100%;
`;

export default Profile;
