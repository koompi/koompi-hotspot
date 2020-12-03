import React from "react";
import { Link, Switch, Route } from "react-router-dom";

import Login from "./components/users/login";
import Register from "./components/users/register";
import ForgotPassword from "./components/users/register/fogot_password";
import EmailVerification from "./components/users/register/email-verification";
import CompleteInfo from "./components/users/register/completeInfo";
import BuyHotspot from "./components/hotspot plan/buy_plan";

import "react-toastify/dist/ReactToastify.css";
import "./App.css";

// Design
import "antd/dist/antd.css";
import "./assets/css/App.css";
// toast.configure();

function App() {
  return (
    <Switch>
      <Route exact path="/login" restrict component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/forgot-passwd" component={ForgotPassword} />
      <Route path="/email-verify" component={EmailVerification} />
      <Route path="/complete-info" component={CompleteInfo} />
      <Route path="/buy-hotspot" component={BuyHotspot} />
    </Switch>
  );
}

export default App;
