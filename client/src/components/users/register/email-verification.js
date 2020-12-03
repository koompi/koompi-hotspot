import React, { Fragment, useState } from "react";
import { Form, InputNumber, Button, Input, message } from "antd";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";

import image_animation from "../../../assets/images/email-verification.png";
import bottom_image from "../../../assets/images/image_02.png";

const Email_verification = () => {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [size] = useState("large");
  const onFinish = (data) => {
    const activateAcc = {
      email: data.Email,
      vCode: data.Code.toString(),
    };
    axios
      .post(
        "https://api-hotspot.koompi.org/api/auth/confirm-email",
        activateAcc
      )
      .then((res) => {
        console.log(res);
        if (res.data === "Incorrect Code!") {
          message.error(res.data);
          setLoading(false);
        }
        if (res.data === "Correct Code.") {
          message.success(res.data);
          setLoading(true);
          history.push("/complete-info");
        }
      })
      .catch(async (err) => {
        setTimeout(() => {
          setLoading(false);
        }, 1000);
        await message.error(err.response.data);
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
          <h3>Email Verification</h3>
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
                name="Email"
                rules={[
                  { type: "email", message: "The input is not valid email" },
                  { required: true, message: "Please input your email!" },
                ]}
              >
                <Input placeholder="Enter your email again" size={size} />
              </Form.Item>

              <Form.Item
                name="Code"
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
                {/* <br />
                <br />
                Back to <Link to="/login">Login!</Link> */}
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Email_verification;
