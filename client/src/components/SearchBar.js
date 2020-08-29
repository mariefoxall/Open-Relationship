import React from "react";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import { getUsers } from "./reducers/users.reducer";
import { useSelector } from "react-redux";

const SearchBar = () => {
  const [searchInput, setSearchInput] = React.useState("");
  const [filteredSuggestions, setFilteredSuggestions] = React.useState([]);
  const [selectedSuggestion, setSelectedSuggestion] = React.useState(0);
  const [notAvailable, setNotAvailable] = React.useState(false);

  let history = useHistory();

  const seeProfile = (username) => {
    history.push(`/profile/${username}`);
  };

  const users = useSelector(getUsers);
  const usersArray = users !== null ? users : [];
  console.log("usersArray", usersArray);

  const usersStatus = useSelector((state) => state.users.status);

  const searchSuggestions = () => {
    let matchArray = [];
    if (searchInput.length > 1) {
      matchArray = usersArray.filter((user) =>
        user.username.toLowerCase().includes(searchInput.toLowerCase())
      );
    }
    setFilteredSuggestions(matchArray);
  };

  const isSelected = (index) => {
    return index === selectedSuggestion;
  };

  const selection = filteredSuggestions[selectedSuggestion];

  console.log(filteredSuggestions);

  return (
    <SearchBarDiv>
      <SearchBarInput
        type="text"
        value={searchInput}
        placeholder="Search for a specific user here"
        onChange={(ev) => {
          setSearchInput(ev.target.value);
          searchSuggestions();
        }}
        onKeyDown={(ev) => {
          switch (ev.key) {
            case "Enter":
              {
                filteredSuggestions.length > 0
                  ? seeProfile(selection.username)
                  : setNotAvailable(true);
              }
              return;
            case "ArrowUp":
              {
                if (selectedSuggestion > 0)
                  setSelectedSuggestion(selectedSuggestion - 1);
                console.log(selectedSuggestion);
              }
              return;
            case "ArrowDown":
              {
                if (selectedSuggestion < filteredSuggestions.length)
                  setSelectedSuggestion(selectedSuggestion + 1);
              }
              return;
          }
          return;
        }}
      />
      {filteredSuggestions.length > 0 ? (
        <SuggestionsDiv>
          {filteredSuggestions.map((user, index) => {
            const suggestedUsername = user.username;
            const firstHalf = suggestedUsername.slice(
              0,
              suggestedUsername.toLowerCase().indexOf(searchInput) +
                searchInput.length
            );
            const secondHalf = suggestedUsername.slice(firstHalf.length);
            return (
              <Suggestion
                key={user.username + index}
                onClick={() => {
                  console.log("onclick");
                  seeProfile(user.username);
                  setSearchInput("");
                  setFilteredSuggestions([]);
                }}
                active={isSelected(index).toString()}
                onMouseEnter={() => setSelectedSuggestion(index)}
              >
                <span>
                  {firstHalf}
                  <Prediction>{secondHalf}</Prediction>
                </span>
              </Suggestion>
            );
          })}
        </SuggestionsDiv>
      ) : (
        <>
          {searchInput.length > 2 && notAvailable && (
            <SuggestionsDiv>
              There are currently no products available for '{searchInput}'
            </SuggestionsDiv>
          )}
        </>
      )}
    </SearchBarDiv>
  );
};

const SearchBarDiv = styled.div`
  width: 200px;
  /* position: relative; */
`;

const Prediction = styled.span`
  font-weight: bold;
`;

const SearchBarInput = styled.input`
  /* width: 280 px; */
  height: 30px;
`;

const SuggestionsDiv = styled.div`
  position: absolute;
  top: 30px;
`;

const Suggestion = styled.div`
  z-index: 5;
  background-color: var(--pale-yellow);
  width: 185px;
  padding: 5px;
  &:hover {
    cursor: pointer;
    background-color: var(--lavender);
  }
`;

export default SearchBar;
