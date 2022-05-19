import React, { useRef, useEffect, useState } from 'react';
import { message, Form } from 'antd';
import ProForm, {
  DrawerForm,
  ProFormText,
  ProFormRadio,
  ProFormSelect,
  ProFormTextArea,
} from '@ant-design/pro-form';
import Upload from '@/components/upload';
import CheckBox from '@/components/checkbox';
import { bannerAdd } from '@/services/cms/member/member';

export default (props) => {
  const { detailData, setVisible, onClose, visible, verifyVersionId } = props;
  const formRef = useRef();
  const [form] = Form.useForm();
  const [nowIndex, setNowIndex] = useState(0);
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
  const picSize = [
    false,
    {
      width: 350,
      height: 150,
    },
    {
      width: 375,
      height: 160,
    },
    {
      width: 351,
      height: 65,
    },
    {
      width: 375,
      height: 150,
    },
    {
      width: 375,
      height: 160,
    },
    {
      width: 375,
      height: 160,
    },
    {
      width: 375,
      height: 160,
    },
    {
      width: 351,
      height: 100,
    },
    {
      width: 351,
      height: 100,
    },
  ]

  const waitTime = (values) => {
    const { id, ...rest } = values
    const param = {
      ...rest
    }
    if (id) {
      param.id = id
    }
    if (detailData) {
      if (param.location.length > 1) {
        param.location = {
          '首页': 1,
          '集约': 2,
          '个人中心': 3,
          '社区店': 4,
          '秒约爆品': 6,
          '周末狂欢': 7,
          '拼团': 9,
        }[detailData.location]
      }
    }
    param.actionUrl = href
    if (verifyVersionId) {
      param.verifyVersionId = verifyVersionId
    }
    return new Promise((resolve, reject) => {
      bannerAdd(param).then((res) => {
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
      setNowIndex(detailData.location)
      setHref(detailData.actionUrl)
      if (!detailData.actionUrlType) {
        detailData.actionUrlType = 8
      }
      if (detailData.actionUrlType == 1) {
        setShowType(true)
      }
      detailData.location = {
        1: '首页',
        2: '集约',
        3: '个人中心',
        4: '社区店',
        6: '秒约爆品',
        7: '周末狂欢',
        9: '拼团',
      }[detailData.location]
      const { ...rest } = detailData;
      console.log('detailData', detailData)
      form.setFieldsValue({
        ...rest
      })
    }
  }, [form, detailData])

  return (
    <DrawerForm
      title={`${detailData ? '编辑' : '新建'}`}
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
        return true;
      }}
    >
      <ProForm.Group>
        <ProFormSelect
          name="location"
          label="位置"
          valueEnum={{
            1: '首页',
            2: '集约',
            3: '个人中心',
            4: '社区店',
            6: '秒约爆品',
            7: '周末狂欢',
            9: '拼团',
          }}
          placeholder="选择位置"
          rules={[{ required: true, message: '请选择位置!' }]}
          fieldProps={{
            onChange: (e) => {
              setNowIndex(e)
            }
          }}
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormText
          width="sm"
          name="title"
          label="banner名称"
          rules={[{ required: true, message: '请输入banner名称' }]}
        />
      </ProForm.Group>
      <ProForm.Group>
        <Form.Item
          label="添加图片"
          name="image"
          required
          rules={
            [{
              required: true,
              message: '请上传图片'
            }]
          }
        >
          <Upload multiple maxCount={1} code={201} accept="image/*" proportion={picSize[nowIndex] || 'banner'} />
        </Form.Item>
        <div>
          <dl>
            <dt>图片要求</dt>
            <dd>首页banner-350*150</dd>
            <dd>集约页面banner-375*160</dd>
            <dd>个人中心banner-351*65</dd>
            <dd>社区店专享banner-375*150</dd>
            <dd>秒约爆品banner-375*160</dd>
            <dd>周末狂欢banner-375*160</dd>
            <dd>拼团banner-351*100</dd>
          </dl>
        </div>
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
        rules={[{ required: true, message: '请选择展示对象!' }]}
        options={nowIndex == 8 ?
          [{
            label: '所有用户',
            value: 1,
          }]
          : [
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
        rules={[{ required: false, message: '请选择url类型!' }]}
        fieldProps={{
          onChange: ({ target }) => {
            if ((target.value == 1 && nowIndex == 2) || (target.value == 2 && nowIndex == 3) || (target.value == 3 && nowIndex == 4) || (target.value == 5 && nowIndex == 6) || target.value == 6 && nowIndex == 7) {
              message.error('点击banner跳转去的页面不能与banner所在位置页面相同，请重新选中或此项置空')
              form.setFieldsValue({
                actionUrlType: 8
              })
              return
            }
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
        name="showType"
        label="展示类型"
        initialValue={1}
        rules={[{ required: true, message: '请选择展示类型!' }]}
        options={showType ? select1 : select2}
      />
      {/* <Form.Item
        name="test"
      >
        <CheckBox
          options={[{
            label: '安卓',
            value: '1',
          }, {
            label: '苹果',
            value: '2',
          }]}
        />
      </Form.Item> */}
      <ProFormRadio.Group
        name="state"
        label="上线/下架"
        initialValue={0}
        options={[
          {
            label: '上线',
            value: 1,
          },
          {
            label: '下架',
            value: 0,
          },
        ]}
      />
      <ProFormText
        name="id"
        label="id"
        hidden
      />
    </DrawerForm>
  );
};