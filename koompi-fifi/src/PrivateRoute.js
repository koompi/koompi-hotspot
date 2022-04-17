import React from "react";
import { Route, Navigate } from "react-router-dom";
import jwt from "jsonwebtoken";
import Cookie from "js-cookie";
import { Layout } from "antd";
import TopNavbar from "./components/layouts/navbar";
import LeftNavbar from "./components/layouts/sidebar";

const { Content } = Layout;

// Global varible
let token = Cookie.get("token");
let user = jwt.decode(token);

const PrivateRoute = ({ component: Component, ...rest }) => {
  const isLogin = () => {
    if (user) {
      return true;
    }
    return false;
  };
  return (
    <Route
      {...rest}
      render={(props) =>
        isLogin() ? (
          <Layout style={{ minHeight: "100vh" }}>
            {/* =========Left Navbar ======= */}
            <LeftNavbar />
            <Layout>
              <Content>
                {/* =========Top Navbar ======= */}
                <TopNavbar />

                <div className="koompi container">
                  {/* ======= Display content ====== */}

                  <div className="background_container">
                    <Component {...props} />
                  </div>
                </div>
              </Content>
            </Layout>
          </Layout>
        ) : (
          <Navigate replace to="/login" />
        )
      }
    />
  );
};

export default PrivateRoute;
