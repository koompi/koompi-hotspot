import React, { Fragment, useState } from "react";
import { Form, Input, Button, DatePicker, Space, Select } from "antd";
import { useHistory } from "react-router-dom";

const { RangePicker } = DatePicker;
const { Option } = Select;

const CompleteInfo = () => {
  const [size] = useState("large");
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const onFinish = (data) => {
    // console.log("Success:", values);

    const info = {
      name: data.Name,
      gender: data.Gender,
      email: data.Email,
      birthdate: data.DOB,
      address: data.Location,
    };
    console.log(data);
    console.log(`selected ${data.value}`);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  function handleChangeGender(gender) {
    // Select
    console.log(`selected ${gender}`);
  }
  function handleChangeLocation(location) {
    console.log(`selected ${location}`);
  }

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
              // size={size}
            >
              <h3>Complete Information</h3>
              {/* Full Name */}
              <Form.Item
                name="Name"
                rules={[
                  { required: true, message: "Please input your full name!" },
                ]}
              >
                <Input placeholder="Full name" size={size} />
              </Form.Item>

              <Form.Item
                name="Email"
                rules={[
                  { type: "email", message: "The input is not valid email" },
                  { required: true, message: "Please input your email!" },
                ]}
              >
                <Input placeholder="Enter your email again" size={size} />
              </Form.Item>

              {/* =============== date picker ============== */}
              <Form.Item>
                <Space direction="vertical">
                  <DatePicker
                    name="DOB"
                    size={size}
                    className="input-full-in"
                    placeholder="Date of Birth"
                    format="DD-MMM-YYYY"
                  ></DatePicker>
                </Space>
              </Form.Item>

              {/* =============== select Gender & Location ============== */}
              <Form.Item>
                <Select
                  className="input-full-in"
                  placeholder="Gender"
                  name="Gender"
                  optionFilterProp="value"
                  size={size}
                  onChange={(gender) => {
                    alert(gender);
                  }}
                >
                  <Option value="Male">Male</Option>
                  <Option value="Female">Female</Option>
                </Select>
              </Form.Item>
              <Form.Item name="Location">
                <Select
                  className="input-full-in"
                  placeholder="Location"
                  // optionFilterProp="location"
                  size={size}
                  onClick={handleChangeLocation}
                >
                  <Option location="Banteay Meanchey">Banteay Meanchey</Option>
                  <Option location="Battambang">Battambang</Option>
                  <Option location="Kampong Cham">Kampong Cham</Option>
                  <Option location="Kampong Chhnang">Kampong Chhnang</Option>
                  <Option location="Kampong Speu">Kampong Speu</Option>
                  <Option location="Kampong Thom">Kampong Thom</Option>
                  <Option location="Kampot">Kampot</Option>
                  <Option location="Kandal">Kandal</Option>
                  <Option location="Kep">Kep</Option>
                  <Option location="Koh Kong">Koh Kong</Option>
                  <Option location="Kratié">Kratié</Option>
                  <Option location="Mondulkiri">Mondulkiri</Option>
                  <Option location="Oddar Meanchey">Oddar Meanchey</Option>
                  <Option location="Pailin">Pailin</Option>
                  <Option location="Phnom Penh">Phnom Penh</Option>
                  <Option location="Preah Vihear">Preah Vihear</Option>
                  <Option location="Preah Sihanouk">Preah Sihanouk</Option>
                  <Option location="Prey Veng">Prey Veng</Option>
                  <Option location="Pursat">Pursat</Option>
                  <Option location="Ratanak Kiri">Ratanak Kiri</Option>
                  <Option location="Siem Reap">Siem Reap</Option>
                  <Option location="Stung Treng">Stung Treng</Option>
                  <Option location="Takéo">Takéo</Option>
                  <Option location="Tboung Khmum">Tboung Khmum</Option>
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
