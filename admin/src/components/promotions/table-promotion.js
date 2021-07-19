import React,{useState,useEffect} from "react";
import { Table, Tag,Button,Skeleton } from "antd";

import axios from 'axios';
const getToken = localStorage.getItem('token')
import url from "../utils"

const TablePromotion = () => {
  const [ ,setLoading] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    setLoading(true);
    const auth = {
      Authorization: "Bearer " + getToken,
    };
    axios({
      method: "GET",
      url: `${url.serverDev + api/admin/view-discount}`,
      headers: {
        "content-type": "application/json; charset=utf-8",
        ...auth,
      },
    })
      .then((res) => {
        setData(res.data.teachers);
        console.log(setData);
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      })
      .catch((err) => console.log(err));
  }, []);

  const handleApproveUser = (id) =>{
    const auth = {
      Authorization: "Bearer " + getToken,
    };
    axios({
      method: "PUT",
      url: `${url.serverDev + api/admin/approve-discount/id}`,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        ...auth,
      },
    })
      .then((res) => {
        console.log("res", res);
      })
      .catch((err) => console.log(err));
  }

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
      dataIndex: "approved",
      key: "approved",
      render: (approved, data) => {
        const {id} = data
        if(!approved){
          return (
            <React.Fragment>
              <Button  type="primary" onClick={() => handleApproveUser(id)}>Approve</Button>
            </React.Fragment>
          );
        }else{
          return (
            <React.Fragment>
              <Button  type="primary" danger onClick={handleApproveUser}>Approve</Button>
            </React.Fragment>
          );
        }
        
      },
    },
  ];
  if(data.length === 0){
    return <Skeleton active/>
  }
  return (
    <React.Fragment>
      <div className="contentContainer-auto">
        <Table dataSource={data} columns={columns} />
      </div>
    </React.Fragment>
  );
};

export default TablePromotion;
