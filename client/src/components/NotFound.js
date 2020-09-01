import React from "react";
import Header from "./Header";
import xRay from "../assets/Xray.gif";
import styled from "styled-components";

const NotFound = () => {
  return (
    <>
      <Header />
      <NotFoundDiv>404 NOT FOUND</NotFoundDiv>
    </>
  );
};

const NotFoundDiv = styled.div`
  height: calc(100vh - 100px);
  width: 100vw;
  background-image: url(${xRay});
  background-size: contain;
  background-repeat: repeat;
`;

export default NotFound;
