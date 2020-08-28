import React from "react";
import MobileHeader from "./MobileHeader";
import DesktopHeader from "./DesktopHeader";
import styled from "styled-components";

const Header = () => {
  return (
    <>
      <HeaderDiv>
        <MobileHeader />
        <DesktopHeader />
      </HeaderDiv>
      <SpacerDiv />
    </>
  );
};

const HeaderDiv = styled.div`
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 10;
`;

const SpacerDiv = styled.div`
  height: 100px;
  width: 100%;
`;

export default Header;
