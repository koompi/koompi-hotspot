import React from "react";
import { Layout, Menu } from "antd";
import RegisteredUser from "./register-user";
import ActivesUsers from "./active-user";
import Admin from "./admin";
import { Link, useLocation } from "react-router-dom";

const { Header } = Layout;

const Main = () => {
  const location = useLocation();
  return (
    <React.Fragment>
      <div className="menu-options">
        <Header>
          <Menu
            mode="horizontal"
            selectedKeys={[location.pathname.split("/users/")[1]]}
            style={{ textAlign: "end" }}
          >
            <Menu.Item key="registered">
              <Link to={`/users/registered`}>REGISTERED</Link>
            </Menu.Item>
            <Menu.Item key="actives">
              <Link to={`/users/actives`}>ACTIVES</Link>
            </Menu.Item>
            <Menu.Item key="admin">
              <Link to={`/users/admin`}>ADMIN</Link>
            </Menu.Item>
          </Menu>
        </Header>
      </div>
      {location.pathname.split("/")[2] === "registered" && <RegisteredUser />}
      {location.pathname.split("/")[2] === "actives" && <ActivesUsers />}
      {location.pathname.split("/")[2] === "admin" && <Admin />}
    </React.Fragment>
  );
};

export default Main;
