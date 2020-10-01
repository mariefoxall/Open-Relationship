import React from "react";
import styled from "styled-components";
import Header from "./Header";
import { useSelector, useDispatch } from "react-redux";
import { getNewUserDetails } from "./reducers/newuser.reducer";
import { Link, useHistory } from "react-router-dom";
import {
  newUserInfoConfirmed,
  usernameAlreadyExists,
  succesfullycreatedNewUser,
  userLoggedIn,
  loggingIn,
} from "../actions";
import OPENCAGE_API_KEY from "./secret";

const opencage = require("opencage-api-client");
require("dotenv").config();

const Signup = () => {
  const dispatch = useDispatch();
  let history = useHistory();

  const newUserDetails = useSelector(getNewUserDetails);
  const userStatus = useSelector((state) => state.newuser.status);
  console.log(newUserDetails);
  console.log(userStatus);

  //contact info
  const [displayName, setDisplayName] = React.useState("");
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [country, setCountry] = React.useState("");
  const [postal, setPostal] = React.useState("");
  const [geo, setGeo] = React.useState({});
  const [website, setWebsite] = React.useState("");
  const [instagram, setInstagram] = React.useState("");
  //portfolio options
  const [accessories, setAccessories] = React.useState(false);
  const [animation, setAnimation] = React.useState(false);
  const [ceramics, setCeramics] = React.useState(false);
  const [clothing, setClothing] = React.useState(false);
  const [film, setFilm] = React.useState(false);
  const [graphicDesign, setGraphicDesign] = React.useState(false);
  const [hair, setHair] = React.useState(false);
  const [homeObjects, setHomeObjects] = React.useState(false);
  const [illustration, setIllustration] = React.useState(false);

  const [jewelry, setJewelry] = React.useState(false);
  const [makeup, setMakeup] = React.useState(false);
  const [music, setMusic] = React.useState(false);
  const [painting, setPainting] = React.useState(false);
  const [photography, setPhotography] = React.useState(false);
  const [styling, setStyling] = React.useState(false);
  //long-form answers
  const [bio, setBio] = React.useState("");

  //reasons for joining
  const [collaboration, setCollaboration] = React.useState(false);
  const [trade, setTrade] = React.useState(false);
  const [connecting, setConnecting] = React.useState(false);

  //login info
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");

  const [charactersRemaining, setCharactersRemaining] = React.useState(500);

  const getPositionFromAddress = async (postal, country) => {
    const requestObj = {
      key: OPENCAGE_API_KEY,
      q: `${postal}, ${country}`,
    };
    return await opencage
      .geocode(requestObj)
      .then((data) => {
        console.log(data.results[0].geometry);
        setGeo(data.results[0].geometry);
        return data.results[0].geometry;
      })
      .catch((error) => {
        return "error", error.message;
      });
  };

  React.useEffect(() => {
    if (userStatus === "signing-up" && newUserDetails) {
      console.log(newUserDetails);
      const contact = newUserDetails.contact;
      const portfolio = newUserDetails.portfolio;
      const longForm = newUserDetails.longForm;
      const reasons = newUserDetails.reasons;

      getPositionFromAddress(contact.location.postal, contact.location.country);

      //contact info
      setDisplayName(contact.displayName);
      setFirstName(contact.fullName.firstName);
      setLastName(contact.fullName.lastName);
      setEmail(contact.email);
      setPhone(contact.phone);
      setCountry(contact.location.country);
      setPostal(contact.location.postal);
      setWebsite(contact.website);
      setInstagram(contact.instagram);
      //portfolio options
      setAccessories(portfolio.accessories);
      setAnimation(portfolio.animation);
      setCeramics(portfolio.ceramics);
      setClothing(portfolio.clothing);
      setFilm(portfolio.film);
      setGraphicDesign(portfolio.graphicDesign);
      setHair(portfolio.hair);
      setHomeObjects(portfolio.homeObjects);
      setIllustration(portfolio.illustration);
      setJewelry(portfolio.jewelry);
      setMakeup(portfolio.makeup);
      setMusic(portfolio.music);
      setPainting(portfolio.painting);
      setPhotography(portfolio.photography);
      setStyling(portfolio.styling);
      //long-form answers
      setBio(longForm.bio);

      //reasons for joining
      setCollaboration(reasons.collaboration);
      setTrade(reasons.trade);
      setConnecting(reasons.connecting);
    }
  }, [newUserDetails]);

  const handleConfirmNewUser = () => {
    fetch("/confirm-user", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email,
      }),
    })
      .then((res) => res.json())
      .then((json) => {
        console.log(json);
        if (json.data) {
          dispatch(newUserInfoConfirmed(json.data));
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleSignIn = () => {
    dispatch(loggingIn());
    //check if user exists in "users" collection
    //dispatch userLoggedIn (email, password)
    fetch("/verify-user-for-signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    })
      .then((res) => res.json())
      .then((json) => {
        console.log(json);
        dispatch(userLoggedIn(json.data));
        history.push("/myaccount");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleCreateNewUser = () => {
    fetch("/create-new-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contact: {
          displayName,
          fullName: { firstName, lastName },
          email,
          phone,
          location: { country, postal, geo },
          website,
          instagram,
        },
        portfolio: {
          accessories,
          animation,
          ceramics,
          clothing,
          film,
          graphicDesign,
          hair,
          homeObjects,
          illustration,
          jewelry,
          makeup,
          music,
          painting,
          photography,
          styling,
        },
        longForm: { bio },
        reasons: { collaboration, trade, connecting },
        username: username,
        password: password,
        profilePicURL:
          "http://res.cloudinary.com/open-relationship/image/upload/v1598655457/jwgpnljgfnhdntioscrj.png",
      }),
    })
      .then((res) => res.json())
      .then((json) => {
        console.log(json);
        if (json.status === 201) {
          if (json.usernameExists) {
            dispatch(usernameAlreadyExists());
          } else {
            dispatch(succesfullycreatedNewUser());
            handleSignIn();
            history.push("/myaccount");
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const usernameExistsStyle =
    userStatus === "username-already-exists"
      ? { display: "flex" }
      : { display: "none" };

  return (
    <>
      <Header />
      {userStatus === "signing-up" && newUserDetails && (
        <>
          <ApplicationFormPage>
            <WelcomeDiv>
              Welcome! Let's finish setting up your profile,{" "}
              {newUserDetails.contact.fullName.firstName}.
            </WelcomeDiv>
            <Section>
              <SectionHeading>DISPLAY NAME:</SectionHeading>
              <label htmlFor="displayName">(brand, artist name, etc.)</label>
              <div>
                <input
                  name="displayName"
                  id="displayName"
                  type="text"
                  value={displayName}
                  onChange={(ev) => setDisplayName(ev.target.value)}
                  required
                />
              </div>
            </Section>
            <Section>
              <SectionHeading>LOCATION:</SectionHeading>
              <label htmlFor="country">country</label>
              <input
                name="country"
                id="country"
                type="text"
                value={country}
                onChange={(ev) => setCountry(ev.target.value)}
                required
              />{" "}
              <label htmlFor="postal">postal code</label>
              <input
                name="postal"
                id="postal"
                type="text"
                value={postal}
                onChange={(ev) => setPostal(ev.target.value)}
                required
              />
            </Section>
            <Section>
              <SectionHeading>PRIMARY CONTACT:</SectionHeading>
              <label htmlFor="firstName">first name</label>
              <input
                name="firstName"
                id="firstName"
                type="text"
                value={firstName}
                onChange={(ev) => setFirstName(ev.target.value)}
                required
              />
              <label htmlFor="lastName">last name</label>
              <input
                name="lastName"
                id="lastName"
                type="text"
                value={lastName}
                onChange={(ev) => setLastName(ev.target.value)}
                required
              />
              <label htmlFor="email">email address</label>
              <input
                name="email"
                id="email"
                type="email"
                value={email}
                onChange={(ev) => setEmail(ev.target.value)}
                required
              />
              <label htmlFor="phone">phone number</label>
              <input
                name="phone"
                id="phone"
                type="tel"
                value={phone}
                placeholder="012-345-6789"
                pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                onChange={(ev) => setPhone(ev.target.value)}
                required
              />
            </Section>
            <Section>
              <SectionHeading>PUBLIC PROFILE:</SectionHeading>
              <label htmlFor="website">website</label>
              <input
                name="website"
                id="website"
                type="text"
                value={website}
                onChange={(ev) => setWebsite(ev.target.value)}
                required
              />{" "}
              <label htmlFor="instagram">instagram</label>
              <input
                name="instagram"
                id="instagram"
                type="text"
                value={instagram}
                onChange={(ev) => setInstagram(ev.target.value)}
                required
              />
            </Section>{" "}
            <Section>
              <SectionHeading>
                YOU ARE INTERESTED IN (select all that apply):
              </SectionHeading>
              <CheckboxDiv>
                <div>
                  <input
                    name="collaboration"
                    id="collaboration"
                    type="checkbox"
                    checked={collaboration}
                    value={collaboration}
                    onChange={(ev) => setCollaboration(!collaboration)}
                  />
                  <label htmlFor="collaboration">collaboration</label>
                </div>
                <div>
                  <input
                    name="trade"
                    id="trade"
                    type="checkbox"
                    checked={trade}
                    value={trade}
                    onChange={(ev) => setTrade(!trade)}
                  />
                  <label htmlFor="trade">trade</label>
                </div>
                <div>
                  <input
                    name="connecting"
                    id="connecting"
                    type="checkbox"
                    checked={connecting}
                    value={connecting}
                    onChange={(ev) => setConnecting(!connecting)}
                  />
                  <label htmlFor="connecting">
                    just, like, hanging out and meeting other creatives
                  </label>
                </div>
              </CheckboxDiv>
            </Section>
            <CheckboxSection>
              <SectionHeading>
                YOUR PORTFOLIO INCLUDES<br></br> (select all that apply):
              </SectionHeading>
              <CheckboxInner>
                <CheckboxDiv>
                  <div>
                    <input
                      name="accessories"
                      id="accessories"
                      type="checkbox"
                      checked={accessories}
                      value={accessories}
                      onChange={(ev) => setAccessories(!accessories)}
                    />
                    <label htmlFor="accessories">accessories</label>
                  </div>
                  <div>
                    <input
                      name="animation"
                      id="animation"
                      type="checkbox"
                      checked={animation}
                      value={animation}
                      onChange={(ev) => setAnimation(!animation)}
                    />
                    <label htmlFor="animation">animation</label>
                  </div>
                  <div>
                    <input
                      name="ceramics"
                      id="ceramics"
                      type="checkbox"
                      checked={ceramics}
                      value={ceramics}
                      onChange={(ev) => setCeramics(!ceramics)}
                    />
                    <label htmlFor="ceramics">ceramics</label>
                  </div>
                  <div>
                    <input
                      name="clothing"
                      id="clothing"
                      type="checkbox"
                      checked={clothing}
                      value={clothing}
                      onChange={(ev) => setClothing(!clothing)}
                    />
                    <label htmlFor="clothing">clothing</label>
                  </div>
                  <div>
                    <input
                      name="film"
                      id="film"
                      type="checkbox"
                      checked={film}
                      value={film}
                      onChange={(ev) => setFilm(!film)}
                    />
                    <label htmlFor="film">film</label>
                  </div>{" "}
                </CheckboxDiv>
                <CheckboxDiv>
                  <div>
                    <input
                      name="graphicDesign"
                      id="graphicDesign"
                      type="checkbox"
                      checked={graphicDesign}
                      value={graphicDesign}
                      onChange={(ev) => setGraphicDesign(!graphicDesign)}
                    />
                    <label htmlFor="graphicDesign">graphic design</label>{" "}
                  </div>
                  <div>
                    <input
                      name="hair"
                      id="hair"
                      type="checkbox"
                      checked={hair}
                      value={hair}
                      onChange={(ev) => setHair(!hair)}
                    />
                    <label htmlFor="hair">hair stylist</label>
                  </div>
                  <div>
                    <input
                      name="homeObjects"
                      id="homeObjects"
                      type="checkbox"
                      checked={homeObjects}
                      value={homeObjects}
                      onChange={(ev) => setHomeObjects(!homeObjects)}
                    />
                    <label htmlFor="homeObjects">home objects</label>
                  </div>
                  <div>
                    <input
                      name="illustration"
                      id="illustration"
                      type="checkbox"
                      checked={illustration}
                      value={illustration}
                      onChange={(ev) => setIllustration(!illustration)}
                    />
                    <label htmlFor="illustration">illustration</label>
                  </div>
                  <div>
                    <input
                      name="jewelry"
                      id="jewelry"
                      type="checkbox"
                      checked={jewelry}
                      value={jewelry}
                      onChange={(ev) => setJewelry(!jewelry)}
                    />
                    <label htmlFor="jewelry">jewelry</label>
                  </div>{" "}
                </CheckboxDiv>
                <CheckboxDiv>
                  <div>
                    {" "}
                    <input
                      name="makeup"
                      id="makeup"
                      type="checkbox"
                      checked={makeup}
                      value={makeup}
                      onChange={(ev) => setMakeup(!makeup)}
                    />
                    <label htmlFor="makeup">makeup artist</label>
                  </div>
                  <div>
                    <input
                      name="music"
                      id="music"
                      type="checkbox"
                      checked={music}
                      value={music}
                      onChange={(ev) => setMusic(!music)}
                    />
                    <label htmlFor="music">music</label>
                  </div>
                  <div>
                    <input
                      name="painting"
                      id="painting"
                      type="checkbox"
                      checked={painting}
                      value={painting}
                      onChange={(ev) => setPainting(!painting)}
                    />
                    <label htmlFor="painting">painting</label>
                  </div>
                  <div>
                    <input
                      name="photography"
                      id="photography"
                      type="checkbox"
                      checked={photography}
                      value={photography}
                      onChange={(ev) => setPhotography(!photography)}
                    />
                    <label htmlFor="photography">photography</label>
                  </div>
                  <div>
                    <input
                      name="styling"
                      id="styling"
                      type="checkbox"
                      checked={styling}
                      value={styling}
                      onChange={(ev) => setStyling(!styling)}
                    />
                    <label htmlFor="styling">styling</label>
                  </div>
                </CheckboxDiv>{" "}
              </CheckboxInner>
            </CheckboxSection>
            <Section>
              <SectionHeading>BIO</SectionHeading>
              <LongFormP>
                Max. 500 characters - please provide a description of your work
                and tell us your story!
              </LongFormP>
              <div>
                <LongFormText
                  name="bio"
                  id="bio"
                  type="text"
                  value={bio}
                  onChange={(ev) => {
                    setBio(ev.target.value);
                    setCharactersRemaining(500 - bio.length);
                  }}
                  required
                />
                <div>{charactersRemaining}</div>
              </div>
            </Section>
            <SubmitButton
              type="submit"
              onClick={(ev) => {
                ev.preventDefault();
                handleConfirmNewUser();
              }}
            >
              SUBMIT APPLICATION
            </SubmitButton>
          </ApplicationFormPage>
        </>
      )}
      {userStatus === "authentication-failed" && (
        <>
          <div>We can't find any info to match that secret code!</div>
          <Link to="/login">GO BACK</Link>
        </>
      )}
      {userStatus === "user-confirmed" && (
        <ApplicationFormPage>
          <WelcomeDiv>
            Thanks for confirming your details! Please set up your username and
            password to complete the account setup and sign in. To make any
            further changes to your account, please sign in and do so in "My
            Account".
          </WelcomeDiv>
          {/* <form> */} <label htmlFor="username">username:</label>
          <input
            name="username"
            id="username"
            type="text"
            value={username}
            onChange={(ev) => setUsername(ev.target.value)}
          />
          <label htmlFor="password">password:</label>
          <input
            name="password"
            id="password"
            type="password"
            value={password}
            onChange={(ev) => setPassword(ev.target.value)}
          />
          <SubmitButton
            type="submit"
            onClick={(ev) => {
              ev.preventDefault();
              handleCreateNewUser();
            }}
          >
            SIGN UP
          </SubmitButton>
          <UsernameDiv style={usernameExistsStyle}>
            This username is already in play. Please choose a new one!
          </UsernameDiv>
        </ApplicationFormPage>
      )}
    </>
  );
};

const ApplicationFormPage = styled.form`
  background-color: var(--mint-green);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const SmallDiv = styled.div`
  background-color: var(--pale-yellow);
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  margin-top: 10px;
  max-width: 500px;
`;

const Section = styled.fieldset`
  background-color: var(--pale-yellow);
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  margin-top: 10px;
  max-width: 500px;
`;

const WelcomeDiv = styled.div`
  background-color: var(--coral);
  padding: 10px;
  text-align: center;
  margin-top: 10px;
  max-width: 500px;
`;

const CheckboxSection = styled.fieldset`
  background-color: var(--pale-yellow);
  padding: 10px;
  margin-top: 10px;
  display: flex;
  justify-content: center;
  text-align: center;
`;

const SectionHeading = styled.legend`
  background-color: var(--lavender);
  padding: 5px;
`;

const CheckboxDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-right: 20px;
  &: last-child {
    margin-right: 0;
  }
`;

const CheckboxInner = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const LongFormText = styled.textarea`
  height: 200px;
  width: 300px;
`;

const LongFormLabel = styled.label`
  padding: 5px;
  background-color: var(--coral);
  margin-top: 10px;
`;

const LongFormP = styled.p`
  padding: 5px;
  border: 1px solid var(--coral);
  margin-bottom: 10px;
`;

const SubmitButton = styled.button`
  padding: 10px;
  background-color: var(--coral);
  outline: none;
  border: none;
  margin-top: 20px;
  font-size: 18px;

  &: hover {
    cursor: pointer;
    background-color: var(--lavender);
  }
`;

const UsernameDiv = styled.div`
  color: red;
  margin-top: 10px;
`;

export default Signup;
