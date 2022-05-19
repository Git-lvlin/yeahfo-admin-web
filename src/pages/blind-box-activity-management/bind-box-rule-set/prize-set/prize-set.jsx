import React, { useState, useRef,useEffect } from 'react';
import { Button,Tabs,Image,Form,Modal,Select,Switch, Input,InputNumber,message} from 'antd';
import { EditableProTable } from '@ant-design/pro-table';
import { PlusOutlined } from '@ant-design/icons';
import { amountTransform } from '@/utils/utils'
import ProTable from '@ant-design/pro-table';
import { productList } from '@/services/intensive-activity-management/intensive-activity-create'
import BrandSelect from '@/components/brand-select'
import GcCascader from '@/components/gc-cascader'
import { ModalForm } from '@ant-design/pro-form';
import _ from 'lodash'
import UploadingList from './uploading-list'
import AddCashModel from './add-cash-model'
import AssignModel from './assign-model'



const SelectProductModal=(props) => {
  const { visible, setVisible, callback,hideAll, title = '选择活动商品',goodsSaleType, apolloConfig,keyId,detailList} = props;
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectItems, setSelectItems] = useState([]);
  const [keys,setKeys]=useState()
  const [goosList,setGoosList]=useState()
  const [dataList,setDataList]=useState([])

  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
    layout: {
      labelCol: {
        span: 4,
      },
      wrapperCol: {
        span: 14,
      },
    }
  };


  const columns = [
    {
      title: 'spuID',
      dataIndex: 'spuId',
      valueType: 'text',
      fieldProps: {
        placeholder: '请输入spuID'
      }
    },
    {
      title: 'skuID',
      dataIndex: 'skuId',
      valueType: 'text',
      fieldProps: {
        placeholder: '请输入skuID'
      }
    },
    {
      title: '商品名称',
      dataIndex: 'goodsName',
      valueType: 'text',
      fieldProps: {
        placeholder: '请输入商品名称'
      },
      render: (_, records) => (
        <div style={{ display: 'flex' }}>
          <img width="50" height="50" src={records.imageUrl} />
          <div style={{ marginLeft: 10, wordBreak: 'break-all' }}>{_}</div>
        </div>
      )
    },
    {
      title: '供应商家ID',
      dataIndex: 'supplierId',
      valueType: 'text',
      hideInTable: true,
    },
    {
      title: '结算模式',
      dataIndex: 'settleType',
      valueType: 'select',
      hideInTable: true,
      valueEnum: {
        1: '佣金模式',
        2: '底价模式',
      },
    },
    {
      title: '商品分类',
      dataIndex: 'gcId',
      renderFormItem: () => (<GcCascader />),
      hideInTable: true,
    },
    {
      title: '商品品牌',
      dataIndex: 'brandId',
      renderFormItem: () => (<BrandSelect />),
      hideInTable: true,
    },
    {
      title: '供货价(元)',
      dataIndex: 'retailSupplyPriceDisplay',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '秒约价(元)',
      dataIndex: 'salePriceDisplay',
      valueType: 'text',
      hideInSearch: true,

    },
    {
      title: '可用库存',
      dataIndex: 'stockNum',
      valueType: 'text',
      hideInSearch: true,
    },
  ];

  const onsubmit = (values) => {
    if(goosList){
      callback(goosList)
    }
    setVisible(false)
  };
  useEffect(()=>{
    const arr=[]
    keyId.map(ele=>{
      if(ele.skuId){
        arr.push(ele.skuId)
      }
    })
    setKeys(arr)
  },[])
  const postData=(data)=>{
    dataList.push(...data)
    setDataList(dataList)
    return data
  }

  return (
    <ModalForm
      title={title}
      modalProps={{
      }}
      onVisibleChange={setVisible}
      visible={visible}
      width={1200}
      onFinish={async (values) => {
        await onsubmit(values);
      }}
      labelAlign="right"
      {...formItemLayout}
    >
      <ProTable
        columns={columns}
        rowKey="skuId"
        options={false}
        request={productList}
        params={{
          goodsState: 1,
          goodsVerifyState: 1,
          hasStock: 1,
          goodsSaleType:goodsSaleType?2:'',
          apolloConfig:apolloConfig?apolloConfig:''
        }}
        postData={postData}
        search={{
          defaultCollapsed: false,
          labelWidth: 100,
          optionRender: (searchConfig, formProps, dom) => [
            ...dom.reverse(),
          ],
        }}
        pagination={{
          pageSize: 10,
        }}
        rowSelection={{
          preserveSelectedRowKeys: true,
          onChange: (_, val) => {
            const arr=[]
            _.forEach(item=>{
             const obj=[...detailList,...dataList].find(ele=>{
               return ele.skuId==item
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
      />
    </ModalForm>
  );
};

export default (props) => {
  const {callback,id,falg,detailList}=props
  const ref=useRef()
  const [dataSource, setDataSource] = useState([]);
  const [editableKeys, setEditableKeys] = useState([])
  const [visible, setVisible] = useState(false);
  const [cashVisible, setCashVisible] = useState(false);
  const [listVisible, setListVisible] = useState(false);
  const [assignVisible, setAssignVisible] = useState(false);
  const [cashProps,setCashProps]=useState()
  const [designateId,setDesignateId]=useState()
  useEffect(()=>{
    if(!falg){
     setDataSource(detailList?.skus)
     setEditableKeys(detailList?.skus.map(item => item.id))
    }
  },[falg])

  const columns= [
    {
      title: '序号',
      dataIndex:'id',
      valueType: 'borderIndex',
      hideInSearch: true,
      valueType: 'indexBorder',
      editable:false,
    },
    {
      title: 'SKUID',
      dataIndex: 'skuId',
      valueType: 'text',
      editable:false,
    },
    {
      title: '商品图片',
      dataIndex: 'imageUrl',
      valueType: 'image',
      hideInSearch:true,
      editable:false,
    },
    {
      title: '商品名称',
      dataIndex: 'goodsName',
      valueType: 'text',
      editable:false,
    },
    {
      title: '销售价',
      valueType: 'text',
      dataIndex: 'salePrice',
      hideInSearch:true,
      editable:false,
       render: (_)=> amountTransform(parseInt(_), '/').toFixed(2)
    },
    {
      title: '零售供货价',
      dataIndex: 'retailSupplyPrice',
      valueType: 'text',
      hideInSearch:true,
      editable:false,
       render: (_)=> amountTransform(parseInt(_), '/').toFixed(2)
    },
    {
      title: '可用库存',
      dataIndex: 'baseStockNum',
      valueType: 'text',
      editable:false,
      render:(_,data)=>{
        if(data?.skuId==0){
          return <p>-</p>
        }else{
          return <p>{_}</p>
        }
      }
    },
    {
      title: '奖品库存',
      dataIndex: 'stockNum',
      valueType: 'digit',
      hideInSearch:true,
      renderFormItem: (_,r) => {
        if(_.entry?.skuId==0){
          return  <InputNumber
                  min="0"
                  stringMode
                />
        }else{
          return  <InputNumber
          min="0"
          max={_.entry?.baseStockNum}
          stringMode
        />
        }
      },
      render: (_,r) =>{
        return <p>{_}</p>
      }
    },
    {
      title: '已消耗件数',
      dataIndex: 'consumeNum',
      valueType: 'text',
      editable:false,
      hideInTable:!id||!falg
    },
    {
      title: '中奖概率%',
      dataIndex: 'probability',
      valueType: 'digit',
      hideInSearch: true,
      renderFormItem: (_,r) => {
        if(r?.record?.assignType){
          return <p>-</p>
        }
        return  <InputNumber
                  min="0"
                  max="100"
                  precision='2'
                  stringMode
                />
        },
      render: (_,r) =>{
        if(r?.assignType){
          return <p>-</p>
        }
        return <p>{_}%</p>
      }
    },
    {
      title: '状态',
      dataIndex: 'status',
      hideInSearch: true,
      renderFormItem: (_,r) => {
      return <Switch checked={_.entry.status}/>
      },
      render: (_,r) =>{
        return <p>
        {
          r.status?'开启':'关闭'
        }
      </p>
      }
    },
    {
      title: '指定中奖人状态',
      dataIndex: 'assignType',
      hideInSearch: true,
      renderFormItem: (_,r) => {
      return <Switch checked={_.entry.assignType}/>
      },
      render: (_,r) =>{
        return <p>
        {
          r.assignType?'开启':'关闭'
        }
      </p>
      },
      align: 'center'
    },
    {
      title: '指定中奖人',
      dataIndex: 'assignPhones',
      hideInSearch: true,
      render: (_,r) =>{
        if(_.length>1){
          return <a onClick={()=>{setDesignateId(r.id);setAssignVisible(true)}}>查看</a>
        }
        return <p>无</p>
      },
      align: 'center',
      hideInTable:id&&!falg
    },
    {
      title: '操作',
      valueType: 'text',
      render:(text, record, _, action)=>{
        return [
          <a key='dele' style={{display:'block'}} onClick={()=>delGoods(record.id)}>删除</a>,
          <a key='assign' onClick={()=>designate(record.id)}>指定中奖人</a>
      ]
      },
      editable:false,
      hideInTable:id&&falg
   }
  ]; 
  // 删除商品
  const  delGoods=val=>{
    const arr=dataSource.filter(ele=>(
          ele.id!=val
    ))
    let sum=0
    arr.map(ele=>{
      if(ele.status){
        sum=amountTransform(amountTransform(sum, '*')+amountTransform(ele.probability, '*'),'/')
      }
    })
    setDataSource(arr) 
    callback(arr,sum)
  }

  const designate=val=>{
    setListVisible(true)
    setDesignateId(val)
  }
  return (
    <>
    <EditableProTable
        rowKey="id"
        headerTitle="奖品设置"
        value={dataSource}
        recordCreatorProps={false}
        columns={columns}
        editable={{
          type: 'multiple',
          editableKeys,
          actionRender: (row, config, defaultDoms) => {
              return [defaultDoms.delete];
          },
          onValuesChange: (record, recordList) => {
            let sum=0
            recordList.map(ele=>{
              if(ele.status&&!ele.assignType){
                sum=amountTransform(amountTransform(sum, '*')+amountTransform(ele.probability, '*'),'/')
              }
            })
            if(sum>100){
              message.error('所有开启的商品概率总和不能超过100%')
            }else{
              setDataSource(recordList)
              callback(recordList,sum)
            }
          },
        }}
        toolBarRender={()=>[
            <Button key='addCash' type="primary" onClick={()=>{
              setCashVisible(true)
            }}>
                <PlusOutlined />
                添加现金红包
            </Button>,
            <Button key='add' type="primary" onClick={()=>{
              setVisible(true)
            }}>
                <PlusOutlined />
                添加秒约商品
            </Button>,
            <>
            {
              visible&&<SelectProductModal
                title={'添加秒约商品'}  
                visible={visible} 
                setVisible={setVisible}
                goodsSaleType={2} 
                apolloConfig={'MHSupplierId'}
                keyId={dataSource}
                detailList={detailList?.skus||[]}
                callback={(val)=>{
                  const arr = dataSource.length>0?dataSource.filter(ele=>ele.skuId==0):[];
                  val.forEach(item => {
                    arr.push({
                      stockNum: 0,
                      goodsType:1,
                      ...item
                    })
                  })
                    setDataSource(arr)
                    callback(arr)
                    setEditableKeys(arr.map(item => item.id))
                }}
              />
            }
            </>
        ]}
        style={{marginBottom:'30px',display:id&&falg?'none':'block'}}
    />

    <ProTable
      toolBarRender={false}
      search={false}
      rowKey="skuId"
      columns={columns}
      dataSource={detailList?.skus}
      style={{display:id&&falg?'block':'none'}}
    />
    {listVisible&&<UploadingList 
      visible={listVisible} 
      setVisible={setListVisible} 
      phones={detailList?.skus.find(ele=>{
        return ele.id==designateId
      })?.assignPhones}  
      falg={falg}
      dataSource={dataSource}
      endId={id}
      designateId={designateId} 
      callback={(val)=>{
        const arr=dataSource.map(ele=>{
          if(ele.id==designateId){
            return {...ele,assignPhones:val}
          }else{
            return {...ele}
          }
        })
        setDataSource(arr)
        callback(arr)
        setDesignateId(null)
      }}/>
    }
    {cashVisible&&<AddCashModel 
      visible={cashVisible} 
      setVisible={setCashVisible}   
      id={id}
      falg={falg}
      dataSource={dataSource} 
      callback={(val)=>{
        const arr2=[...dataSource,{...val,skuId:0,spuId: 0,id:+new Date(),goodsType:2,salePrice:amountTransform(val?.salePrice, '*')}]
        setDataSource(arr2)
        setEditableKeys(arr2.map(item=>item.id))
        callback(arr2)
        // setCashProps({...val,skuId:0,spuId: 0,id:+new Date(),goodsType:2,salePrice:amountTransform(val?.salePrice, '*')})
      }}/>
    }
    {assignVisible && <AssignModel
      visible={assignVisible}
      setVisible={setAssignVisible}
      phones={detailList?.skus.find(ele=>{
        return ele.id==designateId
      })?.assignPhones} 
      onClose={()=>{setDesignateId(null)}}
      callback={()=>{setDesignateId(null)}}
    />}
    </>
    
  );
};
