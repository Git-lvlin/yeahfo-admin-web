import React, { useRef, useEffect, useState } from 'react';
import { message, Form } from 'antd';
import ProForm, {
  ModalForm,
  DrawerForm,
  ProFormText,
  ProFormRadio,
  ProFormTextArea,
} from '@ant-design/pro-form';
import Upload from '@/components/upload';
import { homeActivityUpdata } from '@/services/cms/member/member';

export default (props) => {
  const { detailData, setVisible, onClose, visible, useType } = props;
  const formRef = useRef();
  const [form] = Form.useForm();
  const [href, setHref] = useState('');
  const [showType, setShowType] = useState(false);
  const urlArr = [
    '',
    `${APP_URL}/tab/index?index=2`,
    `${APP_URL}/tab/index?index=4`,
    `${APP_URL}/flutter/store/member/index`,
    `${APP_URL}/tab/index?index=1`,
    `${APP_URL}/home/spikeGoods`,
    `${APP_URL}/home/spikeWeek`,
    `${MARKET_URL}/web/five-star-qa?_authorizationRequired=1`,
  ];

  const select1 = [
    {
      label: '固定展示',
      value: 1,
    },
    {
      label: '有集约内容才展示',
      value: 2,
    },
  ]
  const select2 = [
    {
      label: '固定展示',
      value: 1,
    }
  ]
  const waitTime = (values) => {
    const { id, ...rest } = values
    const param = {
      ...rest,
      useType: useType
    }
    if (id) {
      param.id = id
    }
    param.actionUrl = href
    return new Promise((resolve, reject) => {
      homeActivityUpdata(param).then((res) => {
        if (res.code === 0) {
          resolve(true);
        } else {
          reject(false);
        }
      })

    });
  };

  useEffect(() => {
    if (detailData) {
      const { actionUrl, ...rest } = detailData;
      setHref(actionUrl)
      form.setFieldsValue({
        ...rest
      })
    }
  }, [form, detailData])

  return (
    <ModalForm
      title={`${detailData ? '编辑' : '新建'}首页活动入口`}
      onVisibleChange={setVisible}
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
        <ProFormText
          width="sm"
          name="title"
          label="活动标题"
          rules={[{ required: true, message: '请输入活动标题' }]}
          fieldProps={{
            maxLength: 10
          }}
        />
      </ProForm.Group>
      <ProForm.Group>
        <Form.Item
          label="添加活动图片"
          name="image"
          required
          rules={
            [{
              required: true,
              message: '请上传活动图片'
            }]
          }
          tooltip={
            <dl>
              <dt>图片要求</dt>
              <dd>90*90</dd>
              <dd>支持png,jpg,gif</dd>
            </dl>
          }
        >
          {/* <Upload multiple maxCount={1} code={201} accept="image/*" proportion={{width: 90, height: 90,}} /> */}
          <Upload multiple maxCount={1} code={201} />
        </Form.Item>
      </ProForm.Group>
      <ProForm.Group>
        <ProFormText
          width="sm"
          name="sort"
          label="排序"
          rules={[{ required: true, message: '请输入排序序号' }]}
        />

      </ProForm.Group>
      <ProFormRadio.Group
        name="customerType"
        label="展示对象"
        initialValue={1}
        rules={[{ required: true, message: '请选择展示对象' }]}
        options={[
          {
            label: '所有用户',
            value: 1,
          },
          {
            label: '全部店主可见',
            value: 2,
          },
          {
            label: '仅生鲜店主可见',
            value: 3,
          },
          {
            label: '仅普通店主可见',
            value: 4,
          }
        ]}
      />
      <ProFormRadio.Group
        name="actionUrlType"
        label="url类型"
        initialValue={8}
        rules={[{ required: false, message: '请选择url类型' }]}
        fieldProps={{
          onChange: ({ target }) => {
            if (target.value == 1) {
              setShowType(true)
            } else {
              setShowType(false)
            }
            if (target.value == 8) {
              setHref('')
            } else {
              setHref(urlArr[target.value])
            }
          }
        }}
        options={[
          {
            label: '集约',
            value: 1,
          },
          {
            label: '个人中心',
            value: 2,
          },
          {
            label: '社区店',
            value: 3,
          },
          {
            label: '限时秒杀',
            value: 4,
          },
          {
            label: '秒约爆品',
            value: 5,
          },
          {
            label: '周末大狂欢',
            value: 6,
          },
          {
            label: '店主升星',
            value: 7,
          },
          {
            label: '自定义',
            value: 8,
          },
        ]}
      />
      <ProFormRadio.Group
        name="showType"
        label="展示类型"
        initialValue={1}
        rules={[{ required: true, message: '请选择展示类型' }]}
        options={showType ? select1 : select2}
      />
      <ProForm.Group>
        <ProFormTextArea
          width="lg"
          name="actionUrl"
          fieldProps={{
            value: href,
            onChange: ({ target }) => {
              console.log(target.value)
              setHref(target.value)
            }
          }}
          label="跳转链接"
          validateFirst
          rules={[
            { required: false, message: '请输入跳转链接' },
            () => ({
              required: false,
              validator(_, value) {
                if (/\s/g.test(value)) {
                  return Promise.reject(new Error('链接不能包含空格'));
                }
                return Promise.resolve();
              },
            })
          ]}
        />
      </ProForm.Group>

      <ProFormRadio.Group
        name="state"
        label="活动状态"
        initialValue={0}
        options={[
          {
            label: '启用',
            value: 1,
          },
          {
            label: '关闭',
            value: 0,
          },
        ]}
      />
      <ProFormText
        name="id"
        label="id"
        hidden
      />
    </ModalForm>
  );
};