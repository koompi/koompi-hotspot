import React from "react";
import { Form, Row, Col} from "antd";

import GetPromotion from './form-promotion/get-promotion';
import PostPromotion from './form-promotion/post-promotion';

const PromotionForm = () => {
 
  return (
    <React.Fragment>
      <Form layout="vertical" size="large">
        <Row gutter={[24, 24]}>
          <Col span={10}>
            <div className="contentContainer-auto">
              <PostPromotion/>              
            </div>
          </Col>
          <Col span={14}>
            <div className="contentContainer-auto">
              <GetPromotion/>
            </div>
          </Col>
        </Row>
      </Form>
    </React.Fragment>
  );
};

export default PromotionForm;
