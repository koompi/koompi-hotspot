import React, { Fragment, useState } from "react";
import { Form, Input, Button, message } from "antd";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";

import { UserOutlined, LockOutlined } from "@ant-design/icons";

import logo from "../assets/images/koompi_logo_signal.png";
import pic_02 from "../assets/images/image_02.png";

const Login = () => {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const onSubmit = data => {
    console.log("Success:", data);
    const adminLogin = {
      email: data.email,
      password: data.password
    };

    axios
      .post(
        `http://localhost:5000/api/auth/admin/login`,
        adminLogin,
        setLoading(true)
      )
      .then(async res => {
        const { token } = res.data;
        await localStorage.setItem("token", token);
      })
      .then(async res => {
        setLoading(true);
        message.success("Please check your email.");
        // message.success(res.data.message);

        // history.push("/verify");
        // window.location.replace("/verify");
        window.location.replace("/dashboard");
      })

      .catch(err => {
        setTimeout(() => {
          setLoading(false);
        }, 1000);
        // message.error(err);
      });
  };

  return (
    <Fragment>
      <div className="loginBackground">
        <div className="loginContainer-admin">
          <div className="">
            <Form
              layout="vertical"
              name="basic"
              initialValues={{ remember: true }}
              onFinish={onSubmit}
              className="login-form"
            >
              <div className="admin">
                <img src={logo} alt="logo" className="logo-admin" />
                {/* <h2>KOOMPI Fi-Fi Admin</h2> */}
              </div>
              {/* =============== Email ============== */}
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { type: "email", message: "The input is not valid email" },
                  { required: true, message: "Please input your email!" }
                ]}
              >
                <Input
                  prefix={<UserOutlined className="site-form-item-icon" />}
                  placeholder="example@gmail.com"
                  size="large"
                />
              </Form.Item>

              {/* =============== Password ============== */}
              <Form.Item
                label="Password"
                name="password"
                rules={[
                  { required: true, message: "Please input your password!" }
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined className="site-form-item-icon" />}
                  type="password"
                  placeholder="Password"
                  size="large"
                />
              </Form.Item>

              {/* =============== Remember and Forgot password ============== */}

              <Form.Item>
                {/* <Link to="forgot-passwd" className="login-form-forgot"> */}
                <p className="forgot-pass">Forgot password</p>
                {/* </Link> */}
              </Form.Item>

              {/* =============== Button Submit ============== */}
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="login-form-button"
                  size="large"
                >
                  Log in
                </Button>
                <br />
              </Form.Item>
            </Form>
          </div>
        </div>
        <div className="container-login-image">
          <img src={pic_02} alt="login" className="login-img" />
        </div>
      </div>
    </Fragment>
  );
};

export default Login;
