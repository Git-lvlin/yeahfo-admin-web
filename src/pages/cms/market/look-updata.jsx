import React, { useRef, useEffect, useState } from 'react';
import { message, Form, Button } from 'antd';
import ProForm, {
  ModalForm,
  ProFormText,
} from '@ant-design/pro-form';
import Upload from '@/components/upload';
import { merketDetailUpdata } from '@/services/cms/member/member';
import SelectProductModal from '@/components/select-product-modal'

export default (props) => {
  const { detailDataz, setVisible, visible, setFlag } = props;
  const formRef = useRef();
  const [form] = Form.useForm();
  const [index, setIndex] = useState(false);
  const [selectType, setSelectType] = useState(false);
  const waitTime = (values) => {
    const { ...rest } = values
    let param = {
      ...rest
    }
    if (detailDataz.id) {
      param.id = detailDataz.id
    }
    if (index.spuId) {
      param.actionUrl = `https://publicmobile-uat.yeahgo.com/web/market?spuId=${index.spuId}&skuId=${index.skuId}&orderType=${index.orderType}`
    } else {
      param.actionUrl = ''
    }
    return new Promise((resolve, reject) => {
      merketDetailUpdata(param).then((res) => {
        if (res.code === 0) {
          setFlag(true)
          resolve(true);
        } else {
          reject(false);
        }
      })
  
    });
  };

  useEffect(() => {
    if (index.spuId) {
      form.setFieldsValue({
        actionUrl: `https://publicmobile-uat.yeahgo.com/web/market?spuId=${index.spuId}&skuId=${index.skuId||''}&orderType=${index.orderType}`
      })
    }
  }, [index])

  useEffect(() => {
    if (detailDataz) {
      console.log('编辑回显数据detailDataz', detailDataz);
      const { ...rest } = detailDataz;
      form.setFieldsValue({
        ...rest
      })
    }
  }, [form, detailDataz])

  return (
    <ModalForm
      title={`${detailDataz ? '编辑' : '新建'}`}
      onVisibleChange={setVisible}
      formRef={formRef}
      visible={visible}
      form={form}
      drawerProps={{
        forceRender: true,
        destroyOnClose: true,
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
          label="区块名称"
          rules={[{ required: true, message: '请输入区块名称' }]}  
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
          tooltip={
            <dl>
              <dt>图片要求</dt>
              <dd>暂未限制</dd>
            </dl>
          }
        >
          <Upload multiple maxCount={1} code={201} accept="image/*" />
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
      <ProForm.Group >
        <Button key="button" type="primary" onClick={() => { setSelectType(true) }}>
          选择商品
        </Button>
        {index.goodsName&&<span>选中商品：{index.goodsName || '-'}</span>}
      </ProForm.Group>
      <ProForm.Group>
        <ProFormText
            width="sm"
            name="actionUrl"
            label="跳转链接"
            disabled={true}
            rules={[{ required: false, message: '请输入跳转链接' }]}  
          />
      </ProForm.Group>
      <ProFormText
        name="itemId"
        label="itemId"
        hidden
      />
      {selectType&&<SelectProductModal
        visible={selectType}
        setVisible={setSelectType}
        callback={(v) => {
          if (v.length > 1) {
            message.success('只能添加单个商品!');
            return
          }
          console.log(v);setIndex(v[0]) 
        }}
      />}
    </ModalForm>
  );
};