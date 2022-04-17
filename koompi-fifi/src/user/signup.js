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
import icon from "../assets/images/img1.png";
import icon2 from "../assets/images/img2.png";
import icon3 from "../assets/images/img3.png";
import koompi from "../assets/images/icons/KOOMPI-Wifi.png";
import { UserOutlined, UnlockOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

const SignUP = () => {
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
                  <p className="create-account">Create a new account!</p>
                </center>
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

                  {/* =================== Password ================= */}
                  <Col xl={24} lg={24} sm={24} xs={24}>
                    <Form.Item
                      label="Password"
                      name="password"
                      rules={[
                        {
                          required: true,
                          message: "Please input your password!",
                        },
                      ]}
                    >
                      <Input.Password
                        type="password"
                        className="academyInputLarge"
                        prefix={<UnlockOutlined />}
                      />
                    </Form.Item>
                  </Col>
                  <Col xl={24} lg={24} sm={24} xs={24}>
                    <Form.Item
                      label="Confirm Password"
                      name="confirm"
                      dependencies={["password"]}
                      hasFeedback
                      rules={[
                        {
                          required: true,
                          message: "Please confirm your password!",
                        },
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            if (!value || getFieldValue("password") === value) {
                              return Promise.resolve();
                            }

                            return Promise.reject(
                              new Error(
                                "The two passwords that you entered do not match!"
                              )
                            );
                          },
                        }),
                      ]}
                    >
                      <Input.Password
                        type="password"
                        className="academyInputLarge"
                        prefix={<UnlockOutlined />}
                      />
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
                    SIGN IN
                  </Button>
                </Form.Item>
                <div>
                  <span>Don't have an account?</span>
                  <Link to="/" className="sign-up">
                    SING UP
                  </Link>
                </div>
              </Form>
            </Col>
            <Col span={12}>
              <div className="container-login-form">
                <div className="login-header-contaner"></div>
                <center>
                  <Carousel autoplay>
                    <div className="carousel-login-container">
                      <img src={icon} alt="icon" className="login-img" />
                      <h2>Connect people around the world</h2>
                      <p>koompi Wi-Fi hotspot is accessable and affordable</p>
                    </div>
                    <div className="carousel-login-container">
                      <img src={icon2} alt="icon" className="login-img" />
                      <h2>Live your life smarter with us!</h2>
                      <p>for everyone and koompi school partner</p>
                    </div>
                    <div className="carousel-login-container">
                      <img src={icon3} alt="icon" className="login-img" />
                      <h2>Get a new experience of imagination</h2>
                      <p>
                        We all are connected by the internet, like neurons in a
                        giant brain
                      </p>
                    </div>
                  </Carousel>
                </center>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </React.Fragment>
  );
};

export default SignUP;
