import React from "react";
import styled from "styled-components";
import Header from "./Header";
import { useSelector, useDispatch } from "react-redux";
import { getNewUserDetails } from "./reducers/user.reducer";
import { Link, useHistory } from "react-router-dom";
import {
  newUserInfoConfirmed,
  userAlreadyExists,
  succesfullycreatedNewUser,
  userLoggedIn,
} from "../actions";

const Signup = () => {
  const dispatch = useDispatch();
  let history = useHistory();

  const newUserDetails = useSelector(getNewUserDetails);
  const userStatus = useSelector((state) => state.user.status);
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
  const [jewelry, setJewelry] = React.useState(false);
  const [makeup, setMakeup] = React.useState(false);
  const [music, setMusic] = React.useState(false);
  const [painting, setPainting] = React.useState(false);
  const [photography, setPhotography] = React.useState(false);
  const [styling, setStyling] = React.useState(false);
  const [otherCategory, setOtherCategory] = React.useState("");
  //long-form answers
  const [bio, setBio] = React.useState("");
  const [feelings, setFeelings] = React.useState("");
  const [identity, setIdentity] = React.useState("");

  //reasons for joining
  const [collaboration, setCollaboration] = React.useState(false);
  const [trade, setTrade] = React.useState(false);
  const [connecting, setConnecting] = React.useState(false);

  //login info
  const [password, setPassword] = React.useState("");

  //edit variable
  const [editNumber, setEditNumber] = React.useState(0);

  React.useEffect(() => {
    if (userStatus === "signing-up" && newUserDetails) {
      console.log(newUserDetails);
      const contact = newUserDetails.contact;
      const portfolio = newUserDetails.portfolio;
      const longForm = newUserDetails.longForm;
      const reasons = newUserDetails.reasons;

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
      setJewelry(portfolio.jewelry);
      setMakeup(portfolio.makeup);
      setMusic(portfolio.music);
      setPainting(portfolio.painting);
      setPhotography(portfolio.photography);
      setStyling(portfolio.styling);
      setOtherCategory(portfolio.otherCategory);
      //long-form answers
      setBio(longForm.bio);
      setFeelings(longForm.feelings);
      setIdentity(longForm.identity);

      //reasons for joining
      setCollaboration(reasons.collaboration);
      setTrade(reasons.trade);
      setConnecting(reasons.connecting);

      //editNumber
      if (newUserDetails.editNumber) {
        setEditNumber(Number(newUserDetails.editNumber) + 1);
      } else {
        setEditNumber(1);
      }
    }
  }, [newUserDetails]);

  const handleConfirmNewUserDetails = () => {
    fetch("/api/confirm-user-details", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contact: {
          displayName,
          fullName: { firstName, lastName },
          email,
          phone,
          location: { country, postal },
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
          jewelry,
          makeup,
          music,
          painting,
          photography,
          styling,
          otherCategory,
        },
        longForm: { bio, feelings, identity },
        reasons: { collaboration, trade, connecting },
        editNumber,
        signUpCode: "",
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

  const handleCreateNewUser = () => {
    fetch("/api/create-new-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    })
      .then((res) => res.json())
      .then((json) => {
        console.log(json);
        if (json.status === 201) {
          if (json.userExists) {
            dispatch(userAlreadyExists());
          } else {
            dispatch(succesfullycreatedNewUser());
            dispatch(userLoggedIn(json.data));
            history.push("/account");
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <Header />
      {userStatus === "signing-up" && newUserDetails && (
        <>
          <div>
            Welcome! Let's finish setting up your profile,{" "}
            {newUserDetails.contact.fullName.firstName}.
          </div>
          <form>
            <label htmlFor="displayName">DISPLAY NAME:</label>
            <input
              name="displayName"
              id="displayName"
              type="text"
              value={displayName}
              onChange={(ev) => setDisplayName(ev.target.value)}
              required
            />
            <fieldset>
              <legend>LOCATION:</legend>
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
            </fieldset>

            <fieldset>
              <legend>PRIMARY CONTACT:</legend>
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
            </fieldset>

            <fieldset>
              <legend>PUBLIC PROFILE:</legend>
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
            </fieldset>
            <fieldset>
              <legend>YOUR PORTFOLIO INCLUDES (select all that apply)</legend>
              <input
                name="accessories"
                id="accessories"
                type="checkbox"
                checked={accessories}
                value={accessories}
                onChange={(ev) => setAccessories(!accessories)}
              />
              <label htmlFor="accessories">accessories</label>
              <br />
              <input
                name="animation"
                id="animation"
                type="checkbox"
                checked={animation}
                value={animation}
                onChange={(ev) => setAnimation(!animation)}
              />
              <label htmlFor="animation">animation</label>
              <br />
              <input
                name="ceramics"
                id="ceramics"
                type="checkbox"
                checked={ceramics}
                value={ceramics}
                onChange={(ev) => setCeramics(!ceramics)}
              />
              <label htmlFor="ceramics">ceramics</label>
              <br />
              <input
                name="clothing"
                id="clothing"
                type="checkbox"
                checked={clothing}
                value={clothing}
                onChange={(ev) => setClothing(!clothing)}
              />
              <label htmlFor="clothing">clothing</label>
              <br />
              <input
                name="film"
                id="film"
                type="checkbox"
                checked={film}
                value={film}
                onChange={(ev) => setFilm(!film)}
              />
              <label htmlFor="film">film</label>
              <br />
              <input
                name="graphicDesign"
                id="graphicDesign"
                type="checkbox"
                checked={graphicDesign}
                value={graphicDesign}
                onChange={(ev) => setGraphicDesign(!graphicDesign)}
              />
              <label htmlFor="graphicDesign">graphic design</label> <br />
              <input
                name="hair"
                id="hair"
                type="checkbox"
                checked={hair}
                value={hair}
                onChange={(ev) => setHair(!hair)}
              />
              <label htmlFor="hair">hair stylist</label>
              <br />
              <input
                name="homeObjects"
                id="homeObjects"
                type="checkbox"
                checked={homeObjects}
                value={homeObjects}
                onChange={(ev) => setHomeObjects(!homeObjects)}
              />
              <label htmlFor="homeObjects">home objects</label>
              <br />
              <input
                name="jewelry"
                id="jewelry"
                type="checkbox"
                checked={jewelry}
                value={jewelry}
                onChange={(ev) => setJewelry(!jewelry)}
              />
              <label htmlFor="jewelry">jewelry</label>
              <br />{" "}
              <input
                name="makeup"
                id="makeup"
                type="checkbox"
                checked={makeup}
                value={makeup}
                onChange={(ev) => setMakeup(!makeup)}
              />
              <label htmlFor="makeup">makeup artist</label>
              <br />
              <input
                name="music"
                id="music"
                type="checkbox"
                checked={music}
                value={music}
                onChange={(ev) => setMusic(!music)}
              />
              <label htmlFor="music">music</label>
              <br />
              <input
                name="painting"
                id="painting"
                type="checkbox"
                checked={painting}
                value={painting}
                onChange={(ev) => setPainting(!painting)}
              />
              <label htmlFor="painting">painting</label>
              <br />
              <input
                name="photography"
                id="photography"
                type="checkbox"
                checked={photography}
                value={photography}
                onChange={(ev) => setPhotography(!photography)}
              />
              <label htmlFor="photography">photography</label>
              <br />
              <input
                name="styling"
                id="styling"
                type="checkbox"
                checked={styling}
                value={styling}
                onChange={(ev) => setStyling(!styling)}
              />
              <label htmlFor="styling">styling</label>
              <br />
              <label htmlFor="otherCategory">other:</label>
              <input
                name="otherCategory"
                id="otherCategory"
                type="text"
                value={otherCategory}
                onChange={(ev) => setOtherCategory(ev.target.value)}
              />
            </fieldset>
            <fieldset>
              <legend>DETAILS</legend>
              <label htmlFor="bio">BIO:</label>
              <textarea
                name="bio"
                id="bio"
                type="text"
                value={bio}
                onChange={(ev) => setBio(ev.target.value)}
                required
              />
              <p>
                Max. 500 characters - please provide a description of your work
                and tell us your story!
              </p>
              <label htmlFor="feelings">FEELINGS:</label>
              <textarea
                name="feelings"
                id="feelings"
                type="text"
                value={feelings}
                onChange={(ev) => setFeelings(ev.target.value)}
                required
              />
              <p>What does connection with other creatives mean to you?</p>
              <label htmlFor="identity">IDENTITY:</label>
              <textarea
                name="identity"
                id="identity"
                type="text"
                value={identity}
                onChange={(ev) => setIdentity(ev.target.value)}
              />
              <p>
                We want to ensure diverse and balanced representation in our
                community of creatives. If you feel comfortable, please let us
                know if you identify as LGBTQIA2S+, BIPOC or any other personal
                identity that you'd like to let us know about!
              </p>
            </fieldset>
            <fieldset>
              <legend>YOU ARE INTERESTED IN (select all that apply):</legend>
              <input
                name="collaboration"
                id="collaboration"
                type="checkbox"
                checked={collaboration}
                value={collaboration}
                onChange={(ev) => setCollaboration(!collaboration)}
              />
              <label htmlFor="collaboration">collaboration</label>
              <br />
              <input
                name="trade"
                id="trade"
                type="checkbox"
                checked={trade}
                value={trade}
                onChange={(ev) => setTrade(!trade)}
              />
              <label htmlFor="trade">trade</label>
              <br />
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
              <br />
            </fieldset>
            <button
              type="submit"
              onClick={(ev) => {
                ev.preventDefault();
                handleConfirmNewUserDetails();
              }}
            >
              CONFIRM
            </button>
          </form>
        </>
      )}
      {userStatus === "authentication-failed" && (
        <>
          <div>We can't find any info to match that secret code!</div>
          <Link to="/login">GO BACK</Link>
        </>
      )}
      {userStatus === "user-confirmed" && (
        <>
          <div>
            Thanks for confirming your details! Please set up your password to
            complete the account setup and sign in. To make any further changes
            to your account, please sign in and do so in "My account".
          </div>
          <div>username: {newUserDetails.contact.email}</div>
          <div>
            <form>
              <label htmlFor="password">password:</label>
              <input
                name="password"
                id="password"
                type="password"
                value={password}
                onChange={(ev) => setPassword(ev.target.value)}
              />
              <button
                type="submit"
                onClick={(ev) => {
                  ev.preventDefault();
                  handleCreateNewUser();
                }}
              >
                SIGN UP
              </button>
            </form>
          </div>
        </>
      )}
      {userStatus === "user-already-exists" && (
        <>
          <div>
            A user account already exists for this email address, please use a
            new one!
          </div>
          <Link to="/login">GO BACK</Link>
        </>
      )}
    </>
  );
};

export default Signup;
