import React, { useEffect, useState } from "react";
import { Table, Tag, message, Popconfirm, Button } from "antd"; 
import axios from "axios";

const getToken = localStorage.getItem("token");

const RegisteredUser = () => {
  const [ ,setLoading] = useState(false);
  const [usersRegister, setUserRegister] = useState([]);
  const auth = {
    Authorization: "Bearer " + getToken,
  };

  const myData = ()=>{
    axios({
      method: "GET",
      url: "http://localhost:5000/api/admin/users-register",
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
  }

  useEffect(() => {
    setLoading(true);
    myData();    
  }, []);

  const handleDis_or_EnableUsers = (id) =>{
    axios({
    method: "PUT",
    url: `http://localhost:5000/api/admin/users-register/${id}`,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...auth,
    },
  })
  .then((res) => {
    message.success(res.data.message);
    myData();
  })
    .catch((err) => console.log(err));
  }
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
      render: (data) => {
        const {id,ban} = data;
        if (!ban) {
            return (
            <Popconfirm
              placement="topRight"
              title="Are you sure to Disable?"
              okText="Yes"
              cancelText="No"
              onConfirm={() =>handleDis_or_EnableUsers(id)}
            >
              <Button type="primary" danger style={{ cursor: "pointer" }}>
                 Disable
              </Button>
            </Popconfirm>);
        } else {
          return (
            <Popconfirm
              placement="topRight"
              title="Are you sure to Enable?"
              okText="Yes"
              cancelText="No"
              onConfirm={() =>handleDis_or_EnableUsers(id)}
            >
              <Button type="primary" style={{ cursor: "pointer" }}>
                 Enable
              </Button>
            </Popconfirm>
          );
        }
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
