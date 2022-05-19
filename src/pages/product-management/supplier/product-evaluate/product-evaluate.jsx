import React, { useRef,useState,useEffect } from 'react';
import { PageContainer } from '@/components/PageContainer';
import ProTable from '@ant-design/pro-table';
import { history } from 'umi';
import { Button,Image,Tabs,Switch,message,Tooltip } from 'antd';
import ContentModel from './content-model';
import { ProFormSwitch} from '@ant-design/pro-form';
import AuditModel from './audit-model'
import styles from './style.less'
import { findByways,addCheck,check } from '@/services/product-management/product-evaluate';
import { Space } from 'antd';
import Export from '@/pages/export-excel/export'
import ExportHistory from '@/pages/export-excel/export-history'
import ImportHistory from '@/components/ImportFile/import-history'
import Import from '@/components/ImportFile/import'
import GoosEvaluate from './goos-evaluate'
import DeleteModel from './delete-model'
const { TabPane } = Tabs

const EvaluateList= (props) => {
    const { type }=props
    const ref=useRef()
    const [visible,setVisible]=useState()
    const [visiblePopup,setVisiblePopup]=useState()
    const [commentId,setCommentId]=useState()
    const [commentSkuId,setCommentSkuId]=useState()
    const [pitch,setPitch]=useState()
    const [visit, setVisit] = useState(false)
    const columns = [
        {
            title: '用户昵称',
            dataIndex: 'nickName',
            valueType: 'text',
        },
        {
            title: '用户评分',
            dataIndex: 'score',
            valueType: 'text',
            hideInSearch: true,
            width:150
        },
        {
            title: '用户评分',
            dataIndex: 'score',
            valueType: 'select',
            hideInTable:true,
            valueEnum: {
              0: '请选择',
              1: '1',
              2: '2',
              3: '3',
              4: '4',
              5: '5'
              }
        },
        {
            title: '评价内容',
            dataIndex: 'content',
            hideInSearch: true,
            render:(text, record, _, action)=>[
                <div className={styles.line_feed} key='content'>
                  {
                    record.content?
                    <Tooltip  placement="leftTop" title={record.content}>
                      <a key='link' onClick={()=>{setVisible(true);setCommentSkuId(record.id)}}>{record.content}</a>
                    </Tooltip>
                    :
                    <p key='null'>无</p>
                  }
                </div>

            ],
        },
        {
            title: '评价时间',
            dataIndex: 'commentTime',
            valueType: 'text',
            hideInSearch: true,
        },
        {
            title: '订单编号',
            dataIndex: 'orderSn',
            valueType: 'text',
        },
        {
            title: '被评商品SKUid',
            dataIndex: 'skuId',
            valueType: 'text',
            hideInSearch: true,
            width:200
        },
        {
            title: '商品名称',
            dataIndex: 'goodsName',
            valueType: 'text',
            hideInSearch: true,
        },
        {
            title: '被评商家ID',
            dataIndex: 'supplierId',
            valueType: 'text',
            width:150
        },
        {
            title: '被评商品名称',
            dataIndex: 'goodsName',
            valueType: 'text',
            hideInTable: true
        },
        {
            title: '被评商家名称',
            dataIndex: 'companyName',
            valueType: 'text',
        },
        {
            title: '操作',
            key: 'option',
            valueType: 'option',
            render: (_, data) => [
              <div key='audit' style={{display:type==1?'block':'none'}}>
                <a onClick={()=>passVerification(data,2)}>通过&nbsp;&nbsp;</a>
                <a onClick={()=>passVerification(data,3)}>屏蔽</a>
              </div>,
              <a key='eadit' style={{display:type==2?'block':'none'}} onClick={()=>passVerification(data,3,false)}>修改</a>,
              <a key='turn' style={{display:type==3?'block':'none'}} onClick={()=>passVerification(data,2,true)}>修改</a>
            ],
          },
    ];
  const passVerification=(data,type,status)=>{
    setVisiblePopup(true)
    setCommentId({id:data.id,state:type,status:status})
  }
  const auditSwitch=(off)=>{
         setPitch(off)
         addCheck({type:off?1:2}).then(res=>{
           if(res.code==0){
            ref.current?.reload()
            message.success('操作成功')
           }
        })
    }
  useEffect(()=>{
    check({}).then(res=>{
        setPitch(res.data)
      })
    },[])
  const getFieldValue = (searchConfig) => {
    const {...rest}=searchConfig.form.getFieldsValue()
    return {
      state:type,
      ...rest,
    }
  }
  return (
      <>
        <ProTable
            rowKey="id"
            options={false}
            actionRef={ref}
            params={{
              state:type
            }}
            scroll={{ x: 'max-content', scrollToFirstRowOnChange: true, }}
            request={findByways}
            search={{
                defaultCollapsed: true,
                labelWidth: 100,
                optionRender: (searchConfig, formProps, dom) => [
                  ...dom.reverse(),
                    <Export
                       key='export'
                       change={(e) => { setVisit(e) }}
                       type={'data-goods-comment-export'}
                       conditions={()=>{return getFieldValue(searchConfig)}}
                     />,
                     <ExportHistory key='task' show={visit} setShow={setVisit} type={'data-goods-comment-export'}/>
                ],
            }}
            toolBarRender={() => [
              <ProFormSwitch
                label="审核功能开关"
                className='switchTop'
                fieldProps={{
                    onChange:(bol)=>auditSwitch(bol),
                    checked:pitch
                }}
                key='switch'
              />
            ]}
            columns={columns}
            pagination={{
                pageSize: 10,
                showQuickJumper: true,
            }}
            className={styles.product_evaluate}

        />
        <div style={{background:'#fff',padding:'25px 0 25px 25px'}}>
          <p>说明：</p>
          <p>1、用户没填写任何评价内容，只做评分的，不需要进行审核（直接通过）</p>
        </div>
         {visible&&
            <ContentModel
                setVisible={setVisible}
                visible={visible}
                id={commentSkuId}
            />
        }
        {
          visiblePopup&&
          <AuditModel 
            visiblePopup={visiblePopup}
            setVisiblePopup={setVisiblePopup}
            record={commentId}
            boxref={ref}
            type={type}
        />
        }
    </>
  );
};
const ImportEvaluate= (props) => {
  const { type }= props
  const ref= useRef()
  const [visible, setVisible]= useState()
  const [visiblePopup, setVisiblePopup]= useState()
  const [visibleEvaluate, setVisibleEvaluate]= useState()
  const [commentId, setCommentId]= useState()
  const [commentSkuId, setCommentSkuId]= useState()
  const [pitch, setPitch]= useState()
  const [importVisit, setImportVisit] = useState(false)
  const [visibleDelete, setVisibleDelete] = useState(false)
  const [productId, setProductId]= useState()
  const columns = [
      {
        title: '序号',
        dataIndex:'id',
        valueType: 'borderIndex',
        hideInSearch: true,
        valueType: 'indexBorder'
      },
      {
        title: '被评商品SPUid',
        dataIndex: 'spuId',
        valueType: 'text',
        hideInSearch: true,
        width:200
      },
      {
        title: '被评商品SKUid',
        dataIndex: 'skuId',
        valueType: 'text',
        width:200,
        order:2
      },
      {
        title: '被评商品名称',
        dataIndex: 'goodsName',
        valueType: 'text',
        order:1
      },
      {
        title: '被评商家名称',
        dataIndex: 'goodsName',
        valueType: 'text',
        order:3,
        hideInTable: true
      },
      {
        title: '被评商家ID',
        dataIndex: 'supplierId',
        valueType: 'text',
        width:150,
        order:4
      },
      {
          title: '评价内容',
          dataIndex: 'content',
          hideInSearch: true,
          render:(text, record, _, action)=>[
              <div className={styles.line_feed} key='content'>
                {
                  record.content?
                  <Tooltip  placement="leftTop" title={record.content}>
                    <a key='link' onClick={()=>{setVisible(true);setCommentSkuId(record.id)}}>{record.content}</a>
                  </Tooltip>
                  :
                  <p key='null'>无</p>
                }
              </div>

          ],
      },
      {
        title: '评价星级',
        dataIndex: 'orderSn',
        valueType: 'text',
        hideInSearch: true
      },
      {
          title: '创建评价时间',
          dataIndex: 'commentTime',
          valueType: 'text',
          hideInSearch: true,
      },
      {
          title: '操作',
          key: 'option',
          valueType: 'option',
          render: (_, data) => [
            <a key='eadit'  onClick={()=>{setVisibleEvaluate(true);setProductId()}}>编辑</a>,
            <a key='delete' onClick={()=>{setVisibleDelete(true);setProductId()}}>删除</a>
          ],
        },
  ];
const passVerification=(data,type,status)=>{
  setVisiblePopup(true)
  setCommentId({id:data.id,state:type,status:status})
}
const auditSwitch=(off)=>{
       setPitch(off)
       addCheck({type:off?1:2}).then(res=>{
         if(res.code==0){
          ref.current?.reload()
          message.success('操作成功')
         }
      })
  }
useEffect(()=>{
  check({}).then(res=>{
      setPitch(res.data)
    })
  },[])
const getFieldValue = (searchConfig) => {
  const {...rest}=searchConfig.form.getFieldsValue()
  return {
    state:type,
    ...rest,
  }
}
return (
    <>
      <ProTable
          rowKey="id"
          options={false}
          actionRef={ref}
          params={{
            state:type
          }}
          scroll={{ x: 'max-content', scrollToFirstRowOnChange: true, }}
          request={findByways}
          search={{
              defaultCollapsed: true,
              labelWidth: 100,
              optionRender: (searchConfig, formProps, dom) => [
                ...dom.reverse()
              ],
          }}
          toolBarRender={() => [
            <Button type="primary" onClick={()=>{setVisibleEvaluate(true)}}>新增评价</Button>,
            <Import
              change={(e) => { setImportVisit(e) }}
              code="order_common_send_goods_import"
              conditions={getFieldValue}
            />,
            <ImportHistory show={importVisit} setShow={setImportVisit} type="order_common_send_goods_import" />,
            <a href=''>下载exce模板</a>
          ]}
          columns={columns}
          pagination={{
              pageSize: 10,
              showQuickJumper: true,
          }}
          className={styles.product_evaluate}
      />
      {visible&&
        <ContentModel
            setVisible={setVisible}
            visible={visible}
            id={commentSkuId}
        />
      }
      {visibleEvaluate&&
        <GoosEvaluate
            setVisible={setVisibleEvaluate}
            visible={visibleEvaluate}
            id={productId}
            callback={() => { ref.current.reload(); setProductId(null) }}
            onClose={() => { ref.current.reload(); setProductId(null) }}
        />
      }
      {visiblePopup&&
        <AuditModel 
          visiblePopup={visiblePopup}
          setVisiblePopup={setVisiblePopup}
          record={commentId}
          boxref={ref}
          type={type}
      />
      }
      {visibleDelete&&
        <AuditModel 
          visible={visibleDelete}
          setVisible={setVisibleDelete}
          id={productId}
          callback={() => { ref.current.reload(); setProductId(null) }}
          onClose={() => { ref.current.reload(); setProductId(null) }}
      />
      }
  </>
);
};

export default (props) =>{
    const [seleType,setSeleType]=useState(1)
    return (
      <PageContainer>
        <Tabs
          centered
          defaultActiveKey="1"
          style={{
            background: '#fff',
            padding: 25
          }}
          onChange={(val)=>{
            setSeleType(val)
          }}
        >
          <TabPane tab="待处理" key="1">
            {
              seleType==1&&<EvaluateList type={1}/>
            }
          </TabPane>
          <TabPane tab="已通过" key="2">
            {
              seleType==2&&<EvaluateList type={2}/>
            }
          </TabPane>
          <TabPane tab="已屏蔽" key="3">
            { 
              seleType==3&&<EvaluateList type={3}/> 
            }
          </TabPane>
          <TabPane tab="评价导入" key="4">
            { 
              seleType==4&&<ImportEvaluate type={4}/> 
            }
          </TabPane>
        </Tabs>
      </PageContainer>
    )
  }