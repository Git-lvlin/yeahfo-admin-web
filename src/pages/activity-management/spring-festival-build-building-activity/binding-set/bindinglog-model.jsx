import React, { useEffect,useState } from 'react';
import { Form,Button,List } from 'antd';
import ProForm, {
  ModalForm
} from '@ant-design/pro-form';
import { accountBindLog} from '@/services/activity-management/spring-festival-build-building-activity';
import moment from 'moment'


export default (props) => {
  const { visible, setVisible,formDetail,onClose} = props;
  const [detailList,setDetailList]=useState()
  const [form] = Form.useForm();
  useEffect(()=>{
    accountBindLog({memberId:formDetail?.memberId}).then(res=>{
      if(res.code==0){
        setDetailList(res.data)
      }
    })
  },[])
  return (
    <ModalForm
      title='绑定记录'
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
            return <Button type="primary" onClick={()=>{setVisible(false);onClose()}}>知道了</Button>
        },
        }}
        onFinish={async (values) => {
        }} 
    >
        <List
              itemLayout="horizontal"
              dataSource={detailList}
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta
                    title={
                        <> 
                        <p>支付宝账号：{item?.withdrawAccount}</p>
                        <p>支付宝真实姓名：{item?.withdrawRealname}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span>绑定时间：{moment(parseInt(item?.createTime)).format('YYYY-MM-DD HH:mm:ss')}</span></p>
                        </>
                    }
                  />
                </List.Item>
              )}
        />
    </ModalForm >
  );
};