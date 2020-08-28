import React from "react";
import Header from "./Header";
import { Link } from "react-router-dom";
import styled from "styled-components";

const Home = () => {
  return (
    <>
      <Header />
      <HomeWrapper>
        <Link to="/scout">SCOUT NEW CONNECTIONS</Link>
        <Link to="/login">LOGIN/SIGN UP</Link>
      </HomeWrapper>
    </>
  );
};

const HomeWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export default Home;
