import React, { useState } from "react";
import { Layout, Avatar, Popover, Row, Col, Input } from "antd";
import { Link } from "react-router-dom";
import { HiLogout } from "react-icons/hi";
import { FiSearch, FiX } from "react-icons/fi";
import { SearchOutlined } from "@ant-design/icons";

import Avatar1 from "../../assets/images/images.jpeg";
// import Notifications from "./notifications";

const { Header } = Layout;

const NavBar = () => {
  const [search, setSearch] = useState(false);

  // -----------function search notification ------------

  const handleCloseSearch = () => {
    setSearch(false);
  };

  return (
    <React.Fragment>
      <Header
        style={{
          backgroundColor: "#fff",
        }}
      >
        <Popover
          placement="bottomRight"
          title={
            <React.Fragment>
              <Row gutter={[32, 0]}>
                <Col span={4}>
                  <img className="avatarNavbar" src={Avatar1} alt="avatar" />
                </Col>
                <Col span={20}>
                  <div>
                    <div className="popover-text">Thith THIN</div>
                    <span>helloworld@gmail.com</span>
                  </div>
                </Col>
              </Row>
            </React.Fragment>
          }
          content={
            <div style={{ width: "270px" }}>
              <Row className="accountNavbarhover">
                <Col style={{ paddingTop: "4px" }} span={4}>
                  <HiLogout className="logo-logout" />
                </Col>
                <Link to="/logout">
                  <Col
                    className="logout"
                    style={{ paddingTop: "4px", color: "red" }}
                    span={20}
                  >
                    <p>Logout</p>
                  </Col>
                </Link>
              </Row>
            </div>
          }
          trigger="click"
        >
          <div className="sub-topnavbar">
            <Avatar className="navbar-avata" src={Avatar1} size={50} />
          </div>
        </Popover>
        <Input
          size="small"
          placeholder="Search ..."
          allowClear
          enterButton="Search"
          className="search-navbar"
          suffix={<SearchOutlined />}
        />
      </Header>
    </React.Fragment>
  );
};
export default NavBar;
