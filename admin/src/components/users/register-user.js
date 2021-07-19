import React, { useEffect, useState } from "react";
import { Table, Tag } from "antd"; 
import axios from "axios";

const getToken = localStorage.getItem("token");

const RegisteredUser = () => {
  const [ ,setLoading] = useState(false);
  const [usersRegister, setUserRegister] = useState([]);

  useEffect(() => {
    setLoading(true);
    const auth = {
      Authorization: "Bearer " + getToken,
    };
    axios({
      method: "GET",
      url: "https://api-hotspot-dev.koompi.org/api/admin/users-register",
      headers: {
        "content-type": "application/json; charset=utf-8",
        ...auth,
      },
    })
      .then((res) => {
        setUserRegister(res.data);
        console.log(setUserRegister);
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
      width: "15%",
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
      render: (activate) => {
        if (activate === true) {
          return <Tag color="#87d068">Activated</Tag>;
        } else {
          return <Tag color="#f50">Deactivated</Tag>;
        }
      },
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
        <Table dataSource={usersRegister.users_resgistered} columns={columns} />
      </div>
    </React.Fragment>
  );
};

export default RegisteredUser;
