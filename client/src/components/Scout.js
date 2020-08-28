import React from "react";
import Header from "./Header";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { getUsers } from "./reducers/users.reducer";
import { useSelector, useDispatch } from "react-redux";
import { receiveUsers } from "../actions";

const Scout = () => {
  const dispatch = useDispatch();

  const handleUsers = () => {
    fetch("/users")
      .then((res) => res.json())
      .then((json) => {
        dispatch(receiveUsers(json.users));
      })
      .catch((error) => console.log(error));
  };

  React.useEffect(() => {
    handleUsers();
  }, []);

  let users = useSelector(getUsers);
  const usersArray = users !== null ? users : [];
  console.log("usersArray", usersArray);

  const usersStatus = useSelector((state) => state.users.status);

  return (
    <>
      <Header />
      {usersStatus === "loading" && <div>LOADING...</div>}
      {usersStatus === "users-loaded" && (
        <ScoutPageDiv>
          {usersArray.map((user) => {
            return (
              <UserLink key={user._id} to={`/profile/${user.username}`}>
                <UserDiv>
                  <UserIMG
                    src={user.profilePicURL}
                    alt={`profile pic for ${user.username}`}
                  />
                  <Name>
                    <h2>{user.username}</h2>
                  </Name>
                </UserDiv>
                <HoverDiv>
                  {Object.entries(user.portfolio)
                    .filter((option) => option[1])
                    .map((option) => {
                      return (
                        <div key={option[0]}>
                          {option[0] === "graphicDesign" && (
                            <Category>graphic design</Category>
                          )}
                          {option[0] === "homeObjects" && (
                            <Category>home objects</Category>
                          )}
                          {option[0] !== "graphicDesign" &&
                            option[0] !== "homeObjects" && (
                              <Category>{option[0]}</Category>
                            )}
                        </div>
                      );
                    })}
                </HoverDiv>
              </UserLink>
            );
          })}
        </ScoutPageDiv>
      )}
      {/* import list of artists, make filters available */}
    </>
  );
};

const UserLink = styled(Link)`
  position: relative;
`;

const ScoutPageDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const UserDiv = styled.div`
  position: relative;
  margin-top: 20px;
  height: 300px;
  width: 300px;
`;
const UserIMG = styled.img`
  height: 300px;
  width: 300px;
`;

const Name = styled.div`
  width: 300px;
  height: 40px;
  position: absolute;
  top: 0;
  left: 0;
  padding: 5px;
  background-color: var(--coral);
  color: white;
  opacity: 0.8;
`;

const Category = styled.div`
  padding: 5px;
`;

const HoverDiv = styled.div`
  height: 260px;
  width: 300px;
  position: absolute;
  top: 60px;
  left: 0;
  opacity: 0;
  background-color: var(--forest-green);
  color: white;
  ${UserLink}: hover & {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    opacity: 0.8;
  }
`;

export default Scout;
