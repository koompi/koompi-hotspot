import React from "react";
import { Layout, Menu } from "antd";
import { Link, useLocation } from "react-router-dom";
import PromotionForm from "./form-promotion";
import PromotionTable from "./table-promotion";

const { Header } = Layout;

const Promotions = () => {
  const location = useLocation();

  return (
    <React.Fragment>
      <div className="menu-options">
        <Header>
          <Menu
            mode="horizontal"
            selectedKeys={[location.pathname.split("/promotions/")[1]]}
            style={{ textAlign: "end" }}
          >
            <Menu.Item key="promotion-table">
              <Link to={`/promotions/promotion-table`}>TABLE</Link>
            </Menu.Item>
            <Menu.Item key="promotion-form">
              <Link to={`/promotions/promotion-form`}>FORM</Link>
            </Menu.Item>
          </Menu>
        </Header>
      </div>
      {location.pathname.split("/")[2] === "promotion-table" && (
        <PromotionTable />
      )}
      {location.pathname.split("/")[2] === "promotion-form" && (
        <PromotionForm />
      )}
    </React.Fragment>
  );
};

export default Promotions;
