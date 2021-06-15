import React,{useEffect,useState} from "react";
import { Table,Skeleton, Button } from "antd";

import thumbnail from "../../assets/images/password.jpg";
import axios from 'axios'

const getToken = localStorage.getItem("token");


const TableNotifications = () => {

  const [ ,setLoading] = useState(false);
  const [data, setData] = useState([]);

  const auth = {
    Authorization: "Bearer " + getToken,
  };

  useEffect(() => {
    setLoading(true);    
    axios({
      method: "GET",
      url: "http://localhost:5000/api/admin/notification",
      headers: {
        "content-type": "application/json; charset=utf-8",
        ...auth,
      },
    })
      .then((res) => {
        setData(res.data.notification);
        console.log(setData);
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      })
      .catch((err) => console.log(err));
  }, []);
  
  const handleDeleteNotifi = (id) =>{
    axios({
      method: "DELETE",
      url: `http://localhost:5000/api/admin/notification/${id}`,
      headers: {
        // "Content-Type": "application/json; charset=utf-8",
        ...auth,
      },
    })
      .then((res) => {
        console.log("res", res);
      })
      .catch((err) => console.log(err));
  }

  const handleEditNotifi = (id) =>{
    axios({
      method: "PUT",
      url: `http://localhost:5000/api/admin/approve-discount/${id}`,
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
      title: "Thumbnail",
      width: "5%",
      dataIndex: "image",
      key: "image",
      render: (data) => {
        if(data!= null)
        return (
          <img            
            src={"http://localhost:5000/uploads/" + data}
            className="thumbnail-notification"
            alt="thumbnail"
          />
        )
        else
        return (
          <img
            src={thumbnail}
            className="thumbnail-notification"
            alt="thumbnail"
          />
        );
      },
    },
    {
      title: "Title",
      width: "22%",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Category",
      width: "15%",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Descriptions",
      width: "18%",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Published Date",
      // width: "1%",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Published By",
      width: "10%",
      dataIndex: "fullname",
      key: "fullname",
    },
    {
      title: "Actions",
      width: "",
      dataIndex: "",
      key: "",
      render: (data) => {
        const {id} = data;
        return (
          <React.Fragment>
            <Button type="primary" onClick={() => handleEditNotifi(id)}>Edit</Button>{" "}
            <Button type="primary" danger onClick={() => handleDeleteNotifi(id)}>Delete</Button>
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
      <div className="contentContainer-auto">
        <Table dataSource={data} columns={columns} />
      </div>
    </React.Fragment>
  );
};

export default TableNotifications;
