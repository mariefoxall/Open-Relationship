import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import styled from "styled-components";
import {
  receiveUsers,
  resetFilters,
  updateCategory,
  updateReason,
} from "../actions";
import Header from "./Header";
import { getCurrentUserInfo } from "./reducers/currentuser.reducer";
import { getFilterCategory, getFilterReason } from "./reducers/filter.reducer";
import { getUsers } from "./reducers/users.reducer";
import OPENCAGE_API_KEY from "./secret";
import Loading from "./Loading";

const opencage = require("opencage-api-client");
require("dotenv").config();

const Scout = () => {
  const dispatch = useDispatch();

  const getPositionFromAddress = async (postal, country) => {
    console.log("hello i am in the function");
    const requestObj = {
      key: OPENCAGE_API_KEY,
      q: `${postal}, ${country}`,
    };
    return await opencage
      .geocode(requestObj)
      .then((data) => {
        console.log(data.results[0].geometry);
        return data.results[0].geometry;
      })
      .catch((error) => {
        return "error", error.message;
      });
  };

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

  const activeCategory = useSelector(getFilterCategory);
  const activeReason = useSelector(getFilterReason);
  const [activeDistance, setActiveDistance] = React.useState("anywhere");

  const toggleCategory = (ev) => {
    dispatch(updateCategory(ev.target.value));
  };

  const toggleReason = (ev) => {
    dispatch(updateReason(ev.target.value));
  };

  const resetAllFilters = (ev) => {
    dispatch(resetFilters());
  };

  const currentUserInfo = useSelector(getCurrentUserInfo);

  const [currentUserPosition, setCurrentUserPosition] = React.useState({});

  React.useEffect(() => {
    if (currentUserInfo) {
      getPositionFromAddress(
        currentUserInfo.contact.location.postal,
        currentUserInfo.contact.location.country
      ).then((position) => {
        setCurrentUserPosition(position);
      });
    }
  }, [currentUserInfo]);

  const getDistance = (pos1, pos2) => {
    var R = 6371; // Radius of the earth in km
    console.log(typeof pos2.lat);
    var dLat = deg2rad(Number(pos2.lat) - Number(pos1.lat)); // deg2rad below
    var dLon = deg2rad(Number(pos2.lng) - Number(pos1.lng));
    console.log("delta Lat and delta Long", dLat, dLon);
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(Number(pos1.lat))) *
        Math.cos(deg2rad(Number(pos2.lat))) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    console.log("d inside Haversine???????", d);
    return d;
  };

  function deg2rad(deg) {
    return deg * (Math.PI / 180);
  }

  const categoryFilterArray =
    activeCategory === "All"
      ? usersArray
      : usersArray.filter((user) => user.portfolio[activeCategory]);

  const reasonsFilterArray =
    activeReason === "All"
      ? categoryFilterArray
      : categoryFilterArray.filter((user) => user.reasons[activeReason]);

  let locationFilterArray = reasonsFilterArray;

  const userDistance = async (user, currentUserPosition) => {
    const thisUserPosition = await getPositionFromAddress(
      user.contact.location.postal,
      user.contact.location.country
    );
    return await getDistance(currentUserPosition, thisUserPosition);
  };

  const userPosition = async (user) => {
    return await getPositionFromAddress(
      user.contact.location.postal,
      user.contact.location.country
    );
  };

  let locationFilterArrayFive = [];
  let locationFilterArrayFifty = [];
  let locationFilterArrayHundred = [];
  for (const user of reasonsFilterArray) {
    userPosition(user)
      .then((position) => {
        console.log("position inside for of loop after then", position);
        console.log("currentUserPosition inside for of", currentUserPosition);
        return getDistance(position, currentUserPosition);
      })
      .then((distance) => {
        console.log("distance inside for of loop after then then", distance);
        if (distance < 100) {
          locationFilterArrayHundred.push(user);
        } else if (distance < 50) {
          locationFilterArrayFifty.push(user);
        } else if (distance < 5) {
          locationFilterArrayFive.push(user);
        }
      });
  }
  console.log("locationFilterArray", locationFilterArray);

  if (users && currentUserInfo) {
    if (activeDistance === "anywhere") {
      locationFilterArray = reasonsFilterArray;
    } else if (activeDistance === "myCountry") {
      locationFilterArray = reasonsFilterArray.filter((user) => {
        return (
          user.contact.location.country ===
          currentUserInfo.contact.location.country
        );
      });
    } else if (activeDistance === "100") {
      locationFilterArray = locationFilterArrayHundred;
    } else if (activeDistance === "50") {
      locationFilterArray = locationFilterArrayFifty;
    } else if (activeDistance === "5") {
      locationFilterArray = locationFilterArrayFive;
    }
  }

  console.log("locationFilterArray HERE IT IS", locationFilterArray);

  const locationStyle = currentUserInfo
    ? { display: "flex", margin: "10px", padding: "10px", alignItems: "center" }
    : { display: "none" };

  return (
    <>
      <Header />
      {usersStatus === "loading" && <Loading />}
      {usersStatus === "users-loaded" && (
        <ScoutPageDiv>
          <ScoutTitle>SCOUT NEW CONNECTIONS</ScoutTitle>
          <FiltersDiv>
            <CategoryDiv>
              <label htmlFor="category">who create:</label>
              <Dropdown
                onChange={(ev) => toggleCategory(ev)}
                defaultValue={activeCategory}
                id="category"
                name="category"
                placeholder="category"
              >
                <DropdownOption value="All">everything</DropdownOption>
                <DropdownOption value="accessories">accessories</DropdownOption>
                <DropdownOption value="animation">animation</DropdownOption>
                <DropdownOption value="ceramics">ceramics</DropdownOption>
                <DropdownOption value="clothing">clothing</DropdownOption>
                <DropdownOption value="film">film</DropdownOption>
                <DropdownOption value="graphicDesign">
                  graphic design
                </DropdownOption>
                <DropdownOption value="hair">hair</DropdownOption>
                <DropdownOption value="homeObjects">
                  home objects
                </DropdownOption>
                <DropdownOption value="illustration">
                  illustration
                </DropdownOption>
                <DropdownOption value="jewelry">jewelry</DropdownOption>
                <DropdownOption value="makeup">makeup</DropdownOption>
                <DropdownOption value="music">music</DropdownOption>
                <DropdownOption value="painting">painting</DropdownOption>
                <DropdownOption value="photography">photography</DropdownOption>
                <DropdownOption value="styling">styling</DropdownOption>
              </Dropdown>
            </CategoryDiv>
            <ReasonDiv>
              <label htmlFor="reason"> who are down for:</label>
              <Dropdown
                onChange={(ev) => toggleReason(ev)}
                defaultValue={activeReason}
                id="reason"
                name="reason"
                placeholder="reason"
              >
                <DropdownOption value="All">whatever</DropdownOption>
                <DropdownOption value="collaboration">
                  collaboration
                </DropdownOption>
                <DropdownOption value="trade">trade</DropdownOption>
                <DropdownOption value="connecting">connection</DropdownOption>
              </Dropdown>
            </ReasonDiv>
            <ReasonDiv style={locationStyle}>
              <label htmlFor="distance"> who are located:</label>
              <Dropdown
                onChange={(ev) => setActiveDistance(ev.target.value)}
                defaultValue={activeDistance}
                id="distance"
                name="distance"
                placeholder="distance"
              >
                <DropdownOption value="anywhere">anywhere</DropdownOption>
                <DropdownOption value="5">within 5km</DropdownOption>
                <DropdownOption value="50">within 50km</DropdownOption>
                <DropdownOption value="100">within 100km</DropdownOption>
                <DropdownOption value="myCountry">in my country</DropdownOption>
              </Dropdown>
            </ReasonDiv>
          </FiltersDiv>

          <ShowAllUsersDiv>
            {locationFilterArray.map((user) => {
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
          </ShowAllUsersDiv>
        </ScoutPageDiv>
      )}
      {/* import list of artists, make filters available */}
    </>
  );
};

const UserLink = styled(Link)`
  position: relative;
`;

const ScoutTitle = styled.h2`
  background-color: var(--coral);
  color: white;
  margin-top: 20px;
  padding: 10px;
`;

const ShowAllUsersDiv = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`;

const ScoutPageDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const UserDiv = styled.div`
  position: relative;
  margin: 20px;
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
  left: 20px;
  opacity: 0;
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

const Dropdown = styled.select`
  font-family: "Spartan";
  padding: 5px;
  margin: 10px;
  background-color: var(--forest-green);
  color: white;
`;

const CategoryDiv = styled.div`
  margin: 10px;
  padding: 10px;
  font-family: "Spartan";
  color: var(--coral);
`;

const ReasonDiv = styled.div`
  margin: 10px;
  padding: 10px;
  font-family: "Spartan";
  color: var(--coral);
`;

const FiltersDiv = styled.div`
  display: flex;
  justify-content: center;
`;

const DropdownOption = styled.option`
  background-color: var(--forest-green);
  &:hover {
    background-color: var(--coral);
  }
`;

export default Scout;
