import React, { Fragment, useState } from "react";
import { Form, Input, Button, Checkbox } from "antd";
import { Link } from "react-router-dom";

import image_animation from "../../../assets/images/password.jpg";
import bottom_image from "../../../assets/images/image_02.png";

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

const ForgotPassword = () => {
  const [size] = useState("large");
  const onFinish = (values) => {
    console.log("Success:", values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <Fragment>
      <div className="loginBackground">
        <div className="forgot-password">
          <img
            src={image_animation}
            alt="image animation"
            className="forgot-image"
          ></img>
          {/* text under password image */}
          <h4>Forgot Password?</h4>
          <p>
            <span>
              We just need your registered email to send you password reset
            </span>{" "}
          </p>
        </div>
        {/* Bottom image  */}
        <img
          src={bottom_image}
          alt="bottom logo"
          className="bottom-image"
        ></img>

        <div className="forgotContainer">
          <div className="">
            <Form
              name="basic"
              initialValues={{ remember: true }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              className="forgotPassword-form"
              // size={size}
            >
              {/* <h3>Forgot Password</h3> */}
              {/* =============== Email ============== */}
              <Form.Item
                name="email"
                rules={[
                  { type: "email", message: "The input is not valid email" },
                  { required: true, message: "Please input your email!" },
                ]}
              >
                <Input placeholder="Email" size={size} />
              </Form.Item>

              {/* =============== Button Submit ============== */}
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="forgot-form-button"
                  size={size}
                >
                  Confirm
                </Button>
                <br />
                <br/>
                Back to <a href="">Login!</a>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default ForgotPassword;
