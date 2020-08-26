import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import GlobalStyles from "./GlobalStyles";
import ApplicationForm from "./ApplicationForm";
import Home from "./Home";
import Scout from "./Scout";
import Account from "./Account";
import ApplicationReview from "./ApplicationReview";
import Login from "./Login";
import Signup from "./Signup";
import NotFound from "./NotFound";

function App() {
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
          <Route path="/myaccount">
            <Account />
          </Route>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/signup">
            <Signup />
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
