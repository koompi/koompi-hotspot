import React,{useEffect,useState} from "react";
import { Table,Skeleton, Button,Popconfirm, Empty } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import ViewNotification from "./notification-edit";

import thumbnail from "../../assets/images/password.jpg";
import axios from 'axios'

const getToken = localStorage.getItem("token");

const TableNotifications = () => {

  const [ loading ,setLoading] = useState(false);
  const [show,setShow] = useState(false);
  const [data, setData] = useState([]);
  const [info, setInfo] = useState("");

  const auth = {
    Authorization: "Bearer " + getToken,
  };

  const showViewNotification = () => {
    setShow(true);
  };
  const hideViewNotification = () => {
    setShow(false);
    setInfo("");
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
      
    const handleDeleteNotification = (id) =>{
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

  const handleEditNotifi = (data) =>{
    

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
      width: "10%",
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
        const { _id } = data;
        return (
          <div>
            <Button
             type="primary"
              style={{ cursor: "pointer" }}
              onClick={() => {
                setInfo(data);
                showViewNotification();
              }}
            >
              <EditOutlined />
               View
            </Button> {" "}
            <Popconfirm
              placement="topRight"
              title="Are you sure to delete?"
              okText="Yes"
              cancelText="No"
              onConfirm={() =>handleDeleteNotification(_id)}
            >
              <Button type="primary" danger style={{ cursor: "pointer" }}>
                <DeleteOutlined />
                 Delete
              </Button>
            </Popconfirm>
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
        <ViewNotification
          cancel={hideViewNotification}
          show={show}
          info={info} 
        />
      )}
    </React.Fragment>
  );
};

export default TableNotifications;
