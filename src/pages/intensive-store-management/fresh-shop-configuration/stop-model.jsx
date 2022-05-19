import React, { useEffect } from 'react';
import { Form,message,  Button } from 'antd';
import ProForm, {
  ModalForm,
  ProFormText
} from '@ant-design/pro-form';
import { allowAreaEdit } from '@/services/intensive-store-management/fresh-shop-configuration'
import { ExclamationCircleFilled} from '@ant-design/icons';

export default (props) => {
  const { visible, setVisible, callback,onClose,formDetail} = props;
  const [form] = Form.useForm()
  return (
    <ModalForm
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
            return [
              <Button  key="cacnl" onClick={() =>{setVisible(false);onClose()}}>
                  取消
              </Button>,
              <Button  type="primary" key="submit" onClick={() => {
                  props.form?.submit?.()
                }}>
                  继续
              </Button>
            ];
        },
        }}
        onFinish={async (values) => {
          allowAreaEdit({
            status: formDetail.status === 'on' ? 'off' : 'on',
            regionId: formDetail.regionId,
            cityId: formDetail.cityId,
            provinceId: formDetail.provinceId,
          }, { showSuccess: true })
            .then(res => {
              if (res.code === 0) {
                setVisible(false)
                callback(true)
              }
            })

        }}
    >
        <p><ExclamationCircleFilled style={{color:'#FEA82F'}}/> {formDetail.status === 'on' ?'确定要禁用么？':'确定要启用么？'}</p>
    </ModalForm >
  );
};