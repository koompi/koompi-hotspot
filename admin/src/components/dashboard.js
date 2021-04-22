import React, { useState } from "react";
import axios from "axios";
import { useHistory, Link } from "react-router-dom";
import { Layout, Menu } from "antd";
import {
  AppstoreOutlined,
  BarChartOutlined,
  CloudOutlined,
  TeamOutlined,
  UserOutlined,
  UploadOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";

const { Header, Content, Footer, Sider } = Layout;
const Dashboard = () => {
  // const history = useHistory();
  // const [loading, setLoading] = useState(false);

  // const accessToken = localStorage.getItem("token");

  // const authAxios = axios.create({
  //   headers: {
  //     Authorization: `Bearer ${accessToken}`,
  //   },
  // });

  return (
    <Layout>
      <Sider
        style={{
          overflow: "auto",
          height: "100vh",
          position: "fixed",
          left: 0,
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
            <main>
              <div className="main__container">
                <div className="main__title">
                  {/* <img src={he} alt="hello" /> */}
                  <div className="main__greeting">
                    <h1>Hello World</h1>
                    <p>Welcome to your admin dashboard</p>
                  </div>
                </div>

                <div className="main__cards">
                  <div className="card">
                    {/* <i className="fa fa-user-o fa-2x text-lighblue"></i> */}
                    <TeamOutlined />
                    <div className="card_inner">
                      <p className="text-primary-p">Number of Registers</p>
                      <span className="font-bold text-title">583</span>
                    </div>
                  </div>

                  <div className="card">
                    <i className="fa fa-calendar fa-2x text-red"></i>
                    <div className="card_inner">
                      <p className="text-primary-p">Number of Bought Plans</p>
                      <span className="font-bold text-title">1223</span>
                    </div>
                  </div>

                  <div className="card">
                    <i className="fa fa-video-camera fa-2x text-yellow"></i>
                    <div className="card_inner">
                      <p className="text-primary-p">Number of Active Login</p>
                      <span className="font-bold text-title">340</span>
                    </div>
                  </div>

                  <div className="card">
                    <i className="fa fa-thumbs-up fa-2x text-green"></i>
                    <div className="card_inner">
                      <p className="text-primary-p">Number of </p>
                      <span className="font-bold text-title">56</span>
                    </div>
                  </div>
                </div>

                <div className="charts">
                  <div className="charts__left">
                    <div className="charts__left__title">
                      <div>
                        <h1>Daily Reports</h1>
                        <p>Boeung Kork, Phnom Penh, Cambodia</p>
                      </div>
                      <i className="fa fa-usd"></i>
                    </div>
                  </div>

                  <div className="charts__right">
                    <div className="charts__right__title">
                      <div>
                        <h1>Status Reports</h1>
                        <p>Boeung Kork, Phnom Penh, Cambodia</p>
                      </div>
                      <i className="fa fa-usd"></i>
                    </div>

                    <div className="charts__right__cards">
                      <div className="card1">
                        <h1>Income</h1>
                        <p>$189</p>
                      </div>
                      <div className="card2">
                        <h1>Sales</h1>
                        <p>$123,300</p>
                      </div>
                      <div className="card3">
                        <h1>Users</h1>
                        <p>390</p>
                      </div>
                      <div className="card4">
                        <h1>Orders</h1>
                        <p>2189</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </Content>

        {/* <Button htmlType={logout}> */}
        <Link to="/">Logut</Link>
        {/* </Button> */}
        <Footer style={{ textAlign: "center" }}>
          Ant Design ©2018 Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
