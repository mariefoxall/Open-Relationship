import React from "react";
import styled from "styled-components";
import Header from "./Header";
import { useSelector } from "react-redux";
import { getCurrentUser } from "./reducers/currentuser.reducer";

const Account = () => {
  const currentUserEmail = useSelector(getCurrentUser);
  // if (currentUser) {
  console.log(currentUserEmail);
  // }

  const getUserDetails = () => {
    fetch("/api/get-user-details", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: currentUserEmail }),
    })
      .then((res) => res.json())
      .then((json) => {
        console.log(json);
      });
  };

  React.useEffect(() => {
    getUserDetails();
  }, []);

  return (
    <>
      <Header />
      <div>Your Name</div>
      <div>Your Profile Image</div>
      <div>Featured Project</div>
      <div>Add New Project</div>
    </>
  );
};

export default Account;
