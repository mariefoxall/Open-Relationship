import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import GlobalStyles from "./GlobalStyles";
import ApplicationForm from "./ApplicationForm";
import Home from "./Home";

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
        </Switch>
      </Router>
      {/* <div>IT BEGINS</div> */}
    </>
  );
}

export default App;
