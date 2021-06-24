import React,{useEffect,useState} from "react";
import { Table, Button, Popconfirm, message } from "antd";
import axios from "axios";

const getToken = localStorage.getItem('token');

const Admin = () => {

  const auth = {
    Authorization: "Bearer " + getToken,
  };

  const [, setLoading] = useState(false);
  const [admins,setAdmin] = useState([]);

  useEffect(()=>{
    setLoading(true);
    axios({
      method: "GET",
      url: "http://localhost:5000/api/admin/users-admin",
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
const handleDis_or_EnableAdmins = (id) =>{
  axios({
  method: "PUT",
  url: `http://localhost:5000/api/admin/users-admin/${id}`,
  headers: {
    "Content-Type": "application/json; charset=utf-8",
    ...auth,
  },
})
.then((res) => {
  message.success(res.data.message)
})
  .catch((err) => console.log(err));
}
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
              onConfirm={() =>handleDis_or_EnableAdmins(id)}
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
              onConfirm={() =>handleDis_or_EnableAdmins(id)}
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
        <Table dataSource={admins.user_admins} columns={columns} />
      </div>
    </React.Fragment>
  );
};

export default Admin;
