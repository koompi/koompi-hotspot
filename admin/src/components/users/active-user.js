import React from "react";
import { Table, Tag } from "antd";
import data_actives from "./actives.json";

const ActivesUsers = () => {
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
      title: "PLAN",
      dataIndex: "plan",
      key: "plan",
    },
    {
      title: "EXPIRED",
      dataIndex: "expired",
      key: "expired",
    },
    {
      title: "SIM",
      dataIndex: "sim",
      key: "sim",
    },
    {
      title: "SPEED/UP",
      dataIndex: "spdup",
      key: "spdup",
      render: (spdup) => {
        return (
          <React.Fragment>
            <Tag color="processing">{spdup}</Tag>
          </React.Fragment>
        );
      },
    },
    {
      title: "SPEED/DW",
      dataIndex: "spddw",
      key: "spddw",
      render: (spddw) => {
        return (
          <React.Fragment>
            <Tag color="warning">{spddw}</Tag>
          </React.Fragment>
        );
      },
    },
    {
      title: "DEVICE",
      dataIndex: "device",
      key: "device",
    },
    {
      title: "STATUS",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        if (status === "active") {
          return <Tag color="#87d068">Active</Tag>;
        } else {
          return <Tag color="#f50">Inactive</Tag>;
        }
      },
    },
  ];
  return (
    <React.Fragment>
      <div className="contentContainer-auto">
        <Table dataSource={data_actives} columns={columns} />
      </div>
    </React.Fragment>
  );
};

export default ActivesUsers;
