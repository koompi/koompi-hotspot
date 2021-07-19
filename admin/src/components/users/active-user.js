import React,{useEffect,useState} from "react";
import { Table, Tag } from "antd";
import axios from "axios";

const getToken = localStorage.getItem("token");

const ActivesUsers = () => {
  const [ ,setLoading] = useState(false);
  const [usersActive, setUserActive] = useState([]);

  useEffect(() => {
    setLoading(true);
    const auth = {
      Authorization: "Bearer " + getToken,
    };
    axios({
      method: "GET",
      url: "https://api-hotspot-dev.koompi.org/api/admin/users-active",
      headers: {
        "content-type": "application/json; charset=utf-8",
        ...auth,
      },
    })
      .then((res) => {
        setUserActive(res.data);
        console.log(res.data);
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      })
      .catch((err) => console.log(err));
  }, []);

  const columns = [
    {
      title: "Full Name",
      dataIndex: "fullname",
      key: "fullname",
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
      dataIndex: "expire",
      key: "expire",
    },
    {
      title: "SIM",
      dataIndex: "simultaneous",
      key: "simultaneous",
    },
    {
      title: "SPEED/UP",
      dataIndex: "speed_up",
      key: "speed_up",
      render: (speed_up) => {
        return (
          <React.Fragment>
            <Tag color="processing">{speed_up}</Tag>
          </React.Fragment>
        );
      },
    },
    {
      title: "SPEED/DW",
      dataIndex: "speed_down",
      key: "speed_down",
      render: (speed_down) => {
        return (
          <React.Fragment>
            <Tag color="warning">{speed_down}</Tag>
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
        if (status === "Active") {
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
        <Table dataSource={usersActive.users_login} columns={columns} />
      </div>
    </React.Fragment>
  );
};

export default ActivesUsers;
