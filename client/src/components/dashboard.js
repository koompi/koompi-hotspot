import React from "react";
import { Button } from "antd";
import { Redirect, Link } from "react-router-dom";

const dashboard = () => {
  const logout = localStorage.removeItem("token");
  return (
    <div>
      Hello word.
      <Button htmlType={logout}>
        <Link to="/">Logut</Link>
      </Button>
    </div>
  );
};

export default dashboard;
