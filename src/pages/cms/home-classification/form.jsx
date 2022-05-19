import React, { useRef, useEffect, useState } from 'react';
import { message, Form, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import ProForm, {
  ProFormSwitch,
  ModalForm,
  DrawerForm,
  ProFormText,
  ProFormRadio,
} from '@ant-design/pro-form';
import ProCard from '@ant-design/pro-card';
import { homeClassCategorySecondCategory } from '@/services/cms/member/member';

export default (props) => {
  const { detailData, setVisible, onClose, visible, onChangeSwitch, verifyVersionId } = props;
  const formRef = useRef();
  const [list, setList] = useState()
  const [form] = Form.useForm();

  const waitTime = () => {
    return new Promise((resolve) => {
      resolve(true);
    });
  };

  useEffect(() => {
    const param = {
      parentId: detailData.id,
    }
    if (verifyVersionId) {
      param.verifyVersionId = verifyVersionId
    }
    homeClassCategorySecondCategory(param).then((res) => {
      setList(res.data.records)
    })
  }, [])

  return (
    <ModalForm
      width={560}
      title={`${detailData.gcName}`}
      onVisibleChange={setVisible}
      submitter={{
        resetButtonProps: {
          style: {
            display: 'none',
          },
        },
        submitButtonProps: {
          style: {
            display: 'none',
          },
        },
      }}
      formRef={formRef}
      visible={visible}
      form={form}
      drawerProps={{
        forceRender: true,
        destroyOnClose: true,
        onClose: () => {
          onClose();
        }
      }}
      onFinish={async (values) => {
        await waitTime(values);
        message.success('提交成功');
        // 不返回不会关闭弹框
        return true;
      }}
    >
      <ProForm.Group>
        二级分类
      </ProForm.Group>
      <ProForm.Group>
        {list&&<ProCard>
          {list.map((item) => {
            return <ProForm.Group style={{borderBottom: '1px solid #f0f0f0'}}>
              <Avatar shape="square" size={64} icon={<UserOutlined />} src={item.gcIcon}/>
              <ProCard style={{width: 280}}>{item.gcName}</ProCard>
              <ProFormSwitch
                name={item.id}
                fieldProps={{
                  style: {marginTop: 24},
                  defaultChecked:item.homeStatus?true:false,
                  onChange: (a) => {
                    onChangeSwitch(a,item)
                  },
                }}
              />
              </ProForm.Group>
          })}
        </ProCard>}
      </ProForm.Group>
      <ProFormText
        name="id"
        label="id"
        hidden
      />
    </ModalForm>
  );
};