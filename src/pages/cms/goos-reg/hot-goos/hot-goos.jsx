
import React, { useEffect, useRef, useState } from 'react';
import { PlusOutlined, MinusOutlined, PlayCircleOutlined, PauseCircleOutlined } from '@ant-design/icons';
import { Button, Space, message } from 'antd';
import ProTable from '@ant-design/pro-table';
import ProForm from '@ant-design/pro-form';
import { PageContainer } from '@/components/PageContainer';
import Edit from './form';
import ReplaceForm from './replace-form';
import Modify from './edit';
import { hotGoosList, hotGoosOperation, tagSortTop } from '@/services/cms/member/member';
import { ACTION_TYPE } from '@/utils/text';
import ContentVersionTab from '@/components/content-version-tab';
import Title from './title'

const HotGoos = () => {
  const actionRef = useRef();
  const [formVisible, setFormVisible] = useState(false);
  const [replaceFormVisible, setReplaceFormVisible] = useState(false);
  const [modifyFormVisible, setModifyFormVisible] = useState(false);
  const [detailData, setDetailData] = useState(false);
  const [flag, setFlag] = useState(false);
  const [verifyVersionId, setVerifyVersionId] = useState(1);

  useEffect(() => {
    if (flag) {
      actionRef.current.reset();
      setFlag(false)
    }
  }, [flag])

  const getDetail = (data) => {
    setDetailData(data);
    setModifyFormVisible(true);
  }

  const formControl = (data,type) => {
    hotGoosOperation({ids: data,status: type}).then((res) => {
      if (res.code === 0) {
        message.success(`${ACTION_TYPE[type]}成功`);
        actionRef.current.reset();
      }
    })
  }

  const top = (data) => {
    tagSortTop({id: data}).then((res) => {
      if (res.code === 0) {
        message.success(`置顶成功`);
      }
    })
  }

  const columns = [
    {
      title: '排序序号',
      dataIndex: 'sort',
      valueType: 'text',
      search: false,
    },
    {
      title: 'SPUID',
      dataIndex: 'spuId',
      valueType: 'number',
    },
    {
      title: '商品来源',
      dataIndex: 'goodsType',
      valueType: 'select',
      hideIntable: true,
      valueEnum: {
        1: '普通商品库',
        5: '1688商品库',
      }
    },
    {
      title: '图片',
      key: 'goodsImageUrl',
      dataIndex: 'goodsImageUrl',
      render: (text) => <img src={text} width={50} height={50} />,
      search: false,
    },
    {
      title: '商品名称',
      key: 'goodsName',
      dataIndex: 'goodsName',
      valueType: 'text',
      width: 180,
      ellipsis: true,
    },
    {
      title: '所属内部店',
      key: 'storeName',
      dataIndex: 'storeName',
      valueType: 'text',
    },
    {
      title: '商家名称',
      key: 'supplierName',
      dataIndex: 'supplierName',
      valueType: 'text',
      search: false,
    },
    {
      title: '供货类型',
      key: 'goodsSaleTypeDisplay',
      dataIndex: 'goodsSaleTypeDisplay',
      valueType: 'text',
      search: false,
    },
    {
      title: '销售价',
      key: 'goodsSalePrice',
      dataIndex: 'goodsSalePrice',
      valueType: 'money',
      search: false,
    },
    {
      title: '可用库存',
      key: 'stockNum',
      dataIndex: 'stockNum',
      valueType: 'number',
      search: false,
    },
    {
      title: '销量',
      dataIndex: 'goodsSaleNum',
      valueType: 'number',
      search: false,
    },
    {
      title: '售价最多上浮百分比',
      dataIndex: 'floatPercent',
      valueType: 'text',
      search: false,
    },
    {
      title: '一级分类',
      dataIndex: 'gcId1Display',
      valueType: 'text',
      search: false,
    },
    {
      title: '二级分类',
      dataIndex: 'gcId2Display',
      valueType: 'text',
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
        },
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
      render: (text, record, _) => {
        return (
          <>
            {/* {record.status===2&&<Button size="small" key="top" onClick={() => {top(record.id)}}>置顶</Button>} */}
            {<Button size="small" key="editable" onClick={() => {getDetail(record)}}>排序</Button>}
            {record.status===2&&<Button size="small" key="down" onClick={() => {formControl(record.id, 1)}}>下线</Button>}
            {record.status===1&&<Button size="small" key="view" onClick={() => {formControl(record.id,2)}}>发布</Button>}
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
      scroll={{ x: 'max-content', scrollToFirstRowOnChange: true, }}
      params={{tagCode:'hot_sale', verifyVersionId: verifyVersionId}}
      request={hotGoosList}
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
      headerTitle={<Title actRef={actionRef}/>}
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
        <Button key="button" icon={<PlusOutlined />} type="primary" onClick={() => { setFormVisible(true) }}>
          新建
        </Button>,
        <Button key="button" icon={<PlusOutlined />} type="primary" onClick={() => { setReplaceFormVisible(true) }}>
          新建(代发)
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
    {replaceFormVisible && <ReplaceForm
      visible={replaceFormVisible}
      setVisible={setReplaceFormVisible}
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


export default HotGoos