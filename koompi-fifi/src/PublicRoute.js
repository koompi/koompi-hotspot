import React from "react";
import { Route, Navigate } from "react-router-dom";
import jwt from "jsonwebtoken";
import Cookie from "js-cookie";

const PublicRoute = ({ component: Component, restricted, ...rest }) => {
  let token = Cookie.get("token");
  let user = jwt.decode(token);

  const isLogin = () => {
    if (!user) {
      return false;
    }
    return true;
  };

  return (
    <Route
      {...rest}
      render={(props) =>
        isLogin() && restricted ? (
          <Navigate replace to="/preorder" />
        ) : (
          <Component {...props} />
        )
      }
    />
  );
};

export default PublicRoute;
