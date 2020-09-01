import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import GlobalStyles from "./GlobalStyles";
import ApplicationForm from "./ApplicationForm";
import Home from "./Home";
import Scout from "./Scout";
import MyAccount from "./MyAccount";
import ApplicationReview from "./ApplicationReview";
import Login from "./Login";
import Signup from "./Signup";
import NotFound from "./NotFound";
import Profile from "./Profile";
import { useDispatch, useSelector } from "react-redux";
import { receiveUsers, receiveProjects } from "../actions";
import Messages from "./Messages";

function App() {
  const dispatch = useDispatch();

  const handleUsers = () => {
    fetch("/users")
      .then((res) => res.json())
      .then((json) => {
        dispatch(receiveUsers(json.users));
      })
      .catch((error) => console.log(error));
  };

  const handleProjects = () => {
    fetch("/projects")
      .then((res) => res.json())
      .then((json) => {
        dispatch(receiveProjects(json.allProjects));
      })
      .catch((error) => console.log(error));
  };

  React.useEffect(() => {
    handleUsers();
    handleProjects();
  }, []);

  return (
    <>
      <GlobalStyles />
      <Router>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/applicationform">
            <ApplicationForm />
          </Route>
          <Route path="/applicationreview">
            <ApplicationReview />
          </Route>
          <Route path="/scout">
            <Scout />
          </Route>
          <Route path="/messages">
            <Messages />
          </Route>
          <Route path="/myaccount">
            <MyAccount />
          </Route>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/signup">
            <Signup />
          </Route>
          <Route path="/profile/:username">
            <Profile />
          </Route>
          <Route path="">
            <NotFound />
          </Route>
        </Switch>
      </Router>
      {/* <div>IT BEGINS</div> */}
    </>
  );
}

export default App;
