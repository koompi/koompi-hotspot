import React, { useState } from "react";
import {
  Input,
  Button,
  Form,
  Col,
  Row,
  message,
  notification,
  Space,
  Carousel,
} from "antd";
import axios from "axios";
import icon from "../assets/images/img4.png";

import koompi from "../assets/images/icons/KOOMPI-Wifi.png";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [, setLoading] = useState(false);

  // const onSubmit = async (data) => {
  //   const adminLogin = {
  //     username: data.username,
  //     password: data.password,
  //   };
  //   await axios
  //     .post(`${baseUrl}/user/login`, adminLogin, setLoading(true))
  //     .then((res) => {
  //       if (res.data.operation_status === "Success") {
  //         localStorage.setItem("token", res.data.token);
  //         setLoading(true);
  //         message.success("Successful!");
  //         window.location.replace("/status");
  //       } else {
  //         setLoading(true);
  //         message.error("Invalide username or password ");
  //         setLoading(false);
  //       }
  //     })

  //     .catch((err) => {
  //       setTimeout(() => {
  //         setLoading(false);
  //       }, 1000);
  //       message.error(err.response.data.reason);
  //     });
  // };

  return (
    <React.Fragment>
      <div className="loginBackground">
        <div className="loginContainer">
          <Row gutter={12}>
            <Col span={12}>
              <Form
                className="login-form"
                layout="vertical"
                size="large"
                // onFinish={onSubmit}
              >
                {/* =================== Email ================= */}
                <center>
                  <img src={koompi} alt="icon" className="login-icon" />
                </center>

                <div className="reset-form-container">
                  <h3>Enter your the code sent: </h3>
                  <Row>
                    <Col xl={24} lg={24} sm={24} xs={24}>
                      <Form.Item
                        label="Phone Number"
                        name="phone"
                        rules={[
                          {
                            required: true,
                            message: "Your phone number is invalided!",
                          },
                        ]}
                      >
                        <Input className="academyInputLarge" prefix="+855" />
                      </Form.Item>
                    </Col>
                  </Row>
                  {/* =================== Button Submit ================= */}
                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      className="login-form-button"
                      size="large"
                    >
                      RESET PASSWORD
                    </Button>
                  </Form.Item>
                  <div>
                    <span>Don't have an account?</span>
                    <Link to="/" className="sign-up">
                      LOGIN
                    </Link>
                  </div>
                </div>
              </Form>
            </Col>
            <Col span={12}>
              <div className="container-reset-form">
                <div className="login-header-contaner"></div>
                <center>
                  <h1 className="reset-pass-title">RESET PASSWORD</h1>
                  <div>
                    <img src={icon} alt="icon" className="reset-img" />
                  </div>
                </center>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </React.Fragment>
  );
};

export default ForgotPassword;
