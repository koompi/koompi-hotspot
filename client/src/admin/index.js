import React, { useState } from "react";
import axios from "axios";
import { useHistory, Redirect, Link } from "react-router-dom";
import { Layout, Menu, Button } from "antd";
import "./index.css";
import {
  AppstoreOutlined,
  BarChartOutlined,
  CloudOutlined,
  ShopOutlined,
  TeamOutlined,
  UserOutlined,
  UploadOutlined,
  VideoCameraOutlined
} from "@ant-design/icons";
import Main from "./components/pages/main/Main";

const { Header, Content, Footer, Sider } = Layout;
const Dashboard = () => {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [size] = useState("large");

  const accessToken = localStorage.getItem("token");

  const authAxios = axios.create({
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  return (
    <Layout>
      <Sider
        style={{
          overflow: "auto",
          height: "100vh",
          position: "fixed",
          left: 0
        }}
      >
        <div className="logo" />
        <Menu theme="dark" mode="inline" defaultSelectedKeys={["1"]}>
          <Menu.Item key="1" icon={<UserOutlined />}>
            nav 1
          </Menu.Item>
          <Menu.Item key="2" icon={<VideoCameraOutlined />}>
            nav 2
          </Menu.Item>
          <Menu.Item key="3" icon={<UploadOutlined />}>
            nav 3
          </Menu.Item>
          <Menu.Item key="4" icon={<BarChartOutlined />}>
            nav 4
          </Menu.Item>
          <Menu.Item key="5" icon={<CloudOutlined />}>
            nav 5
          </Menu.Item>
          <Menu.Item key="6" icon={<AppstoreOutlined />}>
            nav 6
          </Menu.Item>
          <Menu.Item key="7" icon={<TeamOutlined />}>
            nav 7
          </Menu.Item>
          {/* <Menu.Item key="8" icon={<ShopOutlined />}>
            <Link>Log Out</Link>
          </Menu.Item> */}
        </Menu>
      </Sider>
      <Layout className="site-layout" style={{ marginLeft: 200 }}>
        <Header className="site-layout-background" style={{ padding: 0 }} />
        <Content style={{ margin: "24px 16px 0", overflow: "initial" }}>
          <div
            className="site-layout-background"
            style={{ padding: 24, textAlign: "center" }}
          >
            <Main />
          </div>
        </Content>
        {/* <Button htmlType={logout}> */}
        <Link to="/admin/">Logut</Link>
        {/* </Button> */}
        <Footer style={{ textAlign: "center" }}>
          Ant Design ©2018 Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
