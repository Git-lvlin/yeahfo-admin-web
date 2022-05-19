import React, { useRef, useEffect, useState } from 'react';
import { Form,List,Image,Divider,Avatar} from 'antd';
import ProForm, {
  DrawerForm,
} from '@ant-design/pro-form';


export default (props) => {
  const { setVisible, visible,attachList,onClose} = props;
  const formRef = useRef();
  const ref = useRef();
  const [form] = Form.useForm()
  const onsubmit = (values) => {
  };
  return (
    <DrawerForm
      onVisibleChange={setVisible}
      formRef={formRef}
      visible={visible}
      form={form}
      width={1000}
      drawerProps={{
        forceRender: true,
        destroyOnClose: true,
        onClose: () => {
          onClose();
        }
      }}
      submitter={
        {
          render: (props, defaultDoms) => {
            return [];
          }
        }
      }
      onFinish={async (values) => {
        await onsubmit(values);
      }}
    >
      <List
        grid={{
          gutter: 16,
          xs: 1,
          sm: 2,
          md: 4,
          lg: 4,
          xl: 6,
          xxl: 3,
        }}
        dataSource={attachList}
        renderItem={item => (
          <List.Item>
            <Image src={item}/>
          </List.Item>
        )}
      />
    </DrawerForm>
  );
};