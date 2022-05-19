
import React, { useRef, useState, useEffect } from 'react';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { Button, message, Space, Select } from 'antd';
import ProForm from '@ant-design/pro-form';
import ProCard from '@ant-design/pro-card';
import ProTable from '@ant-design/pro-table';
import { PageContainer } from '@/components/PageContainer';
import { goodsSortList, goodsSortTop, goodsSortTopCancel, goodsSortReset, goodsMoveSort, pushClass, goodsClassList } from '@/services/cms/member/member';
import Edit from './form';

const BannerAdmin = () => {
  const actionRef = useRef();
  const [formVisible, setFormVisible] = useState(false);
  const [detailData, setDetailData] = useState(null);
  const [useType, setUseType] = useState(1);
  const [goodsClass, setGoodsClass] = useState(null);
  const [itemClass, setItemClass] = useState(null);
  const [selected, setSelected] = useState(true);

  useEffect(() => {
    goodsClassList().then((res) => {
      setGoodsClass(res.data.map(item => ({ label: item.categoryName, value: item.id })))
    })
    return {}
  }, [])

  const ClassIndex = ({onChange}) => {
    return <Select
        placeholder="请选择运营类目"
        options={goodsClass}
        onChange={onChange}
        allowClear
      />
  }

  const push = (selectedRows) => {
    if (!selectedRows||!selectedRows.length) {
      message.error('请先勾选')
      return
    }
    const param = {
      wsSkuIds: selectedRows.toString(),
      wscId: itemClass,
    }
    pushClass(param).then((res) => {
      console.log('push-res', res)
      message.success('添加成功')
      actionRef.current.reload();
    })
  }

  const moveSort = (record, moveUp) => {
    const { wsSkuId } = record;
    const param = {
      wsSkuId,
      type: useType,
      moveUp,
    }
    goodsMoveSort(param).then((res) => {
      if (res.code === 0) {
        actionRef.current.reload();
      }
    })
  }

  const top = (record, type) => {
    const { wsSkuId } = record;
    let api = type?goodsSortTop:goodsSortTopCancel
    const param = {
      wsSkuId,
      type: useType,
    }
    api(param).then((res) => {
      if (res.code === 0) {
        actionRef.current.reload();
      }
    })
  }

  const changeHandle = (v) => {
    setItemClass(v)
  }

  const sortReset = () => {
    const param = {
      type: useType,
      isHot: 0,
    }
    goodsSortReset(param).then((res) => {
      if (res.code === 0) {
        actionRef.current.reload();
      }
    })
  }

  const editSort = (record, type) => {
    const data = {
      ...record,
      type,
    }
    setDetailData(data)
    setFormVisible(true)
  }

  const columns = [
    {
      title: '序号',
      valueType: 'indexBorder',
      search: false,
    },
    {
      title: 'spuID',
      dataIndex: 'spuId',
    },
    {
      title: 'skuID',
      dataIndex: 'skuId',
    },
    {
      title: '运营分类',
      hideInTable: true,
      dataIndex: 'wscId',
      renderFormItem: () => (<ClassIndex />)
    },
    {
      title: '主图',
      dataIndex: 'imageUrl',
      render: (text) => <img src={text} width={50} height={50} />,
      search: false,
    },
    {
      title: '一级分类',
      dataIndex: 'gcName1',
      search: false,
    },
    {
      title: '集约价',
      dataIndex: 'salePrice',
      search: false,
      render: (_) => {
        return <>{_/100}</>
      }
    },
    {
      title: '起订量',
      dataIndex: 'buyMinNum',
      search: false,
    },
    {
      title: '商品名称',
      dataIndex: 'goodsName',
    },
    useType==1?{
      title: '采购列表序号',
      dataIndex: 'sort',
      hideInSearch: true,
      render: (_, record) => {
        return <>
          <a onClick={() => { editSort(record, 1) }}>设置序号</a>&nbsp;
          <Button icon={<ArrowDownOutlined />} onClick={() => { moveSort(record, 0 ) }}></Button>
          {record.sort!==1&&<Button icon={<ArrowUpOutlined />} onClick={() => { moveSort(record, 1) }}></Button>}&nbsp;
          <a onClick={() => { top(record, 1) }}>置顶</a>&nbsp;
          {record.sortIsTop==1&&<a onClick={() => { top(record, 0) }}>取消置顶</a>}
        </>
      }
    }:{
      title: '提醒列表序号设置',
      dataIndex: 'noticeSort',
      hideInSearch: true,
      render: (_, record) => {
        return <>
          <a onClick={() => { editSort(record, 2) }}>设置序号</a>&nbsp;
          <Button icon={<ArrowDownOutlined />} onClick={() => { moveSort(record, 0) }}></Button>
          {record.noticeSort!==1&&<Button icon={<ArrowUpOutlined />} onClick={() => { moveSort(record, 1) }}></Button>}&nbsp;
          <a onClick={() => { top(record, 2) }}>置顶</a>&nbsp;
          {record.noticeSortIsTop==1&&<a onClick={() => { top(record, 0) }}>取消置顶</a>}
        </>
      }
    },
  ];

  return (
    <PageContainer>
      <ProForm.Group>
        <ProCard style={{display: 'flex',}}>
          <Button type={useType==1?'primary':''} onClick={() => {setUseType(1)}}>店主采购列表</Button>
          <Button type={useType==1?'':'primary'} onClick={() => {setUseType(2)}}>集约板块提醒列表</Button>
        </ProCard>
      </ProForm.Group>
      <ProTable
        rowKey="wsSkuId"
        columns={columns}
        actionRef={actionRef}
        params={{type: useType}}
        request={goodsSortList}
        search={{
          labelWidth: 'auto',
        }}
        scroll={{ x: 'max-content', scrollToFirstRowOnChange: true, }}
        pagination={{
          pageSize: 5,
        }}
        rowSelection={{
          // 自定义选择项参考: https://ant.design/components/table-cn/#components-table-demo-row-selection-custom
          // 注释该行则默认不显示下拉选项
          // selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT],
        }}
        alwaysShowAlert={true}
        tableAlertRender={({ selectedRowKeys, selectedRows, onCleanSelected }) => {
          if (selectedRowKeys.length) {
            setSelected(false)
          } else {
            setSelected(true)
          }
          return(
          <Space size={24}>
            <span>
              已选 {selectedRowKeys.length} 项
              <span>添加到</span>
              <Select
                placeholder="请选择运营类目"
                options={goodsClass}
                value={itemClass}
                onChange={changeHandle}
                allowClear
              />
              <a style={{ marginLeft: 8 }} onClick={() => {push(selectedRowKeys)}}>
                确定
              </a>
            </span>
            {/* <span>{`待发布: ${selectedRows?.reduce(
              (pre, item) => {
                item.state === 0
                if (item.state === 0) {
                  return pre += 1
                }
                return pre
              },0,)} 个`}</span>
            <span>{`已发布: ${selectedRows?.reduce(
              (pre, item) => item.state && pre + 1,
              0,
            )} 个`}</span> */}
          </Space>
        )}}
        dateFormatter="string"
        toolBarRender={(_) => {
          if (useType==1) {
            return [
              <Button key="button" type="primary" onClick={() => { sortReset(1) }}>
                按集约价升序排列采购列表
              </Button>
            ]
          } else {
            return [
            <Button key="button" type="primary" onClick={() => { sortReset(2) }}>
              按集约价升序排列提醒列表
            </Button>
            ]
          }
        }}
      />
      {selected&&<Space size={24} style={{position: 'absolute',top: 290, left: 60}}>
        <span>
          <span style={{marginRight: 20}}>添加到 </span>
          <Select
            placeholder="请选择运营类目"
            options={goodsClass}
            value={itemClass}
            onChange={changeHandle}
            allowClear
          />
          <a style={{ marginLeft: 8 }} onClick={() => {push()}}>
            确定
          </a>
        </span>
        {/* <span>{`待发布: ${selectedRows?.reduce(
          (pre, item) => {
            item.state === 0
            if (item.state === 0) {
              return pre += 1
            }
            return pre
          },0,)} 个`}</span>
        <span>{`已发布: ${selectedRows?.reduce(
          (pre, item) => item.state && pre + 1,
          0,
        )} 个`}</span> */}
      </Space>}
      {formVisible && <Edit
        visible={formVisible}
        setVisible={setFormVisible}
        detailData={detailData}
        callback={() => { actionRef.current.reload(); setDetailData(null) }}
        onClose={() => { actionRef.current.reload(); setDetailData(null) }}
      />}
    </PageContainer>
  );
};


export default BannerAdmin