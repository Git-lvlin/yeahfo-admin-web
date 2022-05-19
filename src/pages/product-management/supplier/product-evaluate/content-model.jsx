import React, { useRef, useEffect, useState } from 'react';
import { message, Form,Space,Button,Modal,List,Image,Divider,Avatar} from 'antd';
import ProForm, {
  DrawerForm,
  ProFormText,
  ProFormRadio,
  ProFormSelect,
  ProFormTextArea
} from '@ant-design/pro-form';
import { history } from 'umi'
import { findContent } from '@/services/product-management/product-evaluate';
import styles from './style.less'


export default (props) => {
  const { setVisible, visible,id } = props;
  const formRef = useRef();
  const ref = useRef();
  const [form] = Form.useForm()
  const [dataList,setDataList]=useState()

  const onsubmit = (values) => {
  };

  useEffect(() => {
    findContent({id:id}).then(res=>{
     if(res.code==0){
      setDataList(res.data)
     }
    })
  }, [])
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
      className={styles.content_model}
    >
      <p>{dataList?.content}</p>
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
        dataSource={dataList?.imgs}
        renderItem={item => (
          <List.Item>
            <Image src={item}/>
          </List.Item>
        )}
      />
      <Divider />
      <List
        header={<div>商家回复</div>}
        dataSource={dataList?.applyList}
        renderItem={item => (
          <List.Item style={{display:'block'}}>
            <List.Item.Meta
              avatar={<Avatar src={dataList?.storeImg} />}
              title={dataList?.storeName}
              description={<span style={{fontSize:'10px'}}>{item.replyTime}</span>}
            />
            <pre className={styles.line_feed}>
              {item.replyContent}
            </pre>
          </List.Item>
        )}
      />
    </DrawerForm>
  );
};