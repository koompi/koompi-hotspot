import React, { useContext } from "react";
import { Layout, Menu } from "antd";
import { Link } from "react-router-dom";
import { FiFileText, FiDollarSign, FiUserCheck, FiUser } from "react-icons/fi";
import { UserContext } from "../../context/userContext";

const { Sider } = Layout;
const { SubMenu } = Menu;

function LeftNavbar() {
  const userData = useContext(UserContext);

  const pathname = window.location.pathname;
  const { fullname, isAdmin } = userData.user;
  if (fullname === "") {
    return null;
  }

  const sessionIsLight = JSON.parse(localStorage.getItem("isLight"));

  return (
    <Sider
      style={
        sessionIsLight
          ? { backgroundColor: "rgb(30, 39, 46)" }
          : { backgroundColor: "#fff" }
      }
    >
      <div>
        <center>
          <img
            src={
              sessionIsLight
                ? "/images/KOOMPI_Logo.svg"
                : "/images/KOOMPI_Logo_dark.svg"
            }
            alt=""
            className="KOOMPI_LOGO"
          />
        </center>
      </div>
      <Menu
        theme={sessionIsLight ? "dark" : "light"}
        defaultSelectedKeys={[pathname]}
        defaultOpenKeys={[pathname]}
        mode="inline"
      >
        <Menu.Item key="/admin/user/pre-order">
          <Link to="/admin/user/pre-order" className="nav-text">
            <FiDollarSign />
            <span>Pre-Order</span>
          </Link>
        </Menu.Item>

        {isAdmin && (
          <Menu.ItemGroup key="payment-management" title="Payment Management">
            {/* ========= Payment Section ========= */}
            <Menu.Item key="/admin/user/payments">
              <Link to="/admin/user/payments" className="nav-text">
                <FiDollarSign />
                <span>User Payment</span>
              </Link>
            </Menu.Item>
            <Menu.Item key="/admin/wing/payments">
              <Link to="/admin/wing/payments" className="nav-text">
                <FiDollarSign />
                <span>Wing Transaction</span>
              </Link>
            </Menu.Item>
          </Menu.ItemGroup>
        )}

        <Menu.ItemGroup key="site-management" title="Site Management">
          {/* ========= AMA Section ========= */}
          <SubMenu
            key={
              pathname === "/admin/add-ama"
                ? "/admin/add-ama"
                : "/admin/all-amas"
                ? "/admin/all-amas"
                : ""
            }
            title={
              <div className="nav-text">
                <FiFileText />
                <span>AMA</span>
              </div>
            }
          >
            <Menu.Item key="/admin/add-ama">
              <Link to="/admin/add-ama">Add AMA</Link>
            </Menu.Item>
            <Menu.Item key="/admin/all-amas">
              <Link to="/admin/all-amas">All AMA</Link>
            </Menu.Item>
          </SubMenu>

          {/* ========= Mail Sender Section ========= */}
          <SubMenu
            key={
              pathname === "/admin/new-legal"
                ? "/admin/new-legal"
                : "/admin/all-legals"
                ? "/admin/all-legals"
                : ""
            }
            title={
              <div className="nav-text">
                <FiUserCheck />
                <span>Legals</span>
              </div>
            }
          >
            <Menu.Item key="/admin/new-legal">
              <Link to="/admin/new-legal">New Legal</Link>
            </Menu.Item>
            <Menu.Item key="/admin/all-legals">
              <Link to="/admin/all-legals">All Legals</Link>
            </Menu.Item>
          </SubMenu>

          {/* ========= Users Section ========= */}
          <Menu.Item key="/admin/users">
            <Link to="/admin/users" className="nav-text">
              <FiUser />
              <span>Users</span>
            </Link>
          </Menu.Item>
        </Menu.ItemGroup>
      </Menu>
    </Sider>
  );
}

export default LeftNavbar;
