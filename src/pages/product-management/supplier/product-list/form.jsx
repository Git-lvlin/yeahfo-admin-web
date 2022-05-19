import React from 'react';
import ProForm, {
  ModalForm,
  ProFormText,
} from '@ant-design/pro-form';

export default (props) => {
  const { visible, setVisible, getData } = props;
  return (
    <ModalForm
      title="生成规格配置表"
      modalProps={{
        width: 740,
      }}
      onFinish={async (values) => {
        getData(values)
        return true;
      }}
      onVisibleChange={setVisible}
      visible={visible}
      initialValues={{
        // retailSupplyPrice: 1,
        // suggestedRetailPrice: 1,
        // wholesalePrice: 1,
        // wholesaleMinNum: 1,
        // stockAlarmNum: 1,
        // stockNum: 1,
        // salePrice: 1,
        // marketPrice: 1,
      }}
    >
      <p>请输入要批量填写的规格参数。</p>
      <p style={{ color: 'red' }}>若已输入规格参数，重新批量填写会将已有的规格参数全部重置，请确认后操作！</p>
      <ProForm.Group>
        <ProFormText
          width="md"
          name="retailSupplyPrice"
          label="供货价"
          placeholder="请输入供货价"
          rules={[{ required: true, message: '请输入供货价' }]}
        />
        <ProFormText
          width="md"
          name="marketPrice"
          label="市场划线价"
          placeholder="请输入市场划线价"
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormText
          width="md"
          name="stockAlarmNum"
          label="库存预警值"
          placeholder="请输入库存预警值"
        />

        <ProFormText
          width="md"
          name="stockNum"
          label="可用库存"
          placeholder="请输入可用库存"
          rules={[{ required: true, message: '请输入可用库存' }]}
        />
      </ProForm.Group>
    </ModalForm >
  );
};