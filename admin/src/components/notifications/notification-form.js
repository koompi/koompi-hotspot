import React, { useState } from "react";
import axios from 'axios'
import { Form, Input, Button, Row, Col, Upload, message } from "antd";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";

const { TextArea } = Input;
const getToken = localStorage.getItem('token')

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
}

function beforeUpload(file) {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    message.error("You can only upload JPG/PNG file!");
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("Image must smaller than 2MB!");
  }
  return isJpgOrPng && isLt2M;
}

const FormNotification = () => {
  const [state, setState] = useState(false);
  const onSubmit = (value) => {
    const auth = {
      Authorization: "Bearer " + getToken,
    };
    // var bodyFormData = new FormData();
    // bodyFormData.append('file', value.imageUrl);
    // bodyFormData.append('title', value.title);
    // bodyFormData.append('category', value.category);
    // bodyFormData.append('description', value.desc);

   const data={
      file: imageUrl,
      title : value.title,
      category : value.category,
      description : value.desc, 

    };
    // console.log(data);

     axios({
       method: "POST",
       url:"http://localhost:5000/api/admin/notification",
       data,
       headers:{
        "Content-Type": "multipart/form-data",
          ...auth,
       },
     })
       .then((res) => {
        console.log("notification",res.data);        
      })
      .catch((err) => console.log(err));
  };

  const handleChange = (info) => {
    if (info.file.status === "uploading") {
      setState({ loading: true });
      return;
    }
    if (info.file.status === "done") {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, (imageUrl) =>
        setState({
          imageUrl,
          loading: false,
        })
      );
    }
  };
  // const handleChange = (info)=> {
  //   if (info.file.status !== 'uploading') {
  //     console.log(info.file, info.fileList);
  //   }
  //   if (info.file.status === 'done') {
  //     message.success(`${info.file.name} file uploaded successfully`);
  //   } else if (info.file.status === 'error') {
  //     message.error(`${info.file.name} file upload failed.`);
  //   }
  // };

  const { loading, imageUrl } = state;
  const uploadButton = (
    <div className="uploading-notifications">
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <React.Fragment>
      <div className="contentContainer-auto">
        <Form layout="vertical" size="large" onFinish={onSubmit}>
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
                    <TextArea rows={1} className="schoolInput" />
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
                    <TextArea rows={8} className="schoolInput" />
                  </Form.Item>
                </Col>
              </Row>
            </Col>
            <Col span={8}>
            <Form.Item
                    label="Category"
                    name="category"
                    rules={[
                      {
                        required: true,
                        message: "Please input the message category!",
                      },
                    ]}
                  >
                  <TextArea rows={1} className="schoolInput" />
            </Form.Item>
            <Form.Item
                label="Uplaod image here"
                name="upload_img"
                rules={[
                  {
                    required: true,
                    message: "Please uplaod the image!",
                  },
                ]}
              >
                <Upload
                  name="avatar"
                  listType="picture-card"
                  className="avatar-uploader"
                  showUploadList={false}
                  action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                  // beforeUpload={beforeUpload}
                  onChange={handleChange}
                >
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt="avatar"
                      style={{ width: "100%" }}
                    />
                  ) : (
                    uploadButton
                  )}
                </Upload>
              </Form.Item>
            </Col>
          </Row>
          <Button type="primary" className="publish-button" htmlType="submit">
            Publish
          </Button>
        </Form>
      </div>
    </React.Fragment>
  );
};





export default FormNotification;

