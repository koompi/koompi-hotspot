import React, { useState } from "react";
import { Layout, Avatar, Popover, Row, Col, Input } from "antd";
import { Link } from "react-router-dom";
import { HiLogout } from "react-icons/hi";
import { FiSearch, FiX } from "react-icons/fi";
import { SearchOutlined } from "@ant-design/icons";
import { IoMdNotificationsOutline } from "react-icons/io";

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
                  <HiLogout style={{ fontSize: "21px" }} />
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
            <Avatar className="navbar-avata" src={Avatar1} size={55} />
          </div>
        </Popover>
        <Input
          size="large"
          placeholder="Search ..."
          allowClear
          enterButton="Search"
          className="search-navbar"
          suffix={<SearchOutlined />}
        />
        {/* <div className="notifications">
          <Popover
            placement="bottomRight"
            title={
              <React.Fragment>
                <div className="container-notification-title">
                  <h4>Notifications</h4>
                </div>
              </React.Fragment>
            }
            trigger="click"
            content={
              <React.Fragment>
                {" "}
                {search && (
                  <Input
                    className="schoolInput"
                    placeholder="search notifications..."
                    suffix={
                      <FiX
                        onClick={handleCloseSearch}
                        className="icon-close-notifications"
                      />
                    }
                  />
                )}
                {search ? null : (
                  <div className="container-icon-seacrch-notifications">
                    <FiSearch
                      onClick={() => setSearch(!search)}
                      className="notifications-search"
                    />
                  </div>
                )}
                <div className="container-notifications">
                  <Notifications />
                </div>
              </React.Fragment>
            }
          >
            <IoMdNotificationsOutline className="notification-icon" />
          </Popover>
        </div> */}
      </Header>
    </React.Fragment>
  );
};
export default NavBar;
