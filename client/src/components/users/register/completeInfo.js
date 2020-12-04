import React, { Fragment, useState } from "react";
import { Form, Input, Button, DatePicker, Select, message } from "antd";
import { useHistory } from "react-router-dom";
import axios from "axios";

const { Option } = Select;

const CompleteInfo = () => {
  const [size] = useState("large");
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const onFinish = (data) => {
    const info = {
      name: data.name,
      gender: data.gender,
      email: data.email,
      birthdate: data.dob.format("DD-MMM-YYYY"),
      address: data.location,
    };
    axios
      .put("https://api-hotspot.koompi.org/api/auth/complete-info", info)
      .then((res) => {
        console.log(res);
        if (res.data === "Completed Info.") {
          message.success(res.data);
          setLoading(true);
          history.push("/login");
        } else {
          message.error(res.data);
          setLoading(false);
        }
      })
      .catch(async (err) => {
        setTimeout(() => {
          setLoading(false);
        }, 1000);
        await message.error(err.response.data);
      });

    console.log(info);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <Fragment>
      <div className="loginBackground">
        <div className="loginContainer">
          <div className="">
            <Form
              name="basic"
              initialValues={{ remember: true }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              className="login-form"
            >
              <h3>Complete Information</h3>
              {/* Full Name */}
              <Form.Item
                name="name"
                rules={[
                  { required: true, message: "Please input your full name!" },
                ]}
              >
                <Input placeholder="Full name" size={size} />
              </Form.Item>

              <Form.Item
                name="email"
                rules={[
                  { type: "email", message: "The input is not valid email" },
                  { required: true, message: "Please input your email!" },
                ]}
              >
                <Input placeholder="Enter your email again" size={size} />
              </Form.Item>

              {/* =============== date picker ============== */}
              <Form.Item name="dob">
                <DatePicker
                  size={size}
                  className="input-full-in"
                  placeholder="Date of Birth"
                  format="DD-MMM-YYYY"
                />
              </Form.Item>

              {/* =============== select Gender & Location ============== */}
              <Form.Item name="gender">
                <Select
                  className="input-full-in"
                  placeholder="Gender"
                  size={size}
                >
                  <Option value="Male">Male</Option>
                  <Option value="Female">Female</Option>
                </Select>
              </Form.Item>
              <Form.Item name="location">
                <Select
                  showSearch
                  className="input-full-in"
                  placeholder="Location"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                  filterSort={(optionA, optionB) =>
                    optionA.children
                      .toLowerCase()
                      .localeCompare(optionB.children.toLowerCase())
                  }
                  size={size}
                >
                  <Option value="Banteay Meanchey">Banteay Meanchey</Option>
                  <Option value="Battambang">Battambang</Option>
                  <Option value="Kampong Cham">Kampong Cham</Option>
                  <Option value="Kampong Chhnang">Kampong Chhnang</Option>
                  <Option value="Kampong Speu">Kampong Speu</Option>
                  <Option value="Kampong Thom">Kampong Thom</Option>
                  <Option value="Kampot">Kampot</Option>
                  <Option value="Kandal">Kandal</Option>
                  <Option value="Kep">Kep</Option>
                  <Option value="Koh Kong">Koh Kong</Option>
                  <Option value="Kratié">Kratié</Option>
                  <Option value="Mondulkiri">Mondulkiri</Option>
                  <Option value="Oddar Meanchey">Oddar Meanchey</Option>
                  <Option value="Pailin">Pailin</Option>
                  <Option value="Phnom Penh">Phnom Penh</Option>
                  <Option value="Preah Vihear">Preah Vihear</Option>
                  <Option value="Preah Sihanouk">Preah Sihanouk</Option>
                  <Option value="Prey Veng">Prey Veng</Option>
                  <Option value="Pursat">Pursat</Option>
                  <Option value="Ratanak Kiri">Ratanak Kiri</Option>
                  <Option value="Siem Reap">Siem Reap</Option>
                  <Option value="Stung Treng">Stung Treng</Option>
                  <Option value="Takéo">Takéo</Option>
                  <Option value="Tboung Khmum">Tboung Khmum</Option>
                </Select>
              </Form.Item>

              {/* =============== Button Submit ============== */}
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className=""
                  size={size}
                >
                  ￼ Submit
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default CompleteInfo;
