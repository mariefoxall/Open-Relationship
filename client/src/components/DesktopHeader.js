import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import ORlogo from "../assets/ORlogo.png";
import { FiSearch } from "react-icons/fi";
import SearchBar from "./SearchBar";

const DesktopHeader = () => {
  return (
    <DesktopWrapper>
      <HomeLink to="/">
        <LogoImg
          src={ORlogo}
          alt="open relationship logo"
          style={{ borderRadius: "5px" }}
        />
      </HomeLink>
      <RightSide>
        <Search>
          <FiSearch size={20} />
          <SearchBar />
        </Search>
        <DesktopNav>
          <StyledLink to="/scout">SCOUT</StyledLink>
          <StyledLink to="/messaging">MESSAGES</StyledLink>
          <StyledLink to="/account">MY ACCOUNT</StyledLink>
        </DesktopNav>
      </RightSide>
    </DesktopWrapper>
  );
};
const RightSide = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-between;
`;

const DesktopWrapper = styled.div`
  display: none;
  @media (min-width: 640px) {
    display: flex;
    justify-content: space-between;
    background-color: #004d00;
    color: #ff0032;
    height: 100px;
    padding: 10px;
    box-sizing: border-box;
  }
`;

const LogoImg = styled.img`
  height: 80px;
  width: 80px;
`;

const HomeLink = styled(Link)``;

const DesktopNav = styled.nav`
  display: flex;
  color: #79d2a6;
  align-items: flex-end;
`;

const StyledLink = styled(Link)`
  margin-right: 20px;
  padding: 5px;
  color: var(--mint-green);
  &: hover {
    background-color: var(--lavender);
    color: var(--forest-green);
  }
  &: last-child {
    margin-right: 0;
  }
`;

const Search = styled.div`
  padding: 5px;
  color: var(--mint-green);
  &: hover {
    background-color: var(--pale-yellow);
    color: var(--forest-green);
  }
`;
export default DesktopHeader;
