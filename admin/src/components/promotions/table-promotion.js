import React from "react";
import { Table, Tag } from "antd";
import data_promotions from "./promotions.json";

const TableNotifications = () => {
  const columns = [
    {
      title: "Full Name",
      width: "15%",
      dataIndex: "fullname",
      key: "fullname",
    },

    {
      title: "Published Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role) => {
        if (role === "Teacher" || role === "teacher") {
          return <Tag color="processing">{role}</Tag>;
        } else {
          return <Tag color="warning">{role}</Tag>;
        }
      },
    },
    {
      title: "Descriptions",
      dataIndex: "desc",
      key: "desc",
    },

    {
      title: "Actions",
      dataIndex: "",
      key: "",
      render: () => {
        return (
          <React.Fragment>
            <Tag color="#108ee9">Approve</Tag>
            <Tag color="#f50">Ban</Tag>
          </React.Fragment>
        );
      },
    },
  ];
  return (
    <React.Fragment>
      <div className="contentContainer-auto">
        <Table dataSource={data_promotions} columns={columns} />
      </div>
    </React.Fragment>
  );
};

export default TableNotifications;
