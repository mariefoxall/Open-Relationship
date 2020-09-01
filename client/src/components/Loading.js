import React from "react";

import styled, { keyframes } from "styled-components";

import ORlogo from "../assets/ORlogo.png";

const Loading = () => {
  return (
    <Wrapper>
      <IMG src={ORlogo} />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: calc(100vh - 100px);
`;

const scale = keyframes`
  from {
  padding: 95px;
  }
  to {
    padding: 5px;
  }`;

const spin = keyframes`
from {
transform: rotate(0deg);
}
to {
  transform: rotate(2000deg);
}`;

const fade = keyframes`
  from {
opacity:0.7
  }
  to {
  opacity:0
  }`;

const IMG = styled.img`
  width: 200px;
  opacity: 0.6;
  box-sizing: border-box;
  animation: ${scale} 5000ms infinite linear, ${fade} 2000ms infinite linear,
    ${spin} 5000ms infinite linear;
  /* animation: ${spin} 3000ms infinite linear, ${fade} 3000ms infinite linear; */
`;

export default Loading;
