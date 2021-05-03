import React from "react";
import { Route, Redirect } from "react-router-dom";
import { Layout } from "antd";
import NavBar from "../src/components/layouts/navbar";
import SideNavbar from "../src/components/layouts/side-navbar";

const { Content } = Layout;

let token = localStorage.getItem("token");

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
      render={(props) =>
        isLogin() ? (
          <Layout style={{ minHeight: "100vh" }}>
            <SideNavbar />
            <Layout>
              <NavBar />
              <Content className="content-padding">
                <Component {...props} />
              </Content>
            </Layout>
          </Layout>
        ) : (
          <Redirect to="/login" />
        )
      }
    />
  );
};

export default PrivateRoute;
