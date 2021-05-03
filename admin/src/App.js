import React from "react";
import { BrowserRouter as Router, Switch } from "react-router-dom";
import Dashboard from "./components/dashboard";
import Email_verification from "./components/email-verification";
import Login from "./components/login";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";
import Logout from "./components/logout";
import Main from "./components/users/main";
import RegisteredUser from "./components/users/register-user";
import ActivesUsers from "./components/users/active-user";
import Admin from "./components/users/admin";

import "./App.css";

const AppDashboard = () => {
  return (
    <React.Fragment>
      <Router>
        <Switch>
          <PublicRoute exact="true" path="/" component={Login} />
          <PublicRoute exact="true" path="/login" component={Login} />
          <PublicRoute
            exact="true"
            path="/verify"
            component={Email_verification}
          />
          <PublicRoute exact="true" path="/logout" component={Logout} />
          <PrivateRoute exact="true" path="/dashboard" component={Dashboard} />
          <PrivateRoute
            exact="true"
            path="/users/registered"
            component={Main}
          />
          <PrivateRoute exact="true" path="/users/actives" component={Main} />
          <PrivateRoute exact="true" path="/users/admin" component={Main} />
        </Switch>
      </Router>
    </React.Fragment>
  );
};

export default AppDashboard;
