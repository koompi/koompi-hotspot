import React,{useSelector,useState} from "react";
import { Form, Input, Button, Row, Col, Select } from "antd";
import axios from 'axios';

const getToken = localStorage.getItem('token')
const { Option } = Select;

const PostPromotion = () => {

  const [ ,setLoading] = useState(false);
  const [promotions, setPromotion] = useState([]);
  // const [value, setValue] = useSelector();

  // useEffect((data) => {
  //   setLoading(true);
  //   const auth = {
  //     Authorization: "Bearer " + getToken,
  //   };
  //   const body={
  //     role: data.role,
  //     discount: data.discount
  //   }
  //   axios({
  //     method: "POST",
  //     url: "http://localhost:5000/api/admin/set-discount",body,
  //     headers: {
  //       "content-type": "application/json; charset=utf-8",
  //       ...auth,
  //     },
      
  //   })
  //     .then((res) => {
  //       setPromotion(res.data);
  //       console.log(setPromotion);
  //       setTimeout(() => {
  //         setLoading(false);
  //       }, 1000);
  //     })
  //     .catch((err) => console.log(err));
  // }, []);  


  const onSubmit = (data) => {
    const auth = {
      Authorization: "Bearer " + getToken,
    };
    const body = { 
      role: data.role,
      discount : data.discount 
    };

    console.log(typeof  data.role);

     axios({
       method: "POST",
       url:"http://localhost:5000/api/admin/set-discount",body,
       headers:{
        "content-type": "application/json; charset=utf-8",
              ...auth,
       },
      
     })
       .then((res) => {
        setPromotion(res.data);
        console.log("promostion",res.data);
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      })
      .catch((err) => console.log(err));
  };

  function onChange(value) {
    console.log(`selected ${value}`);
  }

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
                    // onChange={ onChange}
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
              <Button type="primary" className="publish-button2" type="primary" htmlType="submit">
                  Publish
              </Button>
            </Form.Item>
        </Form>
  </React.Fragment>
);
};

export default PostPromotion;

