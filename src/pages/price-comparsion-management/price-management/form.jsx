import React, { useRef, useState, useEffect  } from 'react';
import { message, Form } from 'antd';
import ProTable from '@ant-design/pro-table';
import { ModalForm } from '@ant-design/pro-form';
import { bindSkuId } from '@/services/cms/member/member';

export default (props) => {
  const { setVisible, formData, setResData, resData, Listdata, visible } = props;
  const [arr, setArr] = useState(null)
  const formRef = useRef();
  const [form] = Form.useForm()
  const columns = [
    {
      title: 'skuid',
      dataIndex: 'sku',
      valueType: 'text',
    },
    {
      title: 'spuid',
      dataIndex: 'spu',
      valueType: 'text',
    },
    {
      title: '商品名称',
      dataIndex: 'skuName',
      valueType: 'text',
      search: false,
    },
    {
      title: '商品价格',
      dataIndex: 'price',
      valueType: 'money',
      search: false,
    },
  ];

  const waitTime = () => {
    console.log('绑定前formData', formData)
    const param = {
      goodsSkuId: formData.goodsSkuId,
      goodsSpuId: formData.goodsSpuId,
      sourceType: formData.sourceType,
      skuId: arr[0].sku,
    }
    return new Promise((resolve,reject) => {
      bindSkuId(param).then((res) => {
        if (res.code === 0) {
          setResData({
            ...resData,
            [param.sourceType]:{
              sku: param.skuId,
              price: arr[0].price,
              url: resData[param.sourceType].url,
            }
          })
          resolve(true)
        } else {
          reject(false)
          return
        }
      })
  
    });
  };

  useEffect(() => {
    if (Listdata) {
      form.setFieldsValue({
        ...Listdata
      })
    }
  }, [Listdata])

  return (
    <ModalForm
      title={'请选择您需要比价的商品规格'}
      onVisibleChange={setVisible}
      formRef={formRef}
      visible={visible}
      form={form}
      submitter={{
        searchConfig: {
          submitText: '确定',
          resetText: '取消',
        },
      }}
      drawerprops={{
        forceRender: true,
        destroyOnClose: true,
      }}
      onFinish={async () => {
        if ( arr === null || arr.length > 1 ) {
          message.error('请选择一种规格!');
          return false;
        }
        await waitTime();
        message.success('绑定成功');
        // 不返回不会关闭弹框
        return true;
      }}
    >
<ProTable
      style={{
        height: 500,
        overflowY: "auto"
      }}
      rowKey="id"
      options={false}
      columns={columns}
      params={Listdata}
      dataSource={Listdata}
      rowSelection={{
        // 自定义选择项参考: https://ant.design/components/table-cn/#components-table-demo-row-selection-custom
        // 注释该行则默认不显示下拉选项
        // selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT],
      }}
      tableAlertOptionRender={(a) => {
        setArr(a.selectedRows)
      }}
      search={false}
      pagination={false}
      dateFormatter="string"
      headerTitle="添加比价商品"
    />
    </ModalForm>
  );
};