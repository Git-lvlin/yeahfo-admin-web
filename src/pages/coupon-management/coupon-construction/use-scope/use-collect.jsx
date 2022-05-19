import React, { useState, useRef,useEffect } from 'react';
import { Form, Button, Modal,Select, message} from 'antd';
import { ModalForm,ProFormSelect,ProFormRadio,ProFormDependency} from '@ant-design/pro-form';
import ProTable from '@ant-design/pro-table';
import styles from '../style.less'
import { amountTransform } from '@/utils/utils'
import {commonSpuList}  from '@/services/coupon-construction/coupon-common-spu-list';
import {classList} from '@/services/coupon-construction/coupon-class-list'
import BrandSelect from '@/components/brand-select'
import { connect } from 'umi';


const GoosModel=(props)=>{
    const {dispatch, UseScopeList}=props
    const actionRef = useRef();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [spuIdsArr,setSpuIdsArr]=useState([])
    const [loading,setLoading]=useState(true)
    const [spuIds,setSpuIds]=useState('')
    const columns = [
        {
            title: 'spuID',
            dataIndex: 'spuId',
        },
        {
            title: '商品图片',
            dataIndex: 'goodsImageUrl',
            valueType: 'image',
            hideInSearch: true
        },
        {
            title: '商品名称',
            dataIndex: 'goodsName',
            valueType: 'text',
            ellipsis:true
        },
        {
            title: '商品分类',
            dataIndex: 'gcId1',
            valueType: 'select',
            renderFormItem: () => (
            <Select
                placeholder="请选择商品类型"
                options={onselect}
              />
            ),
            hideInTable:true
        },
        {
            title: '商品分类',
            dataIndex: 'gcId1Display',
            valueType: 'text',
            hideInSearch:true
        },
        {
            title: '商品品牌',
            dataIndex: 'brandName',
            valueType: 'text',
            hideInSearch: true,
        },
        {
            title: '商品品牌',
            dataIndex: 'brandId',
            renderFormItem: () => (<BrandSelect />),
            hideInTable: true,
        },
        {
            title: '可用库存',
            dataIndex: 'stockNum',
            hideInSearch: true,

        },
        {
            title: '销售价',
            dataIndex: 'goodsSalePrice',
            hideInSearch: true,
            render: (_)=> amountTransform(_, '/').toFixed(2)
        }
    ];
    const columns3= [
        {
            title: 'spuID',
            dataIndex: 'spuId',
        },
        {
            title: '商品图片',
            dataIndex: 'goodsImageUrl', 
            valueType: 'image'
        },
        {
            title: '商品名称',
            dataIndex: 'goodsName',
            valueType: 'text',
            ellipsis:true
        },
        {
            title: '商品分类',
            dataIndex: 'gcId1Display',
            valueType: 'text',
        },
        {
            title: '商品品牌',
            dataIndex: 'brandName',
            valueType: 'text',
        },
        {
            title: '可用库存',
            dataIndex: 'stockNum',
        },
        {
            title: '销售价',
            dataIndex: 'goodsSalePrice',
            render: (_)=> amountTransform(_, '/').toFixed(2)
        },
        {
            title: '操作',
            valueType: 'text',
            render:(text, record, _, action)=>[
                <a onClick={()=>delGoods(record.spuId)}>删除</a>
            ]
         }
    ];
    const showModal = () => {
        setIsModalVisible(true);
        setLoading(true)
    };
    const handleOk = () => {
        setIsModalVisible(false);
        setLoading(false)
        dispatch({
            type:'UseScopeList/fetchLookSpuIds',
            payload:{
                spuIds
            }
        })
        dispatch({
            type:'UseScopeList/fetchLookSpuIdsArr',
            payload:{
                spuIdsArr
            }
        })
    };
    // 删除商品
    const  delGoods=val=>{
        const arr = UseScopeList.UseScopeObje.spuIds.split(',')
        dispatch({
            type:'UseScopeList/fetchLookSpuIds',
            payload:{
                spuIds:arr.filter(ele=>(
                    ele!=val
                )).toString()
            }
        })
        dispatch({
            type:'UseScopeList/fetchLookSpuIdsArr',
            payload:{
                spuIdsArr:UseScopeList.UseScopeObje.spuIdsArr.filter(ele=>(
                    ele.spuId!=val
                ))
            }
        })
       
    }
    const handleCancel = () => {
        setIsModalVisible(false);
    };
    return (
        <>
            <Button type="primary" className={styles.popupBtn} onClick={showModal}>
                选择商品
            </Button>
            
            <Modal key="id" width={1200}  visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                <ProTable
                    rowKey="id"
                    options={false}
                    style={{display:loading?'block':'none'}}
                    request={commonSpuList}
                    actionRef={actionRef}
                    search={{
                        defaultCollapsed: true,
                        labelWidth: 100,
                        optionRender: (searchConfig, formProps, dom) => [
                            ...dom.reverse(),
                        ],
                    }}
                    columns={columns}
                    rowSelection={{
                        preserveSelectedRowKeys: true,
                        onChange: (_, val) => {
                            setSpuIds(_.toString())
                            setSpuIdsArr(val)
                        }
                      }}
                />
            </Modal>
            <ProTable
                toolBarRender={false}
                search={false}
                rowKey="spuId"
                columns={columns3}
                dataSource={UseScopeList.UseScopeObje.spuIdsArr}
                style={{display:isModalVisible?'none':'block'}}
            />
        </>
    )
}

const CategoryModel=(props)=>{
    const {dispatch, UseScopeList}=props
    const [onselect,setOnselect]=useState([])
    const [flag,setFlag]=useState(true)
    const columns2=[
        {
           title: '分类',
           dataIndex: 'gcName',
        },
        {
         title: '操作',
         valueType: 'text',
         render:(text, record, _, action)=>[
             <a onClick={()=>delType(record.id)}>删除</a>
         ]
      }
     ]
    //商品分类
    useEffect(()=>{
        classList({gcParentId:0}).then(res=>{
           if(res.code==0){
            setOnselect(res.data.map(ele=>(
                {label:ele.gcName,value:ele.id}
            )))
           }
        })
    },[])
    const onCate=()=>{
        setFlag(true)
    }
    // 删除品类
    const delType=id=>{
        dispatch({
            type:'UseScopeList/fetchLookUnit',
            payload:{
                unit:null
            }
        })
        dispatch({
            type:'UseScopeList/fetchLookUnitArr',
            payload:{
                unitArr:[]
            }
        })
        setFlag(true)
    }
    
    return (
        <>
            <ModalForm
                title="选择品类"
                trigger={<Button className={styles.popupBtn} type="primary" onClick={onCate}>选择品类</Button>}
                submitter={{
                render: (props, defaultDoms) => {
                    return [
                    ...defaultDoms
                    ];
                },
                }}
                style={{display:flag?'block':'none'}}
                onFinish={async (values) => {
                dispatch({
                    type:'UseScopeList/fetchLookUnit',
                    payload:{
                        unit:values.unit
                    }
                })
                dispatch({
                    type:'UseScopeList/fetchLookUnitArr',
                    payload:{
                        unitArr:[
                            {
                                id: values.unit,
                                gcName: onselect.filter(ele=>(
                                    ele.value==values.unit
                                ))[0].label
                            }
                            ]
                    }
                })
                setFlag(false)
                return true;
                }}
            >
                <ProFormSelect
                    name="unit"
                    options = {onselect}
                    placeholder="美妆个护"
                />
            </ModalForm>

            <ProTable
                search={false}
                toolBarRender={false}
                columns={columns2}
                dataSource={UseScopeList.UseScopeObje.unitArr}
            />
        </>
    )
} 
    
const useSecond=(props)=>{
    const {id,dispatch,DetailList, UseScopeList,choose,form,type}=props
    const [position,setPosition]=useState(false)
    useEffect(()=>{
        setTimeout(()=>{
            if(parseInt(id)==id){
                dispatch({
                    type:'UseScopeList/fetchLookSpuIds',
                    payload:{
                        spuIds:DetailList.data&&DetailList.data?.spuIds
                    }
                })
                dispatch({
                    type:'UseScopeList/fetchLookSpuIdsArr',
                    payload:{
                        spuIdsArr:DetailList.data&&DetailList.data?.spuInfo
                    }
                })
                dispatch({
                    type:'UseScopeList/fetchLookUnit',
                    payload:{
                        unit:DetailList.data&&DetailList.data?.classInfo.id
                    }
                })
                dispatch({
                    type:'UseScopeList/fetchLookUnitArr',
                    payload:{
                        unitArr:DetailList.data&&DetailList.data?.classInfo.length==0?[]:[DetailList.data?.classInfo]
                    }
                })
            }
        },1000) 
    },[])
    useEffect(()=>{
        if(choose==4){
            form.setFieldsValue({goodsType:2})
        }
    },[choose])
    return(
        <Form.Item className={styles.unfold}>
            {
                type==3||DetailList.data?.issueType == 3 && id || type==4||DetailList.data?.issueType == 4 && id?
                <GoosModel 
                    dispatch={dispatch} 
                    DetailList={DetailList}
                    UseScopeList={UseScopeList}
                />
            :
            <>
                <ProFormRadio.Group
                    name="goodsType"
                    label='商品范围'
                    rules={[{ required: true, message: '请选择商品范围' }]}
                    fieldProps={{
                        onChange: (e) => setPosition(e.target.value),
                        value:choose==4?2:position||(parseInt(id)==id )&&DetailList.data?.goodsType
                    }}
                    options={[
                    {
                        label:'全部商品',
                        value: 1,
                        disabled:choose==4||(parseInt(id)==id )&&DetailList.data?.memberType==4
                    },
                    {
                        label: '指定商品',
                        value: 2,
                    },
                    {
                        label: '指定品类',
                        value: 3,
                        disabled:choose==4||(parseInt(id)==id )&&DetailList.data?.memberType==4
                    },
                    ]}

                />
                <ProFormDependency name={['goodsType']}>
                {({ goodsType }) => {
                    if(!goodsType||goodsType==1) return null
                    if(goodsType==2||choose==4){
                        return <GoosModel 
                                    dispatch={dispatch} 
                                    DetailList={DetailList} 
                                    UseScopeList={UseScopeList}
                                />
                    }
                    if(goodsType==3){
                        return <CategoryModel
                                    dispatch={dispatch} 
                                    UseScopeList={UseScopeList}
                                />
                    }
                }}
                </ProFormDependency>
            </>

        } 
           
        </Form.Item>
    )
}
export default connect(({ DetailList,UseScopeList}) => ({
    UseScopeList,
    DetailList
  }))(useSecond);