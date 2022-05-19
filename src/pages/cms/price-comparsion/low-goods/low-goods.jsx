import React, { useEffect, useRef, useState } from 'react';
import { Button, message } from 'antd';
import ProTable from '@ant-design/pro-table';
import { PageContainer } from '@/components/PageContainer';
import { savePriceList, SetHotGoodsDel } from '@/services/cms/member/member';
import Edit from './form';

const LowGoods = () => {
  const [formVisible, setFormVisible] = useState(false);
  const [flag, setFlag] = useState(false);
  const [loading, setLoading] = useState(false);
  const actionRef = useRef();

  useEffect(() => {
    if (flag) {
      setLoading(true)
      setTimeout(() => {
        actionRef.current.reset()
        setFlag(false)
        setLoading(false)
      }, 0)
    }
  }, [flag])

  const del = (record, opt) => {
    setLoading(true)
    const param = {
      ids: record.id,
      opt: opt
    }
    SetHotGoodsDel(param).then((res) => {
      if (res.code === 0) {
        setTimeout(() => {
          message.success(`删除成功`);
          actionRef.current.reset();
          setLoading(false)
        }, 0)
      } else {
        setLoading(false)
      }
    }).catch(() => {
      setLoading(false)
    })
  }

  const columns = [
    {
      title: '商品图片',
      dataIndex: 'image',
      render: (text) => <img src={text} width={90} height={90} />,
      search: false,
    },
    {
      title: '商品名称',
      dataIndex: 'title',
      search: false,
    },
    {
      title: '操作',
      valueType: 'option',
      dataIndex: 'option',
      render: (_, record) => {
        return (
          <>
            {<a key="d" onClick={() => {
              del(record, 'del')
            }}>删除</a>}
          </>
        )
      }
    },
  ]



  return (
    <PageContainer>
      <ProTable
      rowKey="id"
      options={false}
      columns={columns}
      actionRef={actionRef}
      request={savePriceList}
      loading={loading}
      search={{
        labelWidth: 'auto',
      }}
      pagination={{
        pageSize: 5,
      }}
      search={false}
      dateFormatter="string"
      headerTitle=""
      toolBarRender={(_,record) => [
        <Button key="button" type="primary" onClick={() => { setFormVisible(true) }}>
          选择比价商品
        </Button>,
      ]}
      />
      {formVisible && <Edit
      visible={formVisible}
      setVisible={setFormVisible}
      setFlag={setFlag}
    />}
    </PageContainer>
  )
}

export default LowGoods;

