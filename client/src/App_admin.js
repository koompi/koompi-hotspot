import React from "react";
import { Switch, Route } from "react-router-dom";

// import Navbar from "./admin/components/layout/navbar/Navbar";
// import Main from "./admin/components/pages/main/Main";
// import Sidebar from "./admin/components/layout/sidebar/Sidebar";
import Dashboard from "./admin/index";
import ConfirmAdmin from "./admin/user/email-verification";
import Login from "./admin/user/login";

import "./App.css";
import "./assets/css/App.css";

const AppDashboard = () => {
  return (
    <Switch>
      <Route exact path="/admin/" restrict component={Login} />
      <Route exact path="/admin/login" restrict component={Login} />
      <Route path="/admin/login/confirm-Admin" component={ConfirmAdmin} />
      <Route path="/admin/home" component={Dashboard} />
    </Switch>
  );
};

export default AppDashboard;
