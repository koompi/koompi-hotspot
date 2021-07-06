import React from "react";
import { Layout, Menu } from "antd";
import { Link, useLocation } from "react-router-dom";
import TableNotifications from "./notifications-table";
import FormNotification from "./notification-form";

const { Header } = Layout;

const Notifications = () => {
  const location = useLocation();

  return (
    <React.Fragment>
      <div className="menu-options">
        <Header>
          <Menu
            mode="horizontal"
            selectedKeys={[location.pathname.split("/notifications/")[1]]}
            style={{ textAlign: "end" }}
          >
            <Menu.Item key="notification-table">
              <Link to={`/notifications/notification-table`}>TABLE</Link>
            </Menu.Item>
            <Menu.Item key="notification-form">
              <Link to={`/notifications/notification-form`}>FORM</Link>
            </Menu.Item>
          </Menu>
        </Header>
      </div>
      {location.pathname.split("/")[2] === "notification-table" && (
        <TableNotifications />
      )}
      {location.pathname.split("/")[2] === "notification-form" && (
        <FormNotification />
      )}
    </React.Fragment>
  );
};

export default Notifications;
