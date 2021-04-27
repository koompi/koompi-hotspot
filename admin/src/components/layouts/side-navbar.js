import React, { useState } from "react";
import { Layout, Menu } from "antd";
import { Link } from "react-router-dom";

import {
  UserOutlined,
  AppstoreAddOutlined,
  BellOutlined,
  NotificationOutlined,
} from "@ant-design/icons";

import Logo from "../../assets/images/koompi_logo_signal.png";

const { Sider } = Layout;

const SideNavbar = () => {
  return (
    <React.Fragment>
      <Sider
        style={{
          boxShadow: " 18px 0px 35px 0px rgba(0, 0, 0, 0.02)",
        }}
        theme="light"
        width="290px"
        breakpoint="lg"
        collapsedWidth="0"
      >
        <center>
          <div className="logos">
            <Link to="/dashboard">
              <img src={Logo} className="logo-hotspot" alt="logo" />
            </Link>
          </div>
        </center>
        <Menu theme="light" mode="inline" className="menu-categories">
          <Menu.Item key="/dashboard" icon={<AppstoreAddOutlined />}>
            <Link to="/dashboard">Dashboard</Link>
          </Menu.Item>
          <Menu.Item key="/users" icon={<UserOutlined />}>
            <Link to="/dashboard">Users</Link>
          </Menu.Item>
          <Menu.Item key="/notifications" icon={<BellOutlined />}>
            <Link to="/dashboard">Notifications</Link>
          </Menu.Item>
          <Menu.Item key="/promostions" icon={<NotificationOutlined />}>
            <Link to="/dashboard">Promostions</Link>
          </Menu.Item>
        </Menu>
      </Sider>
    </React.Fragment>
  );
};

export default SideNavbar;
