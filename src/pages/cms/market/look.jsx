import React, { useRef, useState, useEffect  } from 'react';
import { Button, message } from 'antd';
import ProTable from '@ant-design/pro-table';
import { ModalForm } from '@ant-design/pro-form';
import { marketItemList } from '@/services/cms/member/member';
import Edit from './look-updata';
import { marketItemDel } from '@/services/cms/member/member';
export default (props) => {
  const { detailData, setVisible, visible } = props;
  const formRef = useRef();
  const actionRef = useRef();
  const [detailDataz, setDetailDataz] = useState(null);
  const [formVisiblez, setFormVisiblez] = useState(false);
  const [flag, setFlag] = useState(false);

  useEffect(() => {
    flag&&actionRef.current.reset()
  }, [flag])

  const getDetail = (data) => {
    data?setDetailDataz(data):setDetailDataz({id: detailData.id})
    setFormVisiblez(true);
  }

  const formControl = (itemId, id) => {
    marketItemDel({itemId: itemId,id:id}).then((res) => {
      if (res.code === 0) {
        message.success(`删除成功`);
        actionRef.current.reset();
      }
    })
  }

  const columns = [
    {
      title: '排序',
      dataIndex: 'sort',
      valueType: 'text',
      search: false,
    },
    {
      title: '图片',
      dataIndex: 'image',
      render: (text) => <img src={text} width={50} height={50} />,
      search: false,
    },
    {
      title: '标题',
      dataIndex: 'title',
      valueType: 'text',
      search: false,
    },
    {
      title: '链接',
      dataIndex: 'actionUrl',
      valueType: 'text',
      search: false,
    },
    {
      title: '操作',
      valueType: 'option',
      dataIndex: 'option',
      render: (text, record, _) => {
        return (
          <>
            {<a key="editable" onClick={() => {getDetail(record)}}>编辑</a>}
            &nbsp;&nbsp;{<a key="d" onClick={() => {formControl(record.itemId, record.id)}}>删除</a>}
          </>
        )
      }
    },
  ];

  return (
    <ModalForm
      key="id"
      width={1300}
      title='专题资源配置列表'
      onVisibleChange={setVisible}
      formRef={formRef}
      visible={visible}
      submitter={{
        submitButtonProps: {
          style: {
            display: 'none',
          },
        },
        resetButtonProps: {
          style: {
            display: 'none',
          },
        },
      }}
    >
<ProTable
      rowKey="id"
      style={{
        height: 600
      }}
      actionRef={actionRef}
      options={false}
      columns={columns}
      params={
        {title:detailData?detailData.title:''}
      }
      request={marketItemList}
      search={false}
      pagination={false}
      dateFormatter="string"
      toolBarRender={(_,record) => [
        <Button key="button" type="primary" onClick={() => { getDetail() }}>
          新增
        </Button>,
      ]}
    />
    {formVisiblez && <Edit
      visible={formVisiblez}
      setVisible={setFormVisiblez}
      detailDataz={detailDataz}
      setFlag={setFlag}
    />}
    </ModalForm>
  );
};