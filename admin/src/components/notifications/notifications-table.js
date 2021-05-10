import React from "react";
import { Table, Tag } from "antd";
import data_notifications from "./notifications.json";

import thumbnail from "../../assets/images/password.jpg";

const TableNotifications = () => {
  const columns = [
    {
      title: "Thumbnail",
      width: "5%",
      dataIndex: "img",
      key: "img",
      render: () => {
        return (
          <img
            src={thumbnail}
            className="thumbnail-notification"
            alt="thumbnail"
          />
        );
      },
    },
    {
      title: "Title",
      width: "20%",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Descriptions",
      width: "25%",
      dataIndex: "desc",
      key: "desc",
    },
    {
      title: "Published Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Published By",
      dataIndex: "published",
      key: "published",
    },
    {
      title: "Actions",
      dataIndex: "",
      key: "",
      render: () => {
        return (
          <React.Fragment>
            <Tag color="#108ee9">Edit</Tag>
            <Tag color="#f50">Delete</Tag>
          </React.Fragment>
        );
      },
    },
  ];
  return (
    <React.Fragment>
      <div className="contentContainer-auto">
        <Table dataSource={data_notifications} columns={columns} />
      </div>
    </React.Fragment>
  );
};

export default TableNotifications;
