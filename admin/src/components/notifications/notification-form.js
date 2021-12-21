import React, { useState } from "react";
import { Form, Input, Button, Row, Col, Upload, message } from "antd";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import axios from "axios";

import {NotificationImage} from "./uploadImage";

const { TextArea } = Input;

const FormNotification = () => {

  // Submit Publish Notifications
  const onSubmit = data => {
    console.log("Success:", data);
    const config = {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    };
    
    const contentData = {
      title: data.title,
      category: data.category,
      description: data.description,
      name: JSON.parse(localStorage.getItem("file"))
    };
    

    axios
      .post(
        "https://api-hotspot-dev.koompi.org/api/admin/notification",
        contentData,
        config,
      )
      .then(async (res) => {
        message.success("Added Successfully.");
        window.location.replace("/notifications/notification-table");
        localStorage.removeItem("file");
      })
      .catch(async (err) => {
        setTimeout(() => {

        }, 1000);
        console.log(err);
        await message.error(err.message);
        // await message.error("Code invalid.");
      });
  };

  return (
    <React.Fragment>
      <div className="contentContainer-auto">
        <Form 
          className="notification-form" 
          layout="vertical" 
          size="large" 
          onFinish = {onSubmit}
        >
          <Row gutter={[32, 32]}>
            <Col span={16}>
              <Row gutter={[32, 0]}>
                <Col span={24}>
                  <Form.Item
                    label="Title"
                    name="title"
                    rules={[
                      {
                        // required: true,
                        message: "Please input the message title!",
                      },
                    ]}
                  >
                    <TextArea rows={1} className="schoolInput" />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item
                    label="Category"
                    name="category"
                    rules={[
                      {
                        // required: true,
                        message: "Please input category!",
                      },
                    ]}
                  >
                    <TextArea rows={1} className="schoolInput" />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item
                    label="Descriptions"
                    name="description"
                    rules={[
                      {
                        // required: true,
                        message: "Please input description details!",
                      },
                    ]}
                  >
                    <TextArea rows={8} className="schoolInput" />
                  </Form.Item>
                </Col>
              </Row>
            </Col>
            <Col span={8}>
              <NotificationImage/>
            </Col>
          </Row>
          <Button 
            type="primary" 
            lassName="publish-button"
            htmlType="submit"
          >
            Publish
          </Button>
        </Form>
      </div>
    </React.Fragment>
  );
};

export default FormNotification;
