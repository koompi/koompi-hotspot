import React, { useState } from "react";
import axios from 'axios'
import { Form, Input, Button, Row, Col, Upload, message,Select } from "antd";
import Modal from "antd/lib/modal/Modal";

const { TextArea } = Input;
const { Option } = Select;
const getToken = localStorage.getItem('token');

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
}

function beforeUpload(file) {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png"|| file.type === "image/gif";
  if (!isJpgOrPng) {
    message.error("You can only upload JPG/PNG file!");
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("Image must smaller than 2MB!");
  }
  return isJpgOrPng && isLt2M;
}

const EditNotification = ({ show, cancel, info }) => {
  const [ state, setState] = useState(false);
  const { imageUrl } = state;
  const [ image, setImage] = useState("");
  const [ form ] = Form.useForm();

  const onSubmit = (value) => {
    const auth = {
      Authorization: "Bearer " + getToken,
    };

    const data={
       image: image,
       title : value.title,
       category : value.category,
       description : value.desc, 

     };

      axios({
        method: "PUT",
        url:`http://localhost:5000/api/admin/notification/${info._id}`,
        headers:{
         "Content-Type": "application/json; charset=utf-8",
           ...auth,
        },
        data,
      })
        .then((res) => {
         message.success(res.data.message);  
       })
       .catch((err) => {
         console.log(err);
         message.error(err);
       });
       
    form.resetFields(); // to clear form
    setState(false);    // to clear image
    
  };

  /*
  info
    file, fileLists

  */

  const handleChange = (info) => {
    if (info.file.status === "uploading") {
      setState({ loading: true });
      return;
    }
    if (info.file.status === "done") {
      setImage(info.file.response.data.name)
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, (imageUrl) =>
        setState({
          imageUrl,
          loading: false,
        })
      );
    }
  };
  

  // const uploadButton = (
  //   <div className="uploading-notifications">
  //     {loading ? <LoadingOutlined /> : <PlusOutlined />}
  //     <div style={{ marginTop: 8 }}>Upload</div>
  //   </div>
  // );

  const {title,category,description} = info;

  return (
    <Modal
      visible={show}
      onCancel={cancel}
      footer={null}
      width={780}
      title="Edit Notification"
      // okText={form.submit}
    >
    
    
      <Form 
        layout="vertical" 
        size="large" 
        onFinish={onSubmit} 
        form={form}
        initialValues={{title,category,}}
      >
          <Row gutter={[32, 32]}>
            <Col span={16}>
              <Row gutter={[32, 0]}>
                <Col span={24}>
                  <Form.Item
                    label="Title"
                    name="title"
                    rules={[
                      {
                        required: true,
                        message: "Please input the message title!",
                      },
                    ]}
                  >
                    <Input className="schoolInput"/>
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item
                    label="Descriptions"
                    name="desc"
                    
                    rules={[
                      {
                        required: true,
                        message: "Please input description details!",
                      },
                    ]}
                  >
                    <TextArea rows={10} className="schoolInput" defaultValue={description}/>
                  </Form.Item>
                </Col>
              </Row>
            </Col>
            <Col span={8}>
              <Form.Item
                    label="Select Category"
                    name="category" 
                    rules={[
                      {
                        required: true,
                        message: "Please select the category!",
                      },
                    ]}
                  >
                    <Select                 
                      showSearch
                      defaultValue={info.category}
                      style={{ width: "100%" }}
                      placeholder="Selecting Category"
                      optionFilterProp="children"                                 
                      filterOption={(input, option) =>
                        option.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      <Option value="News">News</Option>
                      <Option value="Release version">Release version</Option>
                      <Option value="Promotion">Promotion</Option>
                    </Select>
                  </Form.Item>       
              <Form.Item
                label="Uplaod image here"
                name="file"
                rules={[
                  {
                    required: true,
                    message: "Please uplaod the image!",
                  },
                ]}
              >
                <Upload
                  action="http://localhost:5000/api/upload-photo"
                  listType="picture-card"
                  className="avatar-uploader"
                  showUploadList={false}
                  beforeUpload={beforeUpload}
                  onChange={handleChange}
                >
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt="avatar"
                      style={{maxWidth:"100%",maxHeight:"100%"}}
                    />
                  ) : (
                    // uploadButton
                    <img
                      src={"http://localhost:5000/uploads/" + info.image}
                      alt="avatar"
                      style={{maxWidth:"100%",maxHeight:"100%"}}
                    />
                  )}
                  
                </Upload>
              </Form.Item>
            </Col>
          </Row>
          <Button type="primary" className="publish-button" htmlType="submit">
            Edit
          </Button>
        </Form>
      
    
    </Modal>
  );
};

export default EditNotification;
