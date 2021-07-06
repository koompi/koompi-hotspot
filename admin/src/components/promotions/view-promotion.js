import React from "react";
import { Row, Col, Card, Avatar } from "antd";
import Modal from "antd/lib/modal/Modal";

const { Meta } = Card;


const ViewPromotion = ({ show, cancel, info }) => {

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
