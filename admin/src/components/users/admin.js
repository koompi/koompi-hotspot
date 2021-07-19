import React,{useEffect,useState} from "react";
import { Table, Tag } from "antd";
import axios from "axios";

const getToken = localStorage.getItem('token');

const Admin = () => {

  const [, setLoading] = useState(false);
  const [admins,setAdmin] = useState([]);

  useEffect(()=>{
    setLoading(true);
    const auth = {
      Authorization: "Bearer " + getToken,
    };
    axios({
      method: "GET",
      url: `${url + api/admin/users-admin}`,
      headers:{
        "content-type": "application/json; charset=utf-8",
        ...auth,
      },
    })
    .then((res) => {
      setAdmin(res.data);
      console.log(setAdmin);
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    })
    .catch((err) => console.log(err));
}, []);


  const columns = [
    {
      title: "FULL NAME",
      dataIndex: "fullname",
      key: "fullname",
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
      title: "LAST LOGIN",
      dataIndex: "last_login",
      key: "last_login",
    },
    {
      title: "Actions",
      dataIndex: "ban",
      key: "ban",
      render: (ban) => {
        if (ban) {
          return <Tag color="#87d068">BAN</Tag>;
        } else {
          return <Tag color="#f50">UNBAN</Tag>;
        }
      },
    },
  ];
  return (
    <React.Fragment>
      <div className="contentContainer-auto">
        <Table dataSource={admins.user_admins} columns={columns} />
      </div>
    </React.Fragment>
  );
};

export default Admin;
