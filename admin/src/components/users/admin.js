import React from "react";
import { Table, Tag } from "antd";

import data_admin from "./admin.json";

const Admin = () => {
  const columns = [
    {
      title: "Full Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "EMAIL",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "BRANCH",
      dataIndex: "branch",
      key: "branch",
    },
    {
      title: "Actions",
      dataIndex: "",
      key: "",
      render: () => {
        return <Tag color="#f50">BAN</Tag>;
      },
    },
  ];
  return (
    <React.Fragment>
      <div className="contentContainer-auto">
        <Table dataSource={data_admin} columns={columns} />
      </div>
    </React.Fragment>
  );
};

export default Admin;
