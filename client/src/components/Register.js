import React, { useState } from "react";
import axios from "axios";
import {
  Form,
  Input,
  Tooltip,
  Cascader,
  Select,
  Row,
  Col,
  Checkbox,
  Button,
  AutoComplete,
  DatePicker
} from "antd";
import moment from "moment";
import { QuestionCircleOutlined } from "@ant-design/icons";

const { Option } = Select;
const AutoCompleteOption = AutoComplete.Option;
const residences = [
  {
    value: "asia",
    label: "Asia",
    children: [
      {
        value: "cambodia",
        label: "Camboia",
        children: [
          {
            value: "phnom penh",
            label: "Phnom Penh"
          },
          {
            value: "kandal",
            label: "Kandal"
          },
          {
            value: "banteay meanchey",
            label: "Banteay Meanchey"
          }
        ]
      }
    ]
  },
  {
    value: "america",
    label: "America",
    children: [
      {
        value: "usa",
        label: "USA",
        children: [
          {
            value: "california",
            label: "California"
          }
        ]
      }
    ]
  }
];
const formItemLayout = {
  labelCol: {
    xs: {
      span: 24
    },
    sm: {
      span: 8
    }
  },
  wrapperCol: {
    xs: {
      span: 24
    },
    sm: {
      span: 16
    }
  }
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0
    },
    sm: {
      span: 16,
      offset: 8
    }
  }
};

const RegistrationForm = () => {
  const [form] = Form.useForm();

  const onFinish = values => {
    console.log("Received values of form: ", values);
  };

  const prefixSelector = (
    <Form.Item name="prefix" noStyle>
      <Select
        style={{
          width: 75
        }}
      >
        <Option value="855">+855</Option>
        <Option value="1">+1</Option>
      </Select>
    </Form.Item>
  );
  const dateFormatList = ["DD/MMMM/YYYY", "DD/MMMM/YY"];
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
    fullname: "",
    address: "",
    phone: "",
    date: ""
  });
  const { email, password, fullname, address, phone, date } = inputs;
  // const onSubmitForm = e => {
  //   const body = { email, password, fullname, address, phone, date };

  //   e.preventDefault();
  //   try {
  //     const response = await axios.post("http://localhost:5000/api/auth/register");
  //   } catch (error) {
  //     console.error(error.message);
  //   }
  // };
  // const onSubmitForm =()=>{
  //   fetch.get("http://localhost:5000/api/auth/register", {

  //   });
  // };
  return (
    <Form
      {...formItemLayout}
      form={form}
      name="register"
      className="register-form"
      onFinish={onFinish}
      initialValues={{
        residence: ["asia", "cambodia", "phnom penh"],
        prefix: "855"
      }}
      scrollToFirstError
      // onSubmit={onSubmitForm}
    >
      <h1>Login</h1>
      <Form.Item
        name="email"
        label="E-mail"
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
        value={email}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="password"
        label="Password"
        rules={[
          {
            required: true,
            message: "Please input your password!"
          }
        ]}
        hasFeedback
        value={password}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        name="confirm"
        label="Confirm Password"
        dependencies={["password"]}
        hasFeedback
        rules={[
          {
            required: true,
            message: "Please confirm your password!"
          },
          ({ getFieldValue }) => ({
            validator(rule, value) {
              if (!value || getFieldValue("password") === value) {
                return Promise.resolve();
              }

              return Promise.reject(
                "The two passwords that you entered do not match!"
              );
            }
          })
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        name="fullname"
        label={
          <span>
            Fullname&nbsp;
            <Tooltip title="What is your name?">
              <QuestionCircleOutlined />
            </Tooltip>
          </span>
        }
        rules={[
          {
            required: true,
            message: "Please input your full name!",
            whitespace: true
          }
        ]}
        value={fullname}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="date"
        label="Date of Birth"
        rules={[
          {
            required: true,
            message: "Please input your birthday!"
          }
        ]}
        hasFeedback
        value={date}
      >
        <DatePicker
          defaultValue={moment("01/01/2000", dateFormatList[0])}
          format={dateFormatList}
        />
      </Form.Item>

      <Form.Item
        name="residence"
        label="Habitual Residence"
        rules={[
          {
            type: "array",
            required: true,
            message: "Please select your habitual residence!"
          }
        ]}
        value={address}
      >
        <Cascader options={residences} />
      </Form.Item>

      <Form.Item
        name="phone"
        label="Phone Number"
        rules={[
          {
            required: true,
            message: "Please input your phone number!"
          }
        ]}
        value={phone}
      >
        <Input
          addonBefore={prefixSelector}
          style={{
            width: "100%"
          }}
        />
      </Form.Item>

      <Form.Item
        name="agreement"
        valuePropName="checked"
        rules={[
          {
            validator: (_, value) =>
              value
                ? Promise.resolve()
                : Promise.reject("Should accept agreement")
          }
        ]}
        {...tailFormItemLayout}
      >
        <Checkbox>
          I have read the <a href="">agreement</a>
        </Checkbox>
      </Form.Item>
      <Form.Item {...tailFormItemLayout}>
        <Button type="primary" htmlType="submit">
          Register
        </Button>
      </Form.Item>
    </Form>
  );
};

export default RegistrationForm;
