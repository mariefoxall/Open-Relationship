import React from "react";

import styled from "styled-components";

const ApplicationToReview = (application) => {
  console.log(application);
  const thisApplication = application.application;

  const portfolioObject = thisApplication.portfolio;
  const portfolioAllArray = Object.entries(portfolioObject);
  console.log(portfolioAllArray);
  let thisPortfolioArray = [];
  portfolioAllArray.forEach((option) => {
    if (option[1]) {
      if (option[0] === "graphicDesign") {
        thisPortfolioArray.push("graphic design");
      } else if (option[0] === "homeObjects") {
        thisPortfolioArray.push("home objects");
      } else if (option[0] === "otherCategory") {
        thisPortfolioArray.push(option[1]);
      } else {
        thisPortfolioArray.push(option[0]);
      }
    }
  });

  const reasonsAllArray = Object.entries(thisApplication.reasons);
  let reasonsArray = [];
  reasonsAllArray.forEach((reason) => {
    if (reason[1]) {
      reasonsArray.push(reason[0]);
    }
  });
  return (
    <ApplicationReviewWrapper>
      <ApplicationSection>
        <ApplicationSubHeading>
          {thisApplication.contact.displayName}
        </ApplicationSubHeading>
        <div>
          <a
            target="blank"
            href={
              thisApplication.contact.instagram.includes("@")
                ? `http://instagram.com/${thisApplication.contact.instagram.slice(
                    1
                  )}`
                : `http://instagram.com/${thisApplication.contact.instagram}`
            }
          >
            INSTAGRAM
          </a>
        </div>
        <div>
          <a
            target="blank"
            href={
              thisApplication.contact.website.includes("http")
                ? thisApplication.contact.website
                : `http://${thisApplication.contact.website}`
            }
          >
            WEBSITE
          </a>
        </div>
      </ApplicationSection>
      <ApplicationSection>
        <ApplicationSubHeading>CATEGORY:</ApplicationSubHeading>
        {thisPortfolioArray.map((option) => {
          return <div key={option}>{option}</div>;
        })}
      </ApplicationSection>
      <ApplicationSection>
        <ApplicationSubHeading>BIO:</ApplicationSubHeading>
        <div>{thisApplication.longForm.bio}</div>
      </ApplicationSection>
      <ApplicationSection>
        <ApplicationSubHeading>FEELINGS:</ApplicationSubHeading>
        <div>{thisApplication.longForm.feelings}</div>
      </ApplicationSection>
      {thisApplication.longForm.identity && (
        <ApplicationSection>
          <ApplicationSubHeading>IDENTITY</ApplicationSubHeading>
          <div>{thisApplication.longForm.identity}</div>
        </ApplicationSection>
      )}
      <ApplicationSection>
        <ApplicationSubHeading>LOOKING FOR:</ApplicationSubHeading>
        {reasonsArray.map((reason) => {
          return <div key={reason}>{reason}</div>;
        })}
      </ApplicationSection>
    </ApplicationReviewWrapper>
  );
};

const ApplicationReviewWrapper = styled.div`
  background-color: white;
  padding: 10px;
  width: 400px;
`;

const ApplicationSubHeading = styled.h3`
  margin-bottom: 10px;
  background-color: var(--lavender);
  padding: 10px;
`;

const ApplicationSection = styled.div`
  margin-bottom: 20px;
  &:last-child {
    margin: 0;
  }
`;

export default ApplicationToReview;
