import React, { Fragment, useState } from "react";
import { Form, Input, Button, message } from "antd";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";

import { UserOutlined, LockOutlined } from "@ant-design/icons";

import logo from "../../assets/images/koompi_logo_signal.png";
// import image_animation from "../../assets/images/digital_nomad.png";
// import bottom_image from "../../assets/images/image_02.png";

const Login = () => {
  const history = useHistory();
  const [size] = useState("large");
  const [loading, setLoading] = useState(false);
  const onSubmit = data => {
    console.log("Success:", data);
    const adminLogin = {
      email: data.email,
      password: data.password
    };

    axios
      .post(
        "http://localhost:5000/api/auth/admin/login",
        adminLogin,
        setLoading(true)
      )
      .then(async res => {
        const { token } = res.data;
        await localStorage.setItem("token", token);
        console.log(token);
      })
      .then(async res => {
        setLoading(true);
        message.success("Please check your email.");
        // message.success(res.data.message);

        history.push("/admin/login/confirm-admin");
      })

      .catch(err => {
        setTimeout(() => {
          setLoading(false);
        }, 1000);
        message.error(err.response.data.message);
      });
  };

  return (
    <Fragment>
      <div className="loginBackground">
        <div className="loginContainer-admin">
          <div className="">
            <Form
              name="basic"
              initialValues={{ remember: true }}
              onFinish={onSubmit}
              className="login-form"
              // size={size}
            >
              <div className="admin">
                <img src={logo} alt="logo" className="logo-admin" />
                <h2>KOOMPI Fi-Fi Admin</h2>
              </div>
              {/* =============== Email ============== */}
              <Form.Item
                name="email"
                rules={[
                  { type: "email", message: "The input is not valid email" },
                  { required: true, message: "Please input your email!" }
                ]}
              >
                <Input
                  prefix={<UserOutlined className="site-form-item-icon" />}
                  placeholder="Admin"
                  size={size}
                />
              </Form.Item>

              {/* =============== Password ============== */}
              <Form.Item
                name="password"
                rules={[
                  { required: true, message: "Please input your password!" }
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined className="site-form-item-icon" />}
                  type="password"
                  placeholder="Password"
                  size={size}
                />
              </Form.Item>

              {/* =============== Remember and Forgot password ============== */}

              <Form.Item>
                {/* <Link to="forgot-passwd" className="login-form-forgot"> */}
                Forgot password
                {/* </Link> */}
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
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Login;
