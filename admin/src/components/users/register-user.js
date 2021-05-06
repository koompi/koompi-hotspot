import React from "react";
import { Table, Tag } from "antd";
import data_registered from "./registered.json";

const RegisteredUser = () => {
  const columns = [
    {
      title: "Full Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
    },
    {
      title: "Birth Date",
      dataIndex: "birthdate",
      key: "birthdate",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role) => {
        return (
          <React.Fragment>
            <Tag color="warning">{role}</Tag>
          </React.Fragment>
        );
      },
    },
    {
      title: "Activate",
      dataIndex: "activate",
      key: "activate",
    },
    {
      title: "Actions",
      dataIndex: "",
      key: "",
      render: () => {
        return (
          <React.Fragment>
            <Tag color="#f50">BAN</Tag>
          </React.Fragment>
        );
      },
    },
  ];
  return (
    <React.Fragment>
      <div className="contentContainer-auto">
        <Table dataSource={data_registered} columns={columns} />
      </div>
    </React.Fragment>
  );
};

export default RegisteredUser;
