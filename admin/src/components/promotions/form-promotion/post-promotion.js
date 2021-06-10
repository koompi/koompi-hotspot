import React from "react";
import { Form, Input, Button, Row, Col, Select } from "antd";
import axios from 'axios';

const getToken = localStorage.getItem('token')
const { Option } = Select;

const PostPromotion = () => {
  const onSubmit = (value) => {
    const auth = {
      Authorization: "Bearer " + getToken,
    };
    const data = { 
      role: value.role,
      discount : value.discount 
    };

     axios({
       method: "POST",
       url:"http://localhost:5000/api/admin/set-discount",data,
       headers:{
        "Content-Type": "application/json; charset=utf-8",
          ...auth,
       },
     })
       .then((res) => {
        console.log("promostion",res.data);        
      })
      .catch((err) => console.log(err));
  };

  return (
    <React.Fragment>  
      <Form layout="vertical" size="large" onFinish={onSubmit}>
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
                    filterOption={(input, option) =>
                      option.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    <Option value="teacher">Teacher</Option>
                    <Option value="student">Student</Option>
                    <Option value="others">Others</Option>
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
            <Form.Item>
              <Button 
              type="primary"
                  htmlType="submit"
                  className="publish-button2"
                  size="large"
              >
                  Publish
              </Button>
            </Form.Item>
        </Form>
     </React.Fragment>
  );
};

export default PostPromotion;

