import React, { useState } from 'react';
import { Form, Button, Upload as AntUpload } from 'antd';
import {
  ModalForm,
} from '@ant-design/pro-form';
import { LoadingOutlined, UploadOutlined } from '@ant-design/icons'
import { ruleGoodsExportTemplate, ruleGoodsImport } from '@/services/single-contract-activity-management/activity-list'
import upload from '@/utils/upload'


export default (props) => {
  const { visible, setVisible, callback } = props;
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  const formItemLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 14 },
    layout: {
      labelCol: {
        span: 8,
      },
      wrapperCol: {
        span: 14,
      },
    }
  };

  const customRequest = ({ file }) => {
    setLoading(true);
    upload(file, 206)
      .then(res => {
        ruleGoodsImport({
          ruleGoodsFile: res
        }).then(res => {
          if (res.code === 0) {
            setData(res.data)
          }
        }).finally(() => {
          setLoading(false);
        })
      })

  }

  const download = () => {
    ruleGoodsExportTemplate()
      .then(res => {
        if (res.code === 0) {
          const a = document.createElement('a');
          a.setAttribute('download', '');
          a.setAttribute('href', res.data.url);
          a.click();
        }
      })
  }

  return (
    <ModalForm
      title={<div>批量导入商品  <span style={{ fontSize: 12 }}>导入添加活动商品信息</span></div>}
      modalProps={{
      }}
      onVisibleChange={setVisible}
      visible={visible}
      width={500}
      onFinish={() => {
        callback(data);
        return true;
      }}
      labelAlign="right"
      {...formItemLayout}
    >
      <Form.Item
        label="导入商品"
        name="template"
      >
        <AntUpload
          customRequest={customRequest}
          maxCount={1}
          showUploadList={false}
        >
          <Button icon={loading ? <LoadingOutlined /> : <UploadOutlined />}>导入</Button>
          <span style={{ color: 'red', marginLeft: 10 }}>最多500条记录</span>
        </AntUpload>
      </Form.Item>
      <Form.Item
        label="下载导入商品模板"
        name="template"
      >
        <Button style={{ width: 82 }} onClick={download}>下载</Button>
      </Form.Item>
      {data.length!==0 &&<div>导入成功{data.length}条记录</div>}
    </ModalForm>
  );
};