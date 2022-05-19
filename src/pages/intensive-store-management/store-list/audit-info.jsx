import React, { useState, useEffect } from 'react';
import { Button, Drawer, Space, Spin, Form, Image } from 'antd';
import { getDetail } from '@/services/intensive-store-management/store-detail';

const Detail = ({ storeNo, visible, setVisible }) => {
  const [detailData, setDetailData] = useState({});
  const [loading, setLoading] = useState(false);
  const getDetailRequest = () => {
    setLoading(true);
    getDetail({
      storeNo
    }).then(res => {
      if (res.code === 0) {
        setDetailData({
          ...res.data,
          storeNo,
        })
      }
    }).finally(() => {
      setLoading(false);
    })
  }

  useEffect(() => {
    getDetailRequest();
  }, [])

  return (
    <Drawer
      title="店铺审核资料"
      width={500}
      placement="right"
      onClose={() => { setVisible(false) }}
      visible={visible}
      footer={
        <div style={{ textAlign: 'right' }}>
          <Space>
            <Button onClick={() => { setVisible(false) }}>返回</Button>
          </Space>
        </div>
      }
    >
      <Spin spinning={loading}>
        <Form>
          <Form.Item
            label="手机号"
          >
            {detailData?.memberPhone}
          </Form.Item>
          <Form.Item
            label="店铺名称"
          >
            {detailData?.storeName}
          </Form.Item>
          <Form.Item
            label="身份证号码"
            required
          >
            {detailData?.memberShop?.applyRow?.idNumber}
          </Form.Item>
          <Form.Item
            label="审核资料文件"
            required
          >
            <Space>
              <Image width={100} src={detailData?.memberShop?.applyRow?.idFront} />
              <Image width={100} src={detailData?.memberShop?.applyRow?.idBack} />
              <Image width={100} src={detailData?.memberShop?.applyRow?.idHandheld} />
            </Space>
          </Form.Item>
          <Form.Item
            label="申请时间"
          >
            {detailData?.memberShop?.applyRow?.createTime}
          </Form.Item>
        </Form>
      </Spin>
    </Drawer>
  )
}

export default Detail;
