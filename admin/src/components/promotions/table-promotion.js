import React,{useState,useEffect} from "react";
import { Table, Tag,Button } from "antd";

import axios from 'axios';
const getToken = localStorage.getItem('token')

const TablePromotion = () => {
  const [ ,setLoading] = useState(false);
  const [views, setView] = useState([]);

  useEffect(() => {
    setLoading(true);
    const auth = {
      Authorization: "Bearer " + getToken,
    };
    axios({
      method: "GET",
      url: "http://localhost:5000/api/admin/view-discount",
      headers: {
        "content-type": "application/json; charset=utf-8",
        ...auth,
      },
    })
      .then((res) => {
        setView(res.data);
        console.log(setView);
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      })
      .catch((err) => console.log(err));
  }, []);

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
      title: "APPROVE",
      dataIndex: "ban",
      key: "ban",
      render: () => {
        return (
          <React.Fragment>
            <Button type="primary" >Approve</Button>
          </React.Fragment>
        );
      },
    },
  ];
  return (
    <React.Fragment>
      <div className="contentContainer-auto">
        <Table dataSource={views.teachers} columns={columns} />
      </div>
    </React.Fragment>
  );
};

export default TablePromotion;
