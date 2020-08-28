import React from "react";
import styled from "styled-components";
import Header from "./Header";

const ApplicationForm = () => {
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

  //status of application request
  const [applicationStatus, setApplicationStatus] = React.useState("pending");
  console.log(applicationStatus);

  const [charactersRemaining, setCharactersRemaining] = React.useState(500);

  return (
    <>
      <Header />
      {applicationStatus === "pending" && (
        <ApplicationFormPage
          onSubmit={(ev) => {
            ev.preventDefault();
            fetch("/submit-application", {
              method: "POST",
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
                applicationApproved: false,
                applicationDenied: false,
              }),
            })
              .then((res) => res.json())
              .then((json) => {
                console.log(json);
                if (json.status === 201) {
                  json.applicationExists
                    ? setApplicationStatus("duplicate")
                    : setApplicationStatus("success");
                }
              })
              .catch((error) => {
                console.log(error);
              });
          }}
        >
          {" "}
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
                    value={homeObjects}
                    onChange={(ev) => setHomeObjects(!homeObjects)}
                  />
                  <label htmlFor="homeObjects">home objects</label>
                </div>
                <div>
                  <input
                    name="jewelry"
                    id="jewelry"
                    type="checkbox"
                    value={jewelry}
                    onChange={(ev) => setJewelry(!jewelry)}
                  />
                  <label htmlFor="jewelry">jewelry</label>
                </div>
                <div>
                  {" "}
                  <input
                    name="makeup"
                    id="makeup"
                    type="checkbox"
                    value={makeup}
                    onChange={(ev) => setMakeup(!makeup)}
                  />
                  <label htmlFor="makeup">makeup artist</label>
                </div>
              </CheckboxDiv>
              <CheckboxDiv>
                <div>
                  <input
                    name="music"
                    id="music"
                    type="checkbox"
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
                    value={styling}
                    onChange={(ev) => setStyling(!styling)}
                  />
                  <label htmlFor="styling">styling</label>
                </div>
                <div>
                  <label htmlFor="otherCategory">other:</label>
                  <input
                    name="otherCategory"
                    id="otherCategory"
                    type="text"
                    value={otherCategory}
                    onChange={(ev) => setOtherCategory(ev.target.value)}
                  />
                </div>
              </CheckboxDiv>{" "}
            </CheckboxInner>
          </CheckboxSection>
          <Section>
            <SectionHeading>DETAILS</SectionHeading>
            <LongFormLabel htmlFor="bio">BIO:</LongFormLabel>
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
            <LongFormLabel htmlFor="feelings">FEELINGS:</LongFormLabel>
            <LongFormP>
              What does connection with other creatives mean to you?
            </LongFormP>
            <div>
              <LongFormText
                name="feelings"
                id="feelings"
                type="text"
                value={feelings}
                onChange={(ev) => setFeelings(ev.target.value)}
                required
              />
            </div>
            <LongFormLabel htmlFor="identity">IDENTITY:</LongFormLabel>
            <LongFormP>
              We want to ensure diverse and balanced representation in our
              community of creatives. If you feel comfortable, please share
              whether you identify as LGBTQIA2S+, BIPOC or any other personal
              identity that you'd like to let us know about!
            </LongFormP>
            <div>
              <LongFormText
                name="identity"
                id="identity"
                type="text"
                value={identity}
                onChange={(ev) => setIdentity(ev.target.value)}
              />
            </div>
          </Section>
          <SubmitButton type="submit">SUBMIT APPLICATION</SubmitButton>
        </ApplicationFormPage>
      )}
      {applicationStatus === "duplicate" && (
        <ApplicationFormPage>
          <SmallDiv>
            <p>
              Hi {firstName}, we already have an application for your email
              address, {email}.
            </p>
            <p>
              Please hold tight, we will review it and get back to you soon!
            </p>
          </SmallDiv>{" "}
        </ApplicationFormPage>
      )}
      {applicationStatus === "success" && (
        <ApplicationFormPage>
          <SmallDiv>
            Thanks {firstName}! We have received your application. Our team will
            review it and get back to you soon :)
          </SmallDiv>
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

export default ApplicationForm;
