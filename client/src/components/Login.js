import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import { Form, Input, Button, Checkbox } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";

const Login = ({ setAuth }) => {
  const onFinish = async body => {
    // body.preventDefault();// use outside ant design
    try {
      // const body = values;
      const response = await fetch(
        "http://ec2-52-221-199-235.ap-southeast-1.compute.amazonaws.com:5000/api/auth/login",
        {
          method: "POST",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify({
            email: body.email,
            password: body.password
          })
        }
      );

      const parseRes = await response.json();
      // console.log(parseRes);
      if (parseRes.token) {
        localStorage.setItem("token", parseRes.token);
        setAuth(true);
        toast.success("Login successfully");
      } else {
        setAuth(false);
        toast.error(parseRes);
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <Fragment>
      <Form
        name="normal_login"
        className="login-form"
        initialValues={{
          remember: true
        }}
        onFinish={onFinish}
      >
        <Form.Item
          name="email"
          rules={[
            {
              type: "email",
              message: "The input is not valid E-mail!"
            },
            {
              required: true,
              message: "Please input your E-mail!"
            }
          ]}
        >
          <Input
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="E-mail"
          />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: "Please input your Password!"
            }
          ]}
        >
          <Input
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="Password"
          />
        </Form.Item>
        <Form.Item>
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <a className="login-form-forgot" href="">
            Forgot password
          </a>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
          >
            Log in
          </Button>
          Or
          <Link to="/register"> register now!</Link>
        </Form.Item>
      </Form>
    </Fragment>
  );
};

export default Login;
