import React, { useEffect } from "react";
import Header from "./Header";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { receiveOutstandingApplications } from "../actions";
import {
  getApplications,
  numApplications,
} from "./reducers/application.reducer";
import ApplicationToReview from "./ApplicationToReview";
const ApplicationReview = () => {
  const dispatch = useDispatch();

  const [toggleRefresh, setToggleRefresh] = React.useState(false);

  const handleOutstandingApplications = () => {
    fetch("/api/view-outstanding-applications")
      .then((res) => res.json())
      .then((json) => {
        console.log(json);
        dispatch(receiveOutstandingApplications(json.data));
      });
  };
  React.useEffect(() => {
    handleOutstandingApplications();
  }, [toggleRefresh]);

  const outstandingApplicationsArray = useSelector(getApplications);
  console.log(outstandingApplicationsArray);

  const applicationStatus = useSelector((state) => state.application.status);
  console.log(applicationStatus);

  let pagesArray = [];

  const numPages = useSelector(numApplications);
  console.log("numPages", numPages);

  for (let i = 1; i <= numPages; i++) {
    pagesArray.push(i);
    //console.log("pagesArray: ", pagesArray);
  }
  const [currentPage, setCurrentPage] = React.useState(1);

  const goToPage = (pageNum) => {
    setCurrentPage(pageNum);
  };

  const currentApplication =
    outstandingApplicationsArray &&
    outstandingApplicationsArray[currentPage - 1];

  const itemsPerPageDisplay =
    numPages > 1 ? { visibility: "visible" } : { visibility: "hidden" };

  const handleApprove = (currentApplication) => {
    fetch("/api/approve-application", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: currentApplication.contact.email,
        _id: currentApplication._id,
      }),
    })
      .then((res) => res.json())
      .then((json) => {
        console.log(json);
        setToggleRefresh(!toggleRefresh);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleDeny = (currentApplication) => {
    fetch("/api/deny-application", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        _id: currentApplication._id,
      }),
    })
      .then((res) => res.json())
      .then((json) => {
        console.log(json);
        setToggleRefresh(!toggleRefresh);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <Header />
      {applicationStatus === "loading" ? (
        <div>LOADING</div>
      ) : (
        <PageWrapper>
          {numPages === 0 ? (
            <div>You're all up to date! No applications to review.</div>
          ) : (
            <>
              <div>
                <ApplicationNumber>
                  Application {currentPage} of{" "}
                  {outstandingApplicationsArray.length}
                </ApplicationNumber>
                <ApplicationToReview application={currentApplication} />
              </div>
              <ButtonSection>
                <InnerButtonDiv>
                  <ResponseButton
                    onClick={(ev) => {
                      ev.preventDefault();
                      handleApprove(currentApplication);
                      //do a put to change status of applicationApproved to true
                    }}
                  >
                    APPROVE
                  </ResponseButton>
                  <ResponseButton
                    onClick={(ev) => {
                      ev.preventDefault();
                      handleDeny(currentApplication);
                      //do a put to change status of applicationDenied to true
                    }}
                  >
                    DENY
                  </ResponseButton>
                </InnerButtonDiv>
              </ButtonSection>

              <PagesList style={itemsPerPageDisplay}>
                <PageNav
                  onClick={() => {
                    currentPage > 1 && goToPage(currentPage - 1);
                  }}
                >
                  PREV
                </PageNav>
                {pagesArray.map((pageNum) => {
                  return (
                    <PageNav
                      style={{
                        border:
                          currentPage === pageNum
                            ? "1px solid #006666"
                            : "none",
                      }}
                      key={pageNum}
                      onClick={() => goToPage(pageNum)}
                    >
                      {pageNum}
                    </PageNav>
                  );
                })}
                <PageNav
                  onClick={() => {
                    currentPage < pagesArray.length &&
                      goToPage(currentPage + 1);
                  }}
                >
                  NEXT
                </PageNav>
              </PagesList>
            </>
          )}
        </PageWrapper>
      )}
    </>
  );
};

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  /* height: calc(100vh - 100px); */
  background-color: #ffb366;
`;
const PagesList = styled.ul`
  background: var(--pale-yellow);
  display: flex;
  justify-content: space-between;
`;
const PageNav = styled.li`
  padding: 5px;
  &:hover {
    cursor: pointer;
    background-color: var(--lavender);
  }
`;

const ApplicationNumber = styled.div`
  text-align: center;
  margin-bottom: 20px;
`;

const ButtonSection = styled.div`
  width: 400px;
  background-color: white;
  padding: 10px;
  margin-bottom: 20px;
`;

const InnerButtonDiv = styled.div`
  display: flex;
  justify-content: space-between;
  background-color: var(--lavender);
  padding: 10px;
`;

const ResponseButton = styled.button`
  border: none;
  outline: none;
  background-color: var(--forest-green);
  color: var(--coral);
  padding: 10px;
  &:hover {
    background-color: var(--coral);
    color: var(--forest-green);
    cursor: pointer;
  }
`;

export default ApplicationReview;
