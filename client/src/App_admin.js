import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

// import Navbar from "./admin/components/layout/navbar/Navbar";
// import Main from "./admin/components/pages/main/Main";
// import Sidebar from "./admin/components/layout/sidebar/Sidebar";
import Dashboard from "./admin/index";
import ConfirmAdmin from "./admin/user/email-verification";
import Login from "./admin/user/login";
import PrivateRoute from "./admin/PrivateRoute";
import PublicRoute from "./admin/PublicRoute";

import "./App.css";
import "./assets/css/App.css";

const AppDashboard = () => {
  return (
    <React.Fragment>
      <Router>
        <Switch>
          <Route exact path="/admin/" restrict={true} component={Login} />
          <PublicRoute
            exact
            path="/admin/login"
            restrict={true}
            component={Login}
          />
          <PrivateRoute
            exact
            path="/admin/login/confirm-Admin"
            component={ConfirmAdmin}
          />
          <PrivateRoute exact path="/admin/home" component={Dashboard} />
        </Switch>
      </Router>
    </React.Fragment>
  );
};

export default AppDashboard;
