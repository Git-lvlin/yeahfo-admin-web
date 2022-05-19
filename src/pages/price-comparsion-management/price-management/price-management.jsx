import React, { useRef, useState, useEffect } from 'react';
import { MinusOutlined, PauseCircleOutlined } from '@ant-design/icons';
import { Button, Space, message, Input, Form, Spin, InputNumber } from 'antd';
import ProTable from '@ant-design/pro-table';
import { PageContainer } from '@/components/PageContainer';
import {
  priceComparsionListAlls,
  delContestGoods,
  createTaskSrc,
  getSpiderGoodsListByDate,
  sendTask,
  getGoodsBindData,
  upDataPrice,
} from '@/services/cms/member/member';
import Edit from './edit';
import FormPage from './form';
import ProCard from '@ant-design/pro-card';
import styles from './style.less';

const { Search } = Input;

const PriceManagement = () => {
  const actionRef = useRef()
  const [formVisible, setFormVisible] = useState(false)
  const [grabList, setGrabList] = useState(false)
  const [formData,setFormData] = useState(false)
  const [formjsx, setFormjsx] = useState(false)
  const [isShow, setIsShow] = useState(false)
  const [flag, setFlag] = useState(false)
  const [resData, setResData] = useState({})
  const [type, setType] = useState(false)
  const [form] = Form.useForm()
  const [rowKeys, setRowKeys] = useState([])
  const [loadingIndex, setLoadingIndex] = useState(-1)
  const [rowLoadin, setRowLoadin] = useState(true)
  const formControl = ({selectedRows}) => {
    const ids = []
    const len = selectedRows.length
    for(let i=0;i<len;i++) {
      ids.push(selectedRows[i].id)
    }
    delContestGoods({id: ids.toString()}).then((res) => {
      if (res.code === 0) {
        message.success(`成功`);
        actionRef.current.reset();
      }
    })
  }

  const formControlOne = (id) => {
    delContestGoods({id: id.toString()}).then((res) => {
      if (res.code === 0) {
        message.success(`成功`);
        actionRef.current.reset();
      }
    })
  }

  const setPrice = (value, id, t) => {
    const param = {
      contestId: id,
      type: t,
      priceDefault: value*100
    }
    upDataPrice(param)
  }

  const onSearch = (value, t, {id, goodsSpuId, goodsSkuId}) => {
    if (!value) {
      setLoadingIndex(-1)
      return
    }
    const type = t
    setType(type)
    const param = {
      goodsUrl: value,
      goodsId: goodsSpuId,
      type,
      skuId: goodsSkuId,
    }
    createTaskSrc(param, {showError: false}).then((res) => {
      if (res.code === 0) {
        sendTask().then((r) => {
          if (r.code === 0) {
            timeoutfn(param, type, id)
          }
        })
      } else {
        message.success(res.msg)
      }
    })
  };

  useEffect(() => {
    grabList&&bindData({},type)
  }, [grabList])

  let ref = useRef()
  const timeoutfn = (data,type,id) => {
    getSpiderGoodsListByDate({ sourceType: data.type, goodsId: data.goodsId, goodsSkuId: data.skuId }, {showError: false})
    .then((res) => {
      clearTimeout(ref.current)
      if (res.code === 0 && res.data.length) {
        setGrabList(res.data)
        setLoadingIndex(-1)
        return
      }
      ref.current = setTimeout(()=>{
        timeoutfn(data,type,id)
      }, 5000)
    })
  }

  const bindData = (id, t) => {
    setFormjsx(grabList)
    setFormData({
      ...formData,
      sourceType: t
    })
    console.log('bindData-formData', formData)
    setIsShow(true)
  }

  useEffect(() => {
    if (flag) {
      actionRef.current.reset()
      setFlag(false)
    }
  }, [flag])

  const expandedRowRender = (a) => {
    if (!formData) {
      console.log('aaa', a)
      setFormData(a)
    }
    return (
      <Spin spinning={rowLoadin}>
      <ProCard name={a.id} split="horizontal" bordered headerBordered style={{ marginBottom: 20 }}>
        <ProCard split="vertical" className={styles.header}>
          <ProCard colSpan="120px" className={styles.card}>比价电商平台</ProCard>
          <ProCard colSpan="120px" className={styles.card}>skuid</ProCard>
          <ProCard colSpan="120px" className={styles.card}>售卖价格</ProCard>
          <ProCard colSpan="120px" className={styles.card}>默认价格</ProCard>
          <ProCard className={styles.card}>链接</ProCard>
          <ProCard colSpan="120px" className={styles.card}>操作</ProCard>
        </ProCard>
        <ProCard split="vertical" className={styles.header}>
          <ProCard colSpan="120px" className={styles.card}>淘宝</ProCard>
          <ProCard colSpan="120px" className={styles.card}>{resData.tb?.sku}</ProCard>
          <ProCard colSpan="120px" className={styles.card}>{resData.tb?.price}</ProCard>
          <ProCard colSpan="120px" className={styles.card}>
            {resData.tb&&<InputNumber min={0.01} max={99999} defaultValue={resData.tb.priceDefault&&resData.tb.priceDefault/100} onChange={(value) => {
              setPrice(value, a.id, 'tb')
            }} />}
          </ProCard>
          <ProCard className={styles.card}>
            <Search
              name="search-tb"
              placeholder="请输入对应商品链接地址"
              allowClear
              value={resData.tb?.url}
              onChange={(e) => {
                setResData({
                  ...resData,
                  'tb':{
                    ...resData.tb,
                    url: e.target.value
                  }
                })
              }}
              enterButton={<Button type="primary" disabled={loadingIndex>=0?true:false} loading={loadingIndex == 1?true:false}>抓取</Button>}
              onSearch={(_) => {setLoadingIndex(1);onSearch(_,'tb', a)}}
            />
          </ProCard>

        </ProCard>
        <ProCard split="vertical" className={styles.header}>
          <ProCard colSpan="120px" className={styles.card}>京东</ProCard>
          <ProCard colSpan="120px" className={styles.card}>{resData.jd?.sku}</ProCard>
          <ProCard colSpan="120px" className={styles.card}>{resData.jd?.price}</ProCard>
          <ProCard colSpan="120px" className={styles.card}>
            {resData.jd&&<InputNumber min={0.01} max={1000} defaultValue={resData.jd.priceDefault&&resData.jd.priceDefault/100} onChange={(value) => {
              setPrice(value, a.id, 'jd')
            }} />}
          </ProCard>
          <ProCard className={styles.card}>
            <Search
              name="search-jd"
              placeholder="请输入对应商品链接地址"
              allowClear
              value={resData.jd?.url}
              onChange={(e) => {
                setResData({
                  ...resData,
                  'jd':{
                    ...resData.jd,
                    url: e.target.value
                  }
                })
              }}
              enterButton={<Button type="primary" disabled={loadingIndex>=0?true:false} loading={loadingIndex == 2?true:false}>抓取</Button>}
              onSearch={(_) => {setLoadingIndex(2);onSearch(_,'jd', a)}}
            />
          </ProCard>
        </ProCard>
        <ProCard split="vertical" className={styles.header}>
          <ProCard colSpan="120px" className={styles.card}>拼多多</ProCard>
          <ProCard colSpan="120px" className={styles.card}>{resData.pdd?.sku}</ProCard>
          <ProCard colSpan="120px" className={styles.card}>{resData.pdd?.price}</ProCard>
          <ProCard colSpan="120px" className={styles.card}>
            {resData.pdd&&<InputNumber min={0.01} max={1000} defaultValue={resData.pdd.priceDefault&&resData.pdd.priceDefault/100} onChange={(value) => {
              setPrice(value, a.id, 'pdd')
            }} />}
          </ProCard>
            <ProCard className={styles.card}>
              <Search
                placeholder="请输入对应商品链接地址"
                allowClear
                value={resData.pdd?.url}
                onChange={(e) => {
                  setResData({
                    ...resData,
                    'pdd':{
                      ...resData.pdd,
                      url: e.target.value
                    }
                  })
                }}
                enterButton={<Button type="primary" disabled={loadingIndex>=0?true:false} loading={loadingIndex == 3?true:false}>抓取</Button>}
                onSearch={(_) => {setLoadingIndex(3);onSearch(_,'pdd', a)}}
              />
            </ProCard>
        </ProCard>
        <ProCard split="vertical" className={styles.header}>
          <ProCard colSpan="120px" className={styles.top  }>天猫</ProCard>
          <ProCard colSpan="120px" className={styles.card}>{resData.tmall?.sku}</ProCard>
          <ProCard colSpan="120px" className={styles.card}>{resData.tmall?.price}</ProCard>
          <ProCard colSpan="120px" className={styles.card}>
            {resData.tmall&&<InputNumber min={0.01} max={99999} defaultValue={resData.tmall.priceDefault&&resData.tmall.priceDefault/100} onChange={(value) => {
              setPrice(value, a.id, 'tmall')
            }} />}
          </ProCard>
          <ProCard className={styles.card}>
            <Search
              placeholder="请输入对应商品链接地址"
              allowClear
              value={resData.tmall?.url}
              onChange={(e) => {
                setResData({
                  ...resData,
                  'tmall':{
                    ...resData.tmall,
                    url: e.target.value
                  }
                })
              }}
              enterButton={<Button type="primary" disabled={loadingIndex>=0?true:false} loading={loadingIndex == 4?true:false}>抓取</Button>}
              onSearch={(_) => {setLoadingIndex(4);onSearch(_,'tmall', a)}}
            />
          </ProCard>
        </ProCard>
      </ProCard>
      </ Spin>
    );
  };

  const columns = [
    {
      title: 'skuId',
      dataIndex: 'goodsSkuId',
      search: false,
    },
    {
      title: 'skuId',
      dataIndex: 'skuId',
      hideInTable: true
    },
    {
      title: '商品名称',
      dataIndex: 'goodsName',
    },
    {
      title: '秒约价',
      dataIndex: 'goodsPrice',
      valueType: 'money',
      search: false,
    },
    {
      title: '市场价',
      dataIndex: 'goodsMarketPrice',
      valueType: 'money',
      search: false,
    },
    {
      title: '可用库存',
      dataIndex: 'stockNum',
      search: false,
    },
    {
      title: '销量',
      dataIndex: 'saleNum',
      search: false,
    },
    {
      title: '比价状态',
      dataIndex: 'acquire',
      valueEnum: {
        0: '未比价',
        1: '已比价',
      }
    },
    {
      title: '操作',
      valueType: 'option',
      dataIndex: 'option',
      render: (text, record, _)=><a key="d" onClick={() => {formControlOne(record.id)}}>删除</a>
    },
  ]

  const getBindedData = (arr) => {
    if (!arr.length) {
      return;
    }
    const index = arr[arr.length-1]
    getGoodsBindData({goodsId: index[0], goodsSkuId: index[1]}).then(res => {
      if (res.code === 0) {
        let data = res.data;
        if (!data.tb) {
          data.tb = {
            priceDefault: null
          }
        } else if (!data.tb.priceDefault) {
          data.tb.priceDefault = null
        }
        if (!data.jd) {
          data.jd = {
            priceDefault: null
          }
        } else if (!data.jd.priceDefault) {
          data.jd.priceDefault = null
        }
        if (!data.pdd) {
          data.pdd = {
            priceDefault: null
          }
        } else if (!data.pdd.priceDefault) {
          data.pdd.priceDefault = null
        }
        if (!data.tmall) {
          data.tmall = {
            priceDefault: null
          } 
        } else if (!data.tmall.priceDefault) {
          data.tmall.priceDefault = null
        }
        setResData(data)
        setRowLoadin(false)
      }
    })
  }

  const changeRowKeys = (expanded, record) => {
    console.log('expanded', expanded)
    console.log('record', record)

    clearTimeout(ref.current)
    setLoadingIndex(-1)
    setRowLoadin(true)
    setResData({})
    setFormData(record)
    setFormjsx(false)
    setIsShow(false)
    let temp = []
    if (expanded) {
      temp.push(record.allKey)
    }
    setRowKeys(temp)
  }

  return (
    <PageContainer>
      <ProTable
      form={form}
      rowKey="allKey"
      columns={columns}
      expandable={{
        expandedRowRender,
        onExpandedRowsChange: (expandedRows) => {
          getBindedData(expandedRows)
        },
      }}
      expandedRowKeys={rowKeys}
      defaultExpandAllRows={true}
      expandedRowRender={expandedRowRender}
      onExpand={(expanded, record) => changeRowKeys(expanded, record)}
      actionRef={actionRef}
      postData={(data) => {
        data.forEach(item => {
          item.goodsPrice /= 100
          item.goodsMarketPrice /= 100
          item.allKey = [item.goodsSpuId, item.goodsSkuId]
        })
        return data
      }}
      request={priceComparsionListAlls}
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
      headerTitle="数据列表"
      toolBarRender={(_,record) => [
        <Button key="button" icon={<PauseCircleOutlined />} type="primary" onClick={() => { setFormVisible(true) }}>
          添加比价商品
        </Button>,
        <Button key="button" icon={<MinusOutlined />} type="primary" onClick={() => { formControl(record) }}>
          批量删除
        </Button>,
      ]}
      />
      {formVisible && <Edit
      visible={formVisible}
      setVisible={setFormVisible}
      setFlag={setFlag}
    />}
      {isShow && <FormPage
      visible={isShow}
      setVisible={setIsShow}
      Listdata={formjsx}
      formData={formData}
      setResData={setResData}
      resData={resData}
      setFlag={setFlag}
    />}
    </PageContainer>
  )

}

export default PriceManagement