import React, { Fragment, useState } from "react";
import { Form, Input, Button, Radio } from "antd";
import { Link } from "react-router-dom";

const Buy_plan = () => {
  const [size] = useState("large");
  const onFinish = (values) => {
    console.log("Success:", values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

// const [user,setUser]=useState

  return (
    <Fragment>
      <div className="loginBackground">
        <div className="forgotContainer">
          <div className="">
            <Form
              name="basic"
              initialValues={{ remember: true }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              className="login-form"
              // size={size}
            >
              <h2>Buy Hotspot Plan</h2>
              {/* =============== Email ============== */}
              <Form.Item
                name="Username"
                rules={[{ required: true, message: "Please input username!" }]}
              >
                <Input placeholder="Username" size={size} />
              </Form.Item>

              {/* =============== Password ============== */}
              <Form.Item
                name="password"
                rules={[{ required: true, message: "Please input password!" }]}
              >
                <Input.Password
                  type="password"
                  placeholder="Password"
                  size={size}
                />
              </Form.Item>
              <Form.Item label="Plan Date:" size={size}>
                <Radio.Group defaultValue="15days" buttonStyle="solid">
                  <Radio.Button value="15days">15 Days</Radio.Button>
                  {/* <Radio.Button value="5days">5 Days</Radio.Button> */}
                </Radio.Group>
              </Form.Item>

              {/* =============== Button Submit ============== */}
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="login-form-button"
                  size={size}
                >
                  Submit
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Buy_plan;
