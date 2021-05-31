import React,{useEffect,useState} from "react";
import { Table, Tag} from "antd";
import axios from 'axios';

const getToken = localStorage.getItem('token');

const GetPromotion = () => {

  const [ ,setLoading] = useState(false);
  const [promotions, setPromotion] = useState([]);

  useEffect(() => {
    setLoading(true);
    const auth = {
      Authorization: "Bearer " + getToken,
    };
    axios({
      method: "GET",
      url: "http://localhost:5000/api/admin/set-discount",
      headers: {
        "content-type": "application/json; charset=utf-8",
        ...auth,
      },
    })
      .then((res) => {
        setPromotion(res.data);
        console.log(setPromotion);
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      })
      .catch((err) => console.log(err));
  }, []);

  const columns = [
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
      title: "Discount",
      dataIndex: "discount",
      key: "discount",
    },

    {
      title: "Actions",
      width: "25%",
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
        <Table dataSource={promotions.roles} columns={columns} />
    </React.Fragment>
  );
};

export default GetPromotion;
