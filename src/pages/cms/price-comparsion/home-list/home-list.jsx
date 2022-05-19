import React, { useEffect, useRef, useState } from 'react';
import { Button, message } from 'antd';
import ProTable from '@ant-design/pro-table';
import { PageContainer } from '@/components/PageContainer';
import { priceComparsionHomeList, SetHomePageGoodsDel } from '@/services/cms/member/member';
import Edit from './form'

const HomeList = () => {
  const [detailData, setDetailData] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [flag, setFlag] = useState(false);
  const [loading, setLoading] = useState(false);
  const actionRef = useRef();

  const del = async (record, opt) => {
    const { id } = record
    const param = {
      "id": id.toString(),
      "opt":opt
    }
    SetHomePageGoodsDel(param).then((res) => {
      if (res && res.code ===0) {
        setLoading(true)
        setTimeout(() => {
          message.success(`删除成功`);
          actionRef.current.reset();
          setLoading(false)
        }, 0)
      }
    })

  }

  useEffect(() => {
    if (flag) {
      setLoading(true)
      setTimeout(() => {
        actionRef.current.reset()
        setLoading(false)
        setFlag(false)
      }, 0)

    }
  }, [flag])

  const columns = [
    {
      title: '图片',
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
      render: (text, record, _) => {
        return (
          <>
            {/* {<a key="editable" onClick={() => {}}>修改</a>} */}
            &nbsp;&nbsp;{<a key="d" onClick={() => {
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
      request={priceComparsionHomeList}
      loading={loading}
      search={{
        labelWidth: 'auto',
      }}
      pagination={false}
      search={false}
      dateFormatter="string"
      headerTitle=""
      toolBarRender={(_,record) => [
        <Button key="button" type="primary" onClick={() => { setFormVisible(true);setDetailData(record)}}>
          添加
        </Button>,
      ]}
      />
      {formVisible && <Edit
      visible={formVisible}
      setVisible={setFormVisible}
      detailData={detailData}
      setFlag={setFlag}
    />}
    </PageContainer>
  )
}

export default HomeList;

