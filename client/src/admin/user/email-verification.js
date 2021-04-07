import React, { Fragment, useState } from "react";
import { Form, InputNumber, Button, message } from "antd";
import { useHistory, Link } from "react-router-dom";
import axios from "axios";

import image_animation from "../../assets/images/email-verification.png";
import bottom_image from "../../assets/images/image_02.png";

// const apiUrl = "http://localhost:5000/api/auth/admin/";
const accessToken = localStorage.getItem("token");

const authAxios = axios.create({
  headers: {
    Authorization: `Bearer ${accessToken}`
  }
});

const Email_verification = () => {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [size] = useState("large");
  const onFinish = data => {
    const verifyAcc = {
      vCode: data.code.toString()
    };

    authAxios
      .post(
        `http://localhost:5000/api/auth/admin/confirm-admin`,
        verifyAcc,
        setLoading(true)
      )
      .then(async res => {
        
        // setLoading(true);
        message.success("Login successfully.");
        // message.success(res.data.message);

        const { token } = res.data;
        await localStorage.setItem("token", token);
        history.push("/admin/home");
      })
      .catch(async err => {
        setTimeout(() => {
          setLoading(false);
        }, 1000);
        console.log(err);
        // await message.error(err.message);
        await message.error("Code invalid.");
      });
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
          <h3>Admin Verification</h3>
          <p>
            Check your email account <span>{/* kalin@gmal.com */}</span>
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
              className="forgotPassword-form"
            >
              {/* =============== email verification code ============== */}
              {/* =============== Email ============== */}

              <Form.Item
                name="code"
                rules={[{ required: true, message: "Please input code!" }]}
              >
                <InputNumber
                  min={100000}
                  max={1000000 - 1}
                  size={size}
                  className="input-code"
                  placeholder="Enter your code"
                />
              </Form.Item>

              {/* =============== Button Submit ============== */}
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="verification-cofirm-button"
                  size={size}
                >
                  Confirm
                </Button>
                <br />
                <br />
                Back to <Link to="/admin/login">Login!</Link>
                <br />
                try again <Link to="">Try again!</Link>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Email_verification;
