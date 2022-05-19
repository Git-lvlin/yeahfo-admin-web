import React, { useRef, useEffect, useState } from 'react';
import { message, Form, Button } from 'antd';
import ProTable from '@ant-design/pro-table';
import {
  DrawerForm,
  ProFormText,
} from '@ant-design/pro-form';
import { SetHomePageGoodsDelSort } from '@/services/cms/member/member';
import Edit from './list-form'

export default (props) => {
  const { detailData, setVisible, setFlag, visible } = props;
  const formRef = useRef();
  const [form] = Form.useForm();
  const [listFormVisible, setListFormVisible] = useState(false)
  const [sortValue, setSortValue] = useState(false)
  const [indexGoods, setIndexGoods] = useState(false)

  const waitTime = () => {
    const param = {
      "id": indexGoods.id.toString(),
      "sort": sortValue || 100,
      "opt": "add"
    }
    return new Promise((resolve, reject) => {
      SetHomePageGoodsDelSort(param).then((res) => {
        if (res.code === 0) {
          setFlag(true)
          resolve(true)
        } else {
          reject(false)
        }
      })
  
    });
  };

  const columns = [
    {
      title: 'id',
      dataIndex: 'id',
      hideInTable: true,
    },
    {
      title: '图片',
      dataIndex: 'goodsImgCover',
      render: (text) => <img src={text} width={50} height={50} />,
      search: false,
    },
    {
      title: '商品名称',
      dataIndex: 'goodsName',
      valueType: 'text',
    },
    {
      title: '操作',
      valueType: 'option',
      dataIndex: 'option',
      render: (text, record, _) => {
        return (
          <>
            {<Button key="d" onClick={() => {setIndexGoods(false)}}>删除</Button>}
          </>
        )
      }
    },
  ];

  useEffect(() => {
    if (detailData) {
      const { ...rest } = detailData;
      form.setFieldsValue({
        ...rest
      })
    }
    if (indexGoods) {
      const { id, goodsImgCover, goodsName  } = indexGoods;
      form.setFieldsValue({
        id,
        goodsImgCover,
        goodsName,
      })
    }
  }, [form, detailData, indexGoods])

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
      }}
      onFinish={async (values) => {
        await waitTime(values);
        message.success('提交成功');
        // 不返回不会关闭弹框
        return true;
      }}
    >

<ProTable
      Key="id"
      options={false}
      columns={columns}
      search={false}
      params={indexGoods}
      dataSource={indexGoods?[indexGoods]:false}
      dateFormatter="string"
      toolBarRender={(_,record) => [
        <Button onClick={() => {
          setListFormVisible(true)
        }}>选择比较商品</Button>
      ]}
      pagination={false}
    />
    <ProFormText
      label='排序'
      name='sort'
      fieldProps={{defaultValue:100,onChange:(e)=>{
        setSortValue(e.target.attributes[4].value)
      }}}
    />
      {listFormVisible && <Edit
      visible={listFormVisible}
      setVisible={setListFormVisible}
      setIndexGoods={setIndexGoods}
    />}
    </DrawerForm>
    
  );
};