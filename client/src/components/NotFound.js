import React from "react";
import Header from "./Header";
import errorImg from "../assets/error404gifscreengrab.JPG";
import styled from "styled-components";

const NotFound = () => {
  return (
    <>
      <Header />
      <NotFoundWrapper>
        <NotFoundDiv>404 NOT FOUND</NotFoundDiv>
      </NotFoundWrapper>
    </>
  );
};
const NotFoundWrapper = styled.div`
  display: flex;
  height: calc(100vh - 100px);
  justify-content: center;
  align-items: center;
  background-image: linear-gradient(
    to bottom right,
    var(--lavender),
    var(--mint-green)
  );
`;

const NotFoundDiv = styled.div`
  height: calc(100vh - 100px);
  width: 100vw;
  background-image: url(${errorImg});
  background-size: contain;
  background-repeat: repeat;
`;

export default NotFound;
