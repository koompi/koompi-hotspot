import React, { Fragment, useState } from "react";
import { Form, Input, Button, Checkbox, message } from "antd";
import { Link, useHistory } from "react-router-dom";
import jwt from "jsonwebtoken";
import axios from "axios";

import logo from "../../assets/images/koompi_logo_signal.png";
import image_animation from "../../assets/images/digital_nomad.png";
import bottom_image from "../../assets/images/image_02.png";

const Login = () => {
  const history = useHistory();
  const [size] = useState("large");
  const [loading, setLoading] = useState(false);
  // const [message, setMessage] = useState("");
  const onSubmit = (data) => {
    console.log("Success:", data);
    const userLogin = {
      email: data.email,
      password: data.password,
    };
    axios
      .post(
        "https://api-hotspot.koompi.org/api/auth/login",
        userLogin,
        setLoading(true)
      )
      .then(async (res) => {
        setLoading(true);
        message.success("Login successfully.");
        // message

        const { token } = res.data;
        await localStorage.setItem("token", token);
        history.push("/buy-hotspot");
      })
      .then(() => {
        let token = localStorage.getItem("token");
        let user = jwt.decode(token);
      })
      .catch((err) => {
        setTimeout(() => {
          setLoading(false);
        }, 1000);
        message.error(err.response.data);
        // console.log(err.response.data);
      });
  };

  return (
    <Fragment>
      <div className="koompi-hotspot">
        <img src={logo} alt="logo" className="logo" />
        <h2>Koompi Hotspot Wi-Fi</h2>
      </div>
      <div className="loginBackground">
        <img
          src={image_animation}
          alt="image animation"
          className="koompi-hotspot-image"
        ></img>
        {/* Bottom image  */}
        <img
          src={bottom_image}
          alt="bottom logo"
          className="bottom-image"
        ></img>

        <div className="loginContainer">
          <div className="">
            <Form
              name="basic"
              initialValues={{ remember: true }}
              onFinish={onSubmit}
              className="login-form"
              // size={size}
            >
              <h2>Sign In</h2>
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

              {/* =============== Password ============== */}
              <Form.Item
                name="password"
                rules={[
                  { required: true, message: "Please input your password!" },
                ]}
              >
                <Input.Password
                  type="password"
                  placeholder="Password"
                  size={size}
                />
              </Form.Item>

              {/* =============== Remember and Forgot password ============== */}

              <Form.Item>
                {/* <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox>Remember me</Checkbox>
                </Form.Item> */}

                <Link to="forgot-passwd" className="login-form-forgot">
                  Forgot password
                </Link>
              </Form.Item>

              {/* =============== Button Submit ============== */}
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="login-form-button"
                  size={size}
                >
                  Log in
                </Button>
                <br />
                Don't have an account? <Link to="/register">register now!</Link>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Login;
