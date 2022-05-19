
import ProTable from '@ant-design/pro-table';
import React, { useRef, useEffect, useState } from 'react';
import { PlusOutlined, MinusOutlined, PlayCircleOutlined, PauseCircleOutlined } from '@ant-design/icons';
import { cmsWeekGoodsList, cmsGoodsStatusSub } from '@/services/cms/member/weekend-revelry';
import { Button, Space, message } from 'antd';
import Edit from './goods-modal-form'
import ReplaceForm from './replace-form';
import { ACTION_TYPE } from '@/utils/text';
import ProForm, { ModalForm } from '@ant-design/pro-form';
import Modify from './edit';
import ContentVersionTab from '@/components/content-version-tab';

const DetailList = (props) => {
  const { onChange, setVisible, visible, acid } = props;
  const actionRef = useRef();
  const [formVisible, setFormVisible] = useState(false);
  const [replaceFormVisible, setReplaceFormVisible] = useState(false);
  const [detailData, setDetailData] = useState(true);
  const [flag, setFlag] = useState(false);
  const [popVisible, setPopVisible] = useState(false);
  const [verifyVersionId, setVerifyVersionId] = useState(1);

  const getDetail = (data) => {
    if (!acid) {return message.error('请先选择活动')}
    const param = {
      data,
      id:acid,
    }
    setDetailData(param);
    setFormVisible(true);
  }

    const formControl = (data,type) => {
    cmsGoodsStatusSub({ids: data,status: type}).then((res) => {
      if (res.code === 0) {
        message.success(`${ACTION_TYPE[type]}成功`);
        actionRef.current.reset();
      }
    })
  }

  const openList = () => {
    if (!acid) {
      message.error('请先选择活动')
      return;
    }
    const param = {
      id: acid, 
    }
    setDetailData(param);
    setReplaceFormVisible(true);
  }


  const editPop = (a) => {
    setDetailData(a)
    setPopVisible(true)
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
      valueType: 'number',
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
      editable: true,
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
      title: '销量',
      dataIndex: 'goodsSaleNum',
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
            {record.status===2&&<Button size="small" key="down" onClick={() => {formControl(record.id, 1)}}>下线</Button>}
            {record.status===1&&<Button size="small" key="view" onClick={() => {formControl(record.id,2)}}>发布</Button>}
            {record.status===1&&<Button size="small" key="editable" onClick={() => {editPop(record)}}>编辑</Button>}
            {record.status===1&&<Button size="small" key="d" onClick={() => {formControl(record.id,4)}}>删除</Button>}
          </>
        )
      }
    },
  ];

  useEffect(() => {
    if (flag) {
      actionRef.current.reset()
      setFlag(false)
    }
  }, [flag]);

  return (
    <>
    <ModalForm
      key='list'
      width={1400}
      onVisibleChange={setVisible}
      visible={visible}
      submitter={{
        resetButtonProps: {
          style: {
            display: 'none',
          },
        },
        submitButtonProps: {
          style: {
            display: 'none',
          },
        },
      }}
      style={{overflow:'hidden'}}
    >
    <ProForm.Group>
      <ContentVersionTab setVerifyVersionId={setVerifyVersionId} />
    </ProForm.Group>
    <ProTable
      rowKey="id"
      options={false}
      columns={columns}
      actionRef={actionRef}
      params={acid&&{cmsWeekId:acid,verifyVersionId: verifyVersionId}}
      postData={(data) => {
        data.forEach(item => {
          item.goodsSalePrice = item.goodsSalePrice/100
        })
        return data
      }}
      request={cmsWeekGoodsList}
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
        <Button key="button" icon={<PlayCircleOutlined />} type="primary" onClick={() => {formControl(record.selectedRowKeys.toString(), 2)}}>
          批量发布
        </Button>,
        <Button key="button" icon={<PauseCircleOutlined />} type="primary" onClick={() => {formControl(record.selectedRowKeys.toString(), 1)}}>
          批量下线
        </Button>,
        <Button key="button" icon={<MinusOutlined />} type="primary" onClick={() => {formControl(record.selectedRowKeys.toString(), 4)}}>
          批量删除
        </Button>,
        <Button key="button" icon={<PlusOutlined />} type="primary" onClick={() => { getDetail(record) }}>
          新增
        </Button>,
        // <Button key="button" icon={<PlusOutlined />} type="primary" onClick={() => { openList() }}>
        //   新增(1688)
        // </Button>,
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
      verifyVersionId={verifyVersionId}
      detailData={detailData}
      setFlag={setFlag}
    />}
    {popVisible && <Modify
      visible={popVisible}
      setVisible={setPopVisible}
      detailData={detailData}
      setFlag={setFlag}
    />}
    </ModalForm>
    </>
    
  );
};

export default DetailList