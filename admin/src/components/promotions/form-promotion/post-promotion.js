import React,{useEffect,useState} from "react";
import { Form, Input, Button, Row, Col, Table, Tag, Select } from "antd";
import axios from 'axios';

const getToken = localStorage.getItem('token')
const { Option } = Select;

const PostPromotion = () => {

  const [ ,setLoading] = useState(false);
  const [promotions, setPromotion] = useState([]);

  useEffect(() => {
    setLoading(true);
    const auth = {
      Authorization: "Bearer " + getToken,
    };
    // axios({
    //   method: "GET",
    //   url: "http://localhost:5000/api/admin/set-discount",
    //   headers: {
    //     "content-type": "application/json; charset=utf-8",
    //     ...auth,
    //   },
    // })
    //   .then((res) => {
    //     setPromotion(res.data);
    //     console.log(setPromotion);
    //     setTimeout(() => {
    //       setLoading(false);
    //     }, 1000);
    //   })
    //   .catch((err) => console.log(err));
  }, []);  

  function onChange(value) {
    console.log(`selected ${value}`);
  }

  return (
    <React.Fragment>  
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
  </React.Fragment>
);
};

export default PostPromotion;
