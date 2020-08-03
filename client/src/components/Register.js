import React from "react";
import { Link } from "react-router-dom";
// import axios from "axios";

import {
  Form,
  Input,
  Tooltip,
  Cascader,
  Select,
  Checkbox,
  Button,
  DatePicker
} from "antd";
import moment from "moment";
import { QuestionCircleOutlined } from "@ant-design/icons";

const { Option } = Select;
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
      </Select>
    </Form.Item>
  );
  const dateFormatList = ["DD/MMMM/YYYY", "DD/MMMM/YY"];

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
      <h1>Register</h1>
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
      <Link to="/login">Login</Link>
    </Form>
  );
};

export default RegistrationForm;
