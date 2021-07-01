import React, { useState } from "react";
import axios from 'axios'
import { Form, Input, Button, Row, Col, Upload, message,Select,Card,Avatar } from "antd";
import Modal from "antd/lib/modal/Modal";
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';

const { Meta } = Card;


const ViewPromotion = ({ show, cancel, info }) => {
  const [ state, setState] = useState(false);
  const { imageUrl } = state;
  const [ image, setImage] = useState("");
  const [ form ] = Form.useForm();
  // const {title,category,description} = info;

  console.log("info", info);


  return (
    <Modal
      visible={show}
      onCancel={cancel}
      footer={null}
      width={780}
      title="View Detail"
    >
      <Card
        cover={
          <img
            alt="example"
            src={"http://localhost:5000/uploads/" + info.photo}
          />
        }
        >
        <p>{info.date}</p>
        <p>{info.role}</p>
        <Meta
          avatar={<Avatar src={"http://localhost:5000/uploads/" + info.image} />}
          title={info.fullname}
          description={info.description}
        />
      </Card>    
    </Modal>
  );
};

export default ViewPromotion;
