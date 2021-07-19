import React,{useEffect,useState} from "react";
import { Table,Skeleton, Tag, Button} from "antd";
import axios from 'axios';

const getToken = localStorage.getItem('token');

const GetPromotion = () => {

  const [ ,setLoading] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    setLoading(true);
    const auth = {
      Authorization: "Bearer " + getToken,
    };
    axios({
      method: "GET",
      url: `${url + api/admin/set-discount}`,
      headers: {
        "content-type": "application/json; charset=utf-8",
        ...auth,
      },
    })
      .then((res) => {
        setData(res.data.roles);
        console.log(setData);
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
            <Button type="primary">Edit</Button>
          </React.Fragment>
        );
      },
    },
  ];

  if(data.length === 0){
    return <Skeleton active/>
  }

  return (
    <React.Fragment>
        <Table dataSource={data} columns={columns} />
    </React.Fragment>
  );
};

export default GetPromotion;
