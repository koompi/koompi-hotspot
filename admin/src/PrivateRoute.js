import React from "react";
// import * as firebaseui from "firebaseui";
import { Route, Redirect } from "react-router-dom";

let token = localStorage.getItem("token");
// let remember = localStorage.getItem("firebaseui::rememberedAccounts");

const PrivateRoute = ({ component: Component, ...rest }) => {
  const isLogin = () => {
    if (token) {
      return true;
    } else {
      return false;
    }
  };
  return (
    <Route
      {...rest}
      render={props =>
        isLogin() ? <Component {...props} /> : <Redirect to="/admin" />
      }
    />
    /*{ <Route
      {...rest}
      render={(props) =>
        isLogin() ? <h1>Login success</h1>: <Redirect to="/login" />
    }/> }*/
  );
};

export default PrivateRoute;
