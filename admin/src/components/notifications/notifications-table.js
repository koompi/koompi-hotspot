import React,{useEffect,useState} from "react";
import { Table, Tag } from "antd";

import thumbnail from "../../assets/images/password.jpg";
import axios from 'axios'

const getToken = localStorage.getItem("token");


const TableNotifications = () => {

  const [ ,setLoading] = useState(false);
  const [noties, setNoties] = useState([]);

  useEffect(() => {
    setLoading(true);
    const auth = {
      Authorization: "Bearer " + getToken,
    };
    axios({
      method: "GET",
      url: "http://localhost:5000/api/admin/notification",
      headers: {
        "content-type": "application/json; charset=utf-8",
        ...auth,
      },
    })
      .then((res) => {
        setNoties(res.data);
        console.log(setNoties);
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      })
      .catch((err) => console.log(err));
  }, []);

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
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Published Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Published By",
      dataIndex: "fullname",
      key: "fullname",
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
        <Table dataSource={noties.notification} columns={columns} />
      </div>
    </React.Fragment>
  );
};

export default TableNotifications;
