import React from "react";
import styled from "styled-components";
import Header from "./Header";
import { useSelector, useDispatch } from "react-redux";
import { getCurrentUserInfo } from "./reducers/currentuser.reducer";
import {
  userLoggedIn,
  userLoggedOut,
  updateCategory,
  updateReason,
  addProject,
} from "../actions";
import { useHistory, Link } from "react-router-dom";
import blob from "../assets/blob300.png";
import Loading from "./Loading";
import { getProjects } from "./reducers/projects.reducer";

const MyAccount = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const currentUserStatus = useSelector((state) => state.currentuser.status);

  const currentUserInfo = useSelector(getCurrentUserInfo);
  let currentUsername = currentUserInfo ? currentUserInfo.username : null;
  console.log("currentUsername", currentUsername);

  const allProjects = useSelector(getProjects);
  const projectsStatus = useSelector((state) => state.projects.status);

  let userProjects = {};
  if (allProjects) {
    const userProjectsWrongOrder = allProjects.filter(
      (project) => project.username === currentUsername
    );
    userProjects = userProjectsWrongOrder.reverse();
  }
  console.log("allProjects", allProjects);
  console.log("userProjects", userProjects);

  // const [refreshPage, setRefreshPage] = React.useState('false');

  let contact = {};
  let thisPortfolioArray = [];
  let reasonsArray = [];
  let profilePicURL = "";

  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [projectImage, setProjectImage] = React.useState("");
  const [projectPicURL, setProjectPicURL] = React.useState("");

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

  const fileOnChangeProject = (ev) => {
    setProjectImage(ev.target.files[0]);
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

  const postProject = (url) => {
    console.log("url", url);
    console.log("currentUsername inside postProfilePic", currentUsername);
    fetch("/add-project", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: currentUsername,
        projectPicURL: url,
        projectTitle: title,
        projectDescription: description,
      }),
    })
      .then((res) => res.json())
      .then((json) => {
        console.log(json);
        dispatch(addProject(json.data));
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

  const sendProjectImage = (ev) => {
    ev.preventDefault();
    const data = new FormData();
    data.append("file", projectImage);
    //could append title, body, other related info if we had other inputs - good for posts about projects
    data.append("upload_preset", "open-relationship");
    data.append("cloud_name", "open-relationship");

    fetch("https://api.cloudinary.com/v1_1/open-relationship/image/upload", {
      method: "POST",
      body: data,
    })
      .then((res) => res.json())
      .then((json) => {
        console.log("json response from cloudinary upload", json);
        setProjectPicURL(json.url);
        postProject(json.url);
        //set new pic in temp storage
        //post new pic to database
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
      {currentUserStatus === "idle" && (
        <>
          <Header />
          <MyAccountFullPage>
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
          </MyAccountFullPage>
        </>
      )}
      {currentUserStatus === "loading" && (
        <>
          <Header />
          <Loading />{" "}
        </>
      )}
      {currentUserStatus === "logged-in" && (
        <>
          {" "}
          <Header />
          <MyAccountFullPage>
            <MyAccountDiv>
              <SectionDiv>
                <ProfilePicture>
                  {profilePicURL && profilePicURL.length > 0 && (
                    <Pic
                      src={
                        newProfilePicURL.length > 0
                          ? newProfilePicURL
                          : profilePicURL
                      }
                      alt={`profile pic for ${currentUsername}`}
                    />
                  )}
                  <HoverDiv>
                    <UpdateDiv>update profile image</UpdateDiv>
                    <ProfilePicInputDiv>
                      <ProfilePicInput type="file" onChange={fileOnChange} />
                      <UploadButton
                        onClick={() => {
                          sendImage();
                          setImage({});
                        }}
                      >
                        upload
                      </UploadButton>
                    </ProfilePicInputDiv>
                  </HoverDiv>
                </ProfilePicture>{" "}
              </SectionDiv>
              <SectionDiv>
                <BlobDiv>
                  <Name>{contact.displayName}</Name>
                </BlobDiv>{" "}
                <SignOutButton
                  type="submit"
                  onClick={(ev) => {
                    ev.preventDefault();
                    dispatch(userLoggedOut());
                  }}
                >
                  SIGN ME OUT
                </SignOutButton>
                <ConnectDiv>
                  <SectionHeading>You are looking for:</SectionHeading>
                  <CheckboxDiv>
                    <ReasonsDiv>
                      {reasonsArray.map((reason) => {
                        return (
                          <ReasonLink
                            key={reason}
                            to="/scout"
                            onClick={() => {
                              toggleCategory("All");
                              toggleReason(reason);
                            }}
                          >
                            <Category>{reason}</Category>
                          </ReasonLink>
                        );
                      })}{" "}
                    </ReasonsDiv>
                  </CheckboxDiv>
                </ConnectDiv>{" "}
              </SectionDiv>
              <SectionDiv>
                <Heading>CATEGORIES: </Heading>
                <div>
                  {" "}
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
                </div>{" "}
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
                <Heading>BIO:</Heading>

                <Bio>{currentUserInfo.longForm.bio}</Bio>
              </SectionDiv>{" "}
            </MyAccountDiv>{" "}
            <ProjectsDiv>
              <ProjectInputForm>
                <ProjectUploadTitle>UPLOAD A NEW PROJECT</ProjectUploadTitle>
                <ProjectInputFieldTitle
                  type="text"
                  name="title"
                  id="title"
                  placeholder="title"
                  value={title}
                  onChange={(ev) => {
                    setTitle(ev.target.value);
                  }}
                />
                <ProjectInputField
                  type="text"
                  name="description"
                  id="description"
                  placeholder="description"
                  value={description}
                  onChange={(ev) => {
                    setDescription(ev.target.value);
                  }}
                />
                <ProjectPicInput type="file" onChange={fileOnChangeProject} />
                <UploadButton
                  type="submit"
                  onClick={(ev) => {
                    sendProjectImage(ev);
                    setProjectImage({});
                    setTitle("");
                    setDescription("");
                  }}
                >
                  upload
                </UploadButton>{" "}
              </ProjectInputForm>
              {projectsStatus === "projects-loaded" && (
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
              )}
            </ProjectsDiv>
          </MyAccountFullPage>
        </>
      )}
    </>
  );
};
// this is styled for desktop - need something for mobile

const Bio = styled.div`
  padding: 5px;
  background-color: var(--mint-green);
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
  background-color: var(--coral);
  &:hover {
    background-color: var(--lavender);
    cursor: pointer;
  }
`;

const CategoryLink = styled(Link)`
  padding: 5px;
`;

const ReasonLink = styled(Link)``;

const ConnectDiv = styled.div`
  background-color: var(--mint-green);
  margin-top: 20px;
  outline: none;
  border: none;
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

const Heading = styled.div`
  padding: 5px;
  background-color: var(--pale-yellow);
  margin-top: 20px;
  border: 1px solid var(--forest-green);
  color: var(--forest-green);
`;

const HoverDiv = styled.div`
  position: absolute;
  width: 200px;
  height: 50px;
  top: 125px;
  left: 50px;
  /* border: 1px solid black; */
`;

const IndividualProjectDiv = styled.div``;

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
  margin-top: 20px;
`;

const MyAccountDiv = styled.div`
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
const ProjectInputForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ProjectInputField = styled.textarea`
  width: 300px;
  height: 150px;
  margin-bottom: 20px;
`;

const ProjectInputFieldTitle = styled.textarea`
  width: 300px;
  height: 50px;
  margin: 10px;
`;

const ProjectUploadTitle = styled.h2`
  background-color: var(--coral);
  padding: 5px;
`;

const ProjectImg = styled.img`
  width: 100%;
`;
const ProjectsDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ProjectPicInput = styled.input`
  text-align: center;
  width: 200px;
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
  padding: 5px;
`;

const ProjectDescriptionDiv = styled.div`
  width: 100%;
  background-color: var(--mint-green);
  padding: 5px;
  font-size: 14px;
`;

const Pic = styled.img`
  height: 300px;
  width: 300px;
  border-radius: 50%;
  ${ProfilePicture}:hover & {
    opacity: 0.5;
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

const ReasonsDiv = styled.div`
  padding: 5px;
`;

const SignOutButton = styled.button`
  width: 150px;
  padding: 10px;
  background-color: var(--forest-green);
  color: var(--mint-green);
  outline: none;
  border: none;

  &: hover {
    cursor: pointer;
    background-color: var(--mint-green);
    color: var(--forest-green);
  }
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
const UpdateDiv = styled.div`
  /* height: 40px; */
  text-align: center;
  background-color: var(--mint-green);
  padding: 5px;
  ${HoverDiv}:hover & {
    display: none;
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

const WebInstaDiv = styled.div``;

const WebInstaLink = styled.div`
  padding: 5px;
  margin: 10px 0;
  background-color: var(--coral);
  width: 100%;
`;

export default MyAccount;
