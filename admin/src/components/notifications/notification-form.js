import React, { useState } from "react";
import { Form, Input, Button, Row, Col, Upload, message } from "antd";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import axios from "axios";

const { TextArea } = Input;

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

  const { loading, imageUrl } = state;
  const uploadButton = (
    <div className="uploading-notifications">
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  const onSubmit = data => {
    console.log("Success:", data);
    const contentData = {
      title: data.title,
      description: data.description,
      image: 'notification_1626256683554.jpg'
    };

    axios
      .post(
        "https://api-hotspot-dev.koompi.org/api/admin/notification/",
        contentData,
        // setLoading(true)
      )
      .then(async (res) => {
        // setLoading(true);
        message.success("Added Successfully.");
        // message.success(res.data.message);

        const { token } = res.data;
        await localStorage.setItem("token", token);
        window.location.replace("/dashboard");
      })
      .catch(async (err) => {
        setTimeout(() => {
          // setLoading(false);
        }, 1000);
        console.log(err);
        await message.error(err.message);
        // await message.error("Code invalid.");
      });
  };

  return (
    <React.Fragment>
      <div className="contentContainer-auto">
        <Form layout="vertical" size="large">
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
                label="Uplaod image here"
                name="uplaod img"
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
                  beforeUpload={beforeUpload}
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
          <Button type="primary" className="publish-button">
            {" "}
            Publish
          </Button>
        </Form>
      </div>
    </React.Fragment>
  );
};

export default FormNotification;
