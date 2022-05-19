import React, { useEffect,useState } from 'react';
import { Form,Button,List } from 'antd';
import ProForm, {
  ModalForm
} from '@ant-design/pro-form';
import { accountBindLog} from '@/services/activity-management/spring-festival-build-building-activity';
import moment from 'moment'


export default (props) => {
  const { visible, setVisible,phones,onClose} = props;
  const [form] = Form.useForm();
  return (
    <ModalForm
      title='查看指定中奖人'
      onVisibleChange={setVisible}
      visible={visible}
      width={1000}
      form={form}
      modalProps={{
        forceRender: true,
        destroyOnClose: true,
        onCancel: () => {
          onClose();
        }
      }}
      submitter={{
        render: (props, defaultDoms) => {
            return []
        },
        }}
        onFinish={async (values) => {
        }} 
    >
        <List
              itemLayout="horizontal"
              dataSource={phones?.split(',')}
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta
                    title={item}
                  />
                </List.Item>
              )}
        />
    </ModalForm >
  );
};