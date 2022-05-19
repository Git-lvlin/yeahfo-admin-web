import React, { useState, useRef,useEffect } from 'react';
import { Button,Tabs,Image,Form,Modal,Select,Switch, Input,InputNumber,message} from 'antd';
import { EditableProTable } from '@ant-design/pro-table';
import { chooseWholesaleList } from '@/services/intensive-activity-management/penny-activity';
import { PlusOutlined } from '@ant-design/icons';
import { amountTransform } from '@/utils/utils'
import ProTable from '@ant-design/pro-table';
import { ModalForm,ProFormText } from '@ant-design/pro-form';
import _ from 'lodash'
import moment from 'moment';
import EndModel from './end-model'
import RepertoryModel from './repertory-model'

const formItemLayout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 14 },
  layout: {
    labelCol: {
      span: 10,
    },
    wrapperCol: {
      span: 14,
    },
  }
};

const FromWrap = ({ value, onChange, content, right }) => (
  <div style={{ display: 'flex',flexDirection:'column'}}>
    <div>{content(value, onChange)}</div>
    <div>{right(value)}</div>
  </div>
)

const GoosModel=(props)=>{
  const {visible,setVisible,onClose,callback,keyId,detailList}=props
  const [goosList,setGoosList]=useState()
  const [keys,setKeys]=useState()
  const [dataList,setDataList]=useState([])
  const actionRef = useRef();
  const columns = [
      {
          title: 'spuID',
          dataIndex: 'spuId',
          hideInSearch:true,
      },
      {
          title: 'skuID',
          dataIndex: 'skuId',
          hideInSearch:true,
      },
      {
          title: '商品分类',
          dataIndex: 'gcName',
          valueType: 'text',
          ellipsis:true,
          hideInSearch:true,
      },
      {
          title: '商品主图',
          dataIndex: 'imageUrl',
          valueType: 'image',
          hideInSearch:true
      },
      {
          title: '商品名称',
          dataIndex: 'goodsName',
          valueType: 'text',
          ellipsis:true,
          hideInSearch:true
      },
      {
          title: '商品规格',
          dataIndex: 'skuName',
          valueType: 'text',
          ellipsis:true,
          hideInSearch:true
      },
      {
          title: '批发供货价',
          dataIndex: 'wholesaleSupplyPrice',
          hideInSearch: true,
          render:(_,data)=>{
            return <p>{amountTransform(_, '/')}元/{data?.unit}</p>
          }
      },
      {
          title: '平均运费',
          dataIndex: 'wholesaleFreight',
          hideInSearch: true,
          editable:false,
          render:(_,data)=>{
            return <p>{amountTransform(_, '/')}元/{data?.unit}</p>
        }
      },
      {
          title: '集约活动名称',
          dataIndex: 'name',
          valueType: 'text',
          ellipsis:true,
      },
      {
          title: '集约活动ID',
          dataIndex: 'wsId',
          valueType: 'text',
          hideInSearch:true
      },
      {
          title: '活动开始时间',
          dataIndex: 'wholesaleStartTime',
          valueType: 'dateRange',
          hideInTable:true,
      },
      {
          title: '集约活动开始时间',
          dataIndex: 'wholesaleStartTime',
          valueType: 'text',
          hideInSearch:true,
          render:(_)=>{return <p>{moment(_*1000).format('YYYY-MM-DD HH:mm:ss')}</p>}
      },
      {
          title: '采购单下单截止时间',
          dataIndex: 'endTimeAdvancePayment',
          valueType: 'text',
          hideInSearch:true,
          render:(_)=>{return <p>{moment(_*1000).format('YYYY-MM-DD HH:mm:ss')}</p>}
      },
      {
          title: '活动状态',
          dataIndex: 'wholesaleStatus',
          valueType: 'select',
          hideInTable:true,
          valueEnum: {
              0: '全部',
              1: '待开始',
              2: '进行中',
          },
      },
      {
          title: '集约活动状态',
          dataIndex: 'wholesaleStatusDesc',
          valueType: 'text',
          hideInSearch: true,
      },
      {
          title: '集约库存',
          dataIndex: 'totalStockNum',
          hideInSearch: true,
      },
      {
          title: '集采箱规单位量',
          dataIndex: 'batchNumber',
          hideInSearch: true,
          render:(_,data)=>{
            return <p>{_}{data?.unit}/{data?.wsUnit}</p>
          }
      },
      {
          title: '单次起订量',
          dataIndex: 'minNum',
          hideInSearch: true,
          render:(_,data)=>{
            return <p>{_}{data?.unit}</p>
          }
    },
  ];
  const onsubmit = (values) => {
    if(goosList){
      callback(goosList)
    }
    setVisible(false)
  };
  useEffect(()=>{
    setKeys(keyId.map(ele=>(ele.wsId)))
  },[])
  const postData=(data)=>{
    dataList.push(...data)
    setDataList(dataList)
    return data
  }
  return (
      <ModalForm
          onVisibleChange={setVisible}
          visible={visible}
          width={1000}
          modalProps={{
          forceRender: true,
          destroyOnClose: true,
          onCancel: () => {
              onClose();
          }
          }}
          submitter={{
          render: (props, defaultDoms) => {
              return [
                  <Button type="primary" key="submit" onClick={() => {
                      props.form?.submit?.()
                  }}>
                   提交
                  </Button>,
                  <Button type="primary" key="cancel" onClick={() =>{setVisible(false)}}>
                   返回
                  </Button>
              ];
          },
          }}
          onFinish={async (values) => {
              await onsubmit(values);
          }}
          {...formItemLayout}
      >
      <ProTable
          rowKey="wsId"
          options={false}
          request={chooseWholesaleList}
          actionRef={actionRef}
          search={{
              defaultCollapsed: true,
              labelWidth: 100,
              optionRender: (searchConfig, formProps, dom) => [
                  ...dom.reverse(),
              ],
          }}
          scroll={{ x: '100vw', y: window.innerHeight - 680, scrollToFirstRowOnChange: true}}
          postData={postData}
          columns={columns}
          rowSelection={{
              preserveSelectedRowKeys: true,
              onChange: (_, val) => {
                const arr=[]
                _.forEach(item=>{
                 const obj=[...dataList,...detailList].find(ele=>{
                   return ele.wsId==item
                  })
                  if(obj){
                    arr.push(obj)
                  }

                })
                setGoosList(arr)
                setKeys(_)
              },
              selectedRowKeys:keys
          }}
          pagination={{
            pageSize: 5,
            showQuickJumper: true,
          }}
      />
      </ModalForm>
  )
}

export default (props) => {
  const {callback,id,detailList,callLoading}=props
  const ref=useRef()
  const [dataSource, setDataSource] = useState([]);
  const [editableKeys, setEditableKeys] = useState([])
  const [visible, setVisible] = useState(false);
  const [endVisible, setEndVisible] = useState(false);
  const [repertoryVisible,setRepertoryVisible]=useState(false)
  const [pennyId,setPennyId]=useState()
  useEffect(()=>{
    if(id){
      detailList&&setDataSource(detailList.map(ele=>({...ele,price:amountTransform(ele.price,'/'),maxNum:ele.buyLimit})))
     setEditableKeys(detailList?.map(item => item.wsId))
    }   
  },[id,detailList])

  const columns= [
    {
      title: 'spuID',
      dataIndex: 'spuId',
      valueType: 'text',
      editable:false,
      hideInSearch:true,
    },
    {
      title: 'skuID',
      dataIndex: 'skuId',
      valueType: 'text',
      editable:false,
      hideInSearch:true,
    },
    {
      title: '商品分类',
      dataIndex: 'gcName1',
      valueType: 'text',
      ellipsis:true,
      hideInSearch:true,
      editable:false,
      render:(_,data)=>{
        return <p>{_}-{data?.gcName2}</p>
      }
    },
    {
      title: '商品主图',
      dataIndex: 'imageUrl',
      valueType: 'image',
      hideInSearch:true,
      editable:false
    },
    {
      title: '商品名称',
      dataIndex: 'goodsName',
      valueType: 'text',
      ellipsis:true,
      hideInSearch:true,
      editable:false
    },
    {
      title: '商品规格',
      dataIndex: 'skuName',
      valueType: 'text',
      ellipsis:true,
      hideInSearch:true,
      editable:false
    },
    {
      title: '批发供货价',
      dataIndex: 'wholesaleSupplyPrice',
      hideInSearch: true,
      editable:false,
      render:(_,data)=>{
        return <p>{amountTransform(_, '/')}元/{data?.unit}</p>
      }
    },
    {
      title: '平均运费',
      dataIndex: 'wholesaleFreight',
      hideInSearch: true,
      editable:false,
      render:(_,data)=>{
        return <p>{amountTransform(_, '/')}元/{data?.unit}</p>
      }
    },
    {
      title: '集约活动名称',
      dataIndex: 'name',
      valueType: 'text',
      ellipsis:true,
      hideInSearch:true,
      editable:false,
      width:150
    },
    {
      title: '集约活动ID',
      dataIndex: 'wsId',
      valueType: 'text',
      hideInSearch:true,
      editable:false
    },
    {
      title: '集约活动状态',
      dataIndex: 'wholesaleStatusDesc',
      valueType: 'text',
      editable:false,
    },
    {
      title: '集约活动开始时间',
      dataIndex: 'wholesaleStartTime',
      valueType: 'text',
      hideInSearch:true,
      editable:false,
      render:(_)=>{return <p>{moment(_*1000).format('YYYY-MM-DD HH:mm:ss')}</p>}
    },
    {
      title: '采购单下单截止时间',
      dataIndex: 'endTimeAdvancePayment',
      valueType: 'text',
      hideInSearch:true,
      editable:false,
      render:(_)=>{return <p>{moment(_*1000).format('YYYY-MM-DD HH:mm:ss')}</p>}
    },
    {
      title: '集约库存',
      dataIndex: 'totalStockNum',
      hideInSearch: true,
      editable:false,
      render: (_,data)=> {
        return <p>{_}{data?.unit}</p>
      },
    },
    {
      title: '集采箱规单位量',
      dataIndex: 'batchNumber',
      hideInSearch: true,
      render:(_,data)=>{
        return <p>{_}{data?.unit}/{data?.wsUnit}</p>
      },
      editable:false
    },
    {
      title: '单次起订量',
      dataIndex: 'minNum',
      hideInSearch: true,
      render:(_,data)=>{
        return <p>{_}{data?.unit}</p>
      },
      editable:false
    },
    {
      title: '最大限购量',
      dataIndex: 'maxNum',
      hideInSearch: true,
      valueType: 'digit',
      fixed: 'right'
    },
    {
      title: '活动库存',
      dataIndex: 'actStockNum',
      hideInSearch: true,
      renderFormItem: (_) =>{
        const obj=detailList?.find(ele=>{
          return ele.wsId==_?.entry?.wsId
        })
        if(obj){
          return  <>
                  <p>总库存：{_?.entry?.actTotalStockNum}{_?.entry?.unit}</p>
                  <p>（可用{_?.entry?.actStockNum}{_?.entry?.unit}）</p>
                  </>
        }else{
          return <InputNumber
                  min={_?.entry?.totalStockNum==0?0:_?.entry?.minNum}
                  max={_?.entry?.totalStockNum}
                  stringMode
                  onChange={(val)=>{
                    if(val%_?.entry?.batchNumber!==0){
                      message.error('请输入箱规单位量整倍数')
                    }
                  }}
                />
        }
      },
      fixed: 'right'
    },
    {
      title: '活动价',
      dataIndex: 'price',
      hideInSearch: true,
      valueType: 'digit',
      renderFormItem: (_) =>{
        return <FromWrap
        content={(value, onChange) =><InputNumber
                  min={amountTransform(_?.entry?.wholesaleSupplyPrice+_?.entry?.wholesaleFreight, '/')}
                  precision='2'
                  stringMode
                  value={value}
                  onChange={onChange}
                />
        }
        right={(value) =><p>元/{_?.entry?.unit}</p>}
        />
      },
      render: (_,r) =>{
        return <p>{_}</p>
      },
      fixed: 'right'
    },
    {
      title: '操作',
      valueType: 'option',
      render:(text, record, _, action)=>{
        return [
          <a style={{display:id?'none':'block'}} key='dele' onClick={()=>{setPennyId({wsId:record.wsId,type:1});setEndVisible(true)}}>删除</a>,
          <div key='detail' style={{display:record?.wholesaleStatus==0||record?.wholesaleStatus==3?'none':'block'}}>
            {
              record?.status==0?
              <a style={{color:'#AAAAAA',display:'block'}}>禁用</a>
              :
              <a style={{display:'block'}} key='detail' onClick={()=>{setPennyId({wsId:record.wsId,type:2});setEndVisible(true)}}>禁用</a>
            }
          </div>,
          <div key='start' style={{display:record?.wholesaleStatus==0||record?.wholesaleStatus==3?'none':'block'}}>
           {
             record?.status==1?
             <a style={{color:'#AAAAAA',display:'block'}}>启用</a>
             :
             <a style={{display:'block'}} key='start' onClick={()=>{setPennyId({wsId:record.wsId,type:3});setEndVisible(true)}}>启用</a>
           }
          </div>,
          <div key='repertory' style={{display:record?.wholesaleStatus==0||record?.wholesaleStatus==3?'none':'block'}}>
           {
             id&&detailList?.find(ele=>{return ele.wsId==record?.wsId})?
             <a key='start' style={{display:'block'}} onClick={()=>{setPennyId(record);setRepertoryVisible(true)}}>编辑<br/>库存</a>
             :null
           }
         </div>

      ]
      },
      editable:false,
      fixed: 'right'
    }
  ]; 
  return (
  <>
    <ProFormText
      width="md"
      name="price"
      label={<p><span style={{color:'red',fontSize:'15px'}}>* </span>活动商品</p>}
      fieldProps={{
        value:<Button key='add' type="primary" onClick={()=>{
                setVisible(true)
              }}>
                  选择活动商品
              </Button>
      }}
      readonly={true}
    />
    <EditableProTable
        rowKey="wsId"
        value={dataSource}
        actionRef={ref}
        recordCreatorProps={false}
        columns={columns}
        editable={{
          type: 'multiple',
          editableKeys,
          actionRender: (row, config, defaultDoms) => {
              return [defaultDoms.delete];
          },
          onValuesChange: (record, recordList) => {
            setDataSource(recordList)
            callback(recordList)
          },
        }}
        toolBarRender={()=>[
            <p>共{dataSource?.length}款商品</p>
        ]}
        style={{marginBottom:'30px'}}
        scroll={{x: 'max-content'}}
    />

    {
      visible&&<GoosModel
        title={'添加秒约商品'}  
        visible={visible} 
        setVisible={setVisible}
        callback={(val)=>{
          const arr = [];
          val.forEach(item => {
            arr.push({
              ...item,
              status:1,
              wsPrice:item.price,
              price:amountTransform(item.wholesaleSupplyPrice+item.wholesaleFreight, '/'),
              actStockNum:item.totalStockNum,
              gcName1:item?.gcName1?item?.gcName1:item.gcName.split('-')?.[0],
              gcName2:item?.gcName2?item?.gcName2:item.gcName.split('-')?.[1]
            })
          })
          setDataSource(arr)
          callback(arr)
          setEditableKeys(arr.map(item => item.wsId))
        }}
        onClose={()=>{}}
        keyId={dataSource}
        detailList={detailList||[]}
      />
    }
    {
      endVisible&&<EndModel 
      visible={endVisible} 
      setVisible={setEndVisible}  
      pennyId={pennyId} 
      callback={(arr)=>{
        ref.current.reload()
        setPennyId(null)
        setDataSource(arr) 
        callback(arr)
      }}
      onClose={()=>{ref.current.reload();setPennyId(null)}}
      dataSource={dataSource}
      />
    }
    {
      repertoryVisible&&<RepertoryModel
      visible={repertoryVisible} 
      setVisible={setRepertoryVisible}  
      record={pennyId}
      id={id}  
      callback={()=>{callLoading(1);setPennyId(null)}}
      />
    }
  </>
    
  );
};
