import React, { Fragment, useState } from "react";
import { Form, Input, Button, message } from "antd";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";

import logo from "../../assets/images/koompi_logo_signal.png";
import image_animation from "../../assets/images/digital_nomad.png";
import bottom_image from "../../assets/images/image_02.png";

const Register = () => {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [size] = useState("large");
  const onFinish = (data) => {
    const newAcc = {
      email: data.email,
      password: data.password,
    };
    axios
      .post(
        "https://api-hotspot.koompi.org/api/auth/register",
        newAcc,
        setLoading(true)
      )
      .then(async (res) => {
        setLoading(true);
        message.success(res.data);

        history.push("/email-verify"); // to if correct, it will like to email verification
      })
      .catch((err) => {
        setTimeout(() => {
          setLoading(false);
        }, 1000);
        message.error(err.response.data);
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
              onFinish={onFinish}
              className="login-form"
              // size={size}
            >
              <h2>Sign up</h2>
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

              {/* =============== Button Submit ============== */}
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="login-form-button"
                  size={size}
                >
                  Register
                </Button>
                <br />
                Already have an account? <Link to="/login">login now!</Link>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Register;
