import React from "react";
import { Form, Input, Button, Row, Col, Table, Tag, Select } from "antd";
import data_discount from "./form-promotion.json";

const { Option } = Select;

const PromotionForm = () => {
  function onChange(value) {
    console.log(`selected ${value}`);
  }

  const columns = [
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role) => {
        if (role === "Teacher" || role === "teacher") {
          return <Tag color="processing">{role}</Tag>;
        } else {
          return <Tag color="warning">{role}</Tag>;
        }
      },
    },

    {
      title: "Discount",
      dataIndex: "discount",
      key: "discount",
    },

    {
      title: "Actions",
      width: "20%",
      dataIndex: "",
      key: "",
      render: () => {
        return (
          <React.Fragment>
            <Tag color="#108ee9">Edit</Tag>
            <Tag color="#f50">Delete</Tag>
          </React.Fragment>
        );
      },
    },
  ];

  return (
    <React.Fragment>
      <Form layout="vertical" size="large">
        <Row gutter={[24, 24]}>
          <Col span={10}>
            <div className="contentContainer-auto">
              <Row gutter={[32, 0]}>
                <Col span={24}>
                  <Form.Item
                    label="Select role"
                    name="role"
                    rules={[
                      {
                        required: true,
                        message: "Please select the role!",
                      },
                    ]}
                  >
                    <Select
                      showSearch
                      style={{ width: "100%" }}
                      placeholder="Selecting role"
                      optionFilterProp="children"
                      onChange={onChange}
                      filterOption={(input, option) =>
                        option.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      <Option value="jack">Teacher</Option>
                      <Option value="lucy">Student</Option>
                      <Option value="tom">Others</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item
                    label="Discount"
                    name="discount"
                    rules={[
                      {
                        required: true,
                        message: "Please input the discount!",
                      },
                    ]}
                  >
                    <Input className="schoolInput" />
                  </Form.Item>
                </Col>
              </Row>
              <Button type="primary" className="publish-button2">
                Publish
              </Button>
            </div>
          </Col>
          <Col span={14}>
            <div className="contentContainer-auto">
              <Table dataSource={data_discount} columns={columns} />
            </div>
          </Col>
        </Row>
      </Form>
    </React.Fragment>
  );
};

export default PromotionForm;
