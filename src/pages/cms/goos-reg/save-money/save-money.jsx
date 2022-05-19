
import React, { useEffect, useRef, useState } from 'react';
import { PlusOutlined, MinusOutlined, PlayCircleOutlined, PauseCircleOutlined } from '@ant-design/icons';
import { Button, Space, message } from 'antd';
import ProTable from '@ant-design/pro-table';
import ProForm from '@ant-design/pro-form';
import { PageContainer } from '@/components/PageContainer';
import Edit from './form';
import Modify from './edit';
import Edits from './forms';
import ContentVersionTab from '@/components/content-version-tab';
import { saveMoneyList, saveMoneyOperation, saveMoneySortTop } from '@/services/cms/member/member';
import { ACTION_TYPE } from '@/utils/text';


const SaveMoney = () => {
  const actionRef = useRef();
  const [formVisible, setFormVisible] = useState(false);
  const [formVisibles, setFormVisibles] = useState(false);

  const [modifyFormVisible, setModifyFormVisible] = useState(false);
  const [detailData, setDetailData] = useState(true);
  const [flag, setFlag] = useState(false);
  const [verifyVersionId, setVerifyVersionId] = useState(1);

  useEffect(() => {
    if (flag) {
      actionRef.current.reset()
      setFlag(false)
    }
  }, [flag])


  const getDetail = (data) => {
    setDetailData(data);
    setModifyFormVisible(true);
  }

  const formControl = (data,type) => {
    saveMoneyOperation({ids: data,status: type}).then((res) => {
      if (res.code === 0) {
        message.success(`${ACTION_TYPE[type]}成功`);
        actionRef.current.reset();
      }
    })
  }

  const top = (data) => {
    saveMoneySortTop({id: data}).then((res) => {
      if (res.code === 0) {
        message.success(`置顶成功`);
      }
    })
  }

  const columns = [
    {
      title: '序号',
      dataIndex: 'sort',
      valueType: 'text',
      search: false,
    },
    {
      title: 'SPUID',
      dataIndex: 'spuId',
      valueType: 'text',
    },
    {
      title: '图片',
      dataIndex: 'goodsImageUrl',
      render: (text) => <img src={text} width={50} height={50} />,
      search: false,
    },
    {
      title: '商品名称',
      dataIndex: 'goodsName',
      valueType: 'text',
      width: 180,
      ellipsis: true,
    },
    {
      title: '商家名称',
      dataIndex: 'supplierName',
      valueType: 'text',
      search: false,
      width: 120,
      ellipsis: true,
    },
    {
      title: '供货类型',
      dataIndex: 'goodsSaleTypeDisplay',
      valueType: 'text',
      search: false,
    },
    {
      title: '销售价',
      dataIndex: 'goodsSalePrice',
      valueType: 'money',
      search: false,
    },
    {
      title: '可用库存',
      dataIndex: 'stockNum',
      valueType: 'number',
      search: false,
    },
    {
      title: '状态',
      dataIndex: 'status',
      filters: true,
      onFilter: true,
      hideInTable: true,
      valueType: 'select',
      valueEnum: {
        0: { text: '全部', status: 'Default' },
        1: {
          text: '待发布',
          status: '1',
        },
        2: {
          text: '已发布',
          status: '2',
        }
      }
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueType: 'text',
      search: false,
      valueEnum: {
        1: '未发布',
        2: '已发布',
      }
    },
    {
      title: '操作',
      valueType: 'option',
      dataIndex: 'option',
      width: 170,
      render: (text, record, _) => {
        return (
          <>
            {record.status===2&&<Button size="small" key="top" onClick={() => {top(record.id)}}>置顶</Button>}
            {record.status===2&&<Button size="small" key="down" onClick={() => {formControl(record.id, 1)}}>下线</Button>}
            {record.status===1&&<Button size="small" key="view" onClick={() => {formControl(record.id,2)}}>发布</Button>}
            {record.status===1&&<Button size="small" key="editable" onClick={() => {getDetail(record)}}>排序</Button>}
            {record.status===1&&<Button size="small" key="d" onClick={() => {formControl(record.id,4)}}>删除</Button>}
          </>
        )
      }
    },
  ];

  return (
    <PageContainer>
      <ProForm.Group>
        <ContentVersionTab setVerifyVersionId={setVerifyVersionId} />
      </ProForm.Group>
    <ProTable
      rowKey="id"
      columns={columns}
      actionRef={actionRef}
      postData={(data) => {
        data.forEach(item => {
          item.goodsSalePrice = item.goodsSalePrice/100
        })
        return data
      }}
      params={{
        verifyVersionId: verifyVersionId
      }}
      scroll={{ x: 'max-content', scrollToFirstRowOnChange: true, }}
      request={saveMoneyList}
      rowSelection={{
        // 自定义选择项参考: https://ant.design/components/table-cn/#components-table-demo-row-selection-custom
        // 注释该行则默认不显示下拉选项
        // selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT],
      }}
      tableAlertRender={({ selectedRowKeys, selectedRows, onCleanSelected }) => (
        <Space size={24}>
          <span>
            已选 {selectedRowKeys.length} 项
            <a style={{ marginLeft: 8 }} onClick={onCleanSelected}>
              取消选择
            </a>
          </span>
          <span>{`待发布: ${selectedRows?.reduce(
              (pre, item) => {
                if (item.status === 1) {
                  return pre += 1
                }
                return pre
              },
              0,
            )} 个`}</span>
            <span>{`已发布: ${selectedRows?.reduce(
              (pre, item) => {
                if(item.status === 2) {
                  return pre += 1
                }
                return pre
              },
              0,
            )} 个`}</span>
        </Space>
      )}
      search={{
        labelWidth: 'auto',
      }}
      pagination={{
        pageSize: 10,
      }}
      dateFormatter="string"
      toolBarRender={(_,record) => [
        <Button key="button" icon={<PlayCircleOutlined />} type="primary" onClick={() => { formControl(record.selectedRowKeys.toString(), 2) }}>
          批量发布
        </Button>,
        <Button key="button" icon={<PauseCircleOutlined />} type="primary" onClick={() => { formControl(record.selectedRowKeys.toString(), 1) }}>
          批量下线
        </Button>,
        <Button key="button" icon={<MinusOutlined />} type="primary" onClick={() => { formControl(record.selectedRowKeys.toString(), 4) }}>
          批量删除
        </Button>,
        <Button key="button" icon={<PlusOutlined />} type="primary" onClick={() => { setFormVisibles(true) }}>
          新增秒约商品
        </Button>,
      ]}
    />
    {formVisible && <Edit
      visible={formVisible}
      setVisible={setFormVisible}
      detailData={detailData}
      verifyVersionId={verifyVersionId}
      setFlag={setFlag}
    />}
    {formVisibles && <Edits
      visible={formVisibles}
      setVisible={setFormVisibles}
      detailData={detailData}
      verifyVersionId={verifyVersionId}
      setFlag={setFlag}
    />}
    {modifyFormVisible && <Modify
      visible={modifyFormVisible}
      setVisible={setModifyFormVisible}
      detailData={detailData}
      setFlag={setFlag}
    />}
    </PageContainer>
  );
};

export default SaveMoney