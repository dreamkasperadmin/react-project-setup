import { Button, Card, Spin } from 'antd';
import { map } from 'lodash';
import React, { useRef, useState } from 'react';
import CommonUpload from '../../components/CommonUpload';
import './dashboard.less'; // individual css file that you can import

const Dashboard = () => {
  const buttonRef = useRef();
  const [imageUrls, setImageUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imageAdded, setImageAdded] = useState(true);

  return (
    <>
      <Card>
        <div className="d-flex align-center justify-between">
          <h1 className="aaaaa">Dashboard</h1>
        </div>
        <hr />
      </Card>
      <div className="mt-10 width-percent-20">
        <CommonUpload
          buttonRef={buttonRef}
          setImageUrls={setImageUrls}
          setLoading={setLoading}
          showPreviewIcon
          listType="picture-card"
          imageUrls={imageUrls}
          multiple
          setImageAdded={setImageAdded}
        />
        <Button
          disabled={imageAdded}
          onClick={() => {
            buttonRef?.current?.click();
          }}
        >
          OK
        </Button>
        {loading && <Spin className="d-flex justify-center" />}
        {imageUrls &&
          map(imageUrls, (image) => {
            return (
              <img
                key={image?.id}
                className="d-flex mt-10"
                src={image?.url}
                alt="upload-test"
                width="300px"
              />
            );
          })}
      </div>
    </>
  );
};

export default Dashboard;
