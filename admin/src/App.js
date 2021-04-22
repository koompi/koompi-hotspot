import React from "react";
import { BrowserRouter as Router, Switch } from "react-router-dom";
import Dashboard from "./components/dashboard";
import Email_verification from "./components/email-verification";
import Login from "./components/login";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";
import Logout from "./components/logout";

import "./App.css";

const AppDashboard = () => {
  return (
    <React.Fragment>
      <Router>
        <Switch>
          <PublicRoute exact path="/" component={Login} />
          <PublicRoute exact path="/login" component={Login} />
          <PublicRoute exact path="/verify" component={Email_verification} />
          <PublicRoute exact path="/logout" component={Logout} />
          <PrivateRoute exact path="/dashboard" component={Dashboard} />
        </Switch>
      </Router>
    </React.Fragment>
  );
};

export default AppDashboard;
