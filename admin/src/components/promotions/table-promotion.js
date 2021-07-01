import React,{useState,useEffect} from "react";
import { Table, Tag,Button,Skeleton, message } from "antd";
import axios from 'axios';

import ViewPromotion from "./view-promotion";

const getToken = localStorage.getItem('token')

const TablePromotion = () => {
  const [ loading ,setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [info, setInfo] = useState("");
  const [show,setShow] = useState(false);

  const showViewDetail = () => {
    setShow(true);
  };
  const hideViewDetail = () => {
    setShow(false);
    setInfo("");
  };

  const auth = {
    Authorization: "Bearer " + getToken,
  };

  const myData=()=>{
    axios({
      method: "GET",
      url: "http://localhost:5000/api/admin/view-discount",
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
  }


  useEffect(() => {
    setLoading(true);
    myData();
  }, []);

  const handleApproveUser = (id) =>{
    const auth = {
      Authorization: "Bearer " + getToken,
    };
    axios({
      method: "PUT",
      url: `http://localhost:5000/api/admin/approve-discount/${id}`,
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
      dataIndex: "",
      key: "",
      render: (data) => {
        const {id} = data
          return (
            <div>
              <Button  type="primary" onClick={() => handleApproveUser(id)}>Approve</Button>{" "}           
              <Button  
              type="default" 
              onClick={()=>{
                setInfo(data);
                showViewDetail();
              }
              }>View</Button>
            </div>
          );        
      },
    },
  ];

  if(loading){
    return <Skeleton active/>
  }

  return (
    <React.Fragment>
      <div className="contentContainer-auto">
        <Table dataSource={data} columns={columns} />
      </div>
      {info !== "" && (
        <ViewPromotion
          cancel={hideViewDetail}
          show={show}
          info={info} 
          myData={myData}
        />
      )}
    </React.Fragment>
  );
};

export default TablePromotion;
