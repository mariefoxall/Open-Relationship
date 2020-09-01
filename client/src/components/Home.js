import React from "react";
import Header from "./Header";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { getProjects } from "./reducers/projects.reducer";
import Loading from "./Loading";
import squiggly from "../assets/squiggly.jpg";

const Home = () => {
  const allProjects = useSelector(getProjects);
  const projectsStatus = useSelector((state) => state.projects.status);

  let featuredProjects = [];
  if (allProjects) {
    featuredProjects.push(allProjects[0]);
    featuredProjects.push(allProjects[3]);
    featuredProjects.push(allProjects[2]);
  }

  console.log("allProjects in Home Page", allProjects);
  console.log("featuredProjects in Home Page", featuredProjects);

  return (
    <>
      <Header />
      <HomeWrapper>
        <StyledLink to="/scout">SCOUT NEW CONNECTIONS</StyledLink>
        <StyledLink to="/login">LOGIN/SIGN UP</StyledLink>
        <FeaturedProjectsDiv>
          {projectsStatus === "loading" && <Loading />}
          {projectsStatus === "projects-loaded" && (
            <>
              {featuredProjects.map((project) => {
                return (
                  <UserLink
                    exact
                    to={`/profile/${project.username}`}
                    key={project._id}
                  >
                    <HoverDiv>{project.username}</HoverDiv>
                    <ProjectImg src={project.projectPicURL} />
                    <ProjectTitleDiv>{project.projectTitle}</ProjectTitleDiv>
                  </UserLink>
                );
              })}
            </>
          )}
        </FeaturedProjectsDiv>
      </HomeWrapper>
    </>
  );
};

const HomeWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-image: linear-gradient(
    to bottom right,
    var(--lavender),
    var(--mint-green)
  );
`;

const StyledLink = styled(Link)`
  padding: 20px;
  margin: 20px;
  background-color: var(--coral);
  font-size: 20px;
  font-weight: bold;
  color: white;

  &:hover {
    background-color: var(--mint-green);
  }
`;

const FeaturedProjectsDiv = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  padding: 20px;
  @media (min-width: 640px) {
    max-width: 70%;
  }
`;

const UserLink = styled(Link)`
  width: 300px;
  margin: 20px;
  position: relative;
`;

const ProjectImg = styled.img`
  width: 100%;
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

const HoverDiv = styled.div`
  height: 300px;
  width: 300px;
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
  z-index: 10;
  background-color: var(--forest-green);
  color: white;
  ${UserLink}:hover & {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    opacity: 0.8;
  }
`;

export default Home;
