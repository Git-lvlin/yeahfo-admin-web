import React, { useState, useRef, useEffect } from 'react';
import {ProTable,EditableProTable} from '@ant-design/pro-table';
import { PageContainer } from '@/components/PageContainer';
import AddressMultiCascader from '@/components/address-multi-cascader'
import AddressCascader from '@/components/address-cascader'
import { Form,Button, message,Tabs,InputNumber,Space } from 'antd';
import { getApplicableArea, setApplicableArea, changeApplicableArea,editApplicableAreaDeposit } from '@/services/intensive-store-management/shop-area'
import { getAreaData } from '@/utils/utils'
import AmendModel from './amend-model'
import ProForm,{ ProFormText } from '@ant-design/pro-form';
import ServiceCharge from './service-charge' 
import Handicapped from './handicapped-person' 
import { InfoCircleFilled } from '@ant-design/icons';
const { TabPane } = Tabs

const FromWrap = ({ value, onChange, content, right }) => (
  <div style={{ display: 'flex' }}>
    <div>{content(value, onChange)}</div>
    <div style={{ marginLeft: 10}}>{right(value)}</div>
  </div>
)

const formItemLayout = {
  labelCol: { span: 1 },
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

const ShopArea = () => {
  const [form] = Form.useForm()
  const [tips, setTips] = useState('');
  const [selectKeys, setSelectKeys] = useState([]);
  const [uncheckableItemValues, setUncheckableItemValues] = useState([]);
  const [disabledItemValues, setDisabledItemValues] = useState([]);
  const [editableKeys, setEditableRowKeys] = useState([]);
  const [visible, setVisible] = useState(false);
  const [earnestMoney,setEarnestMoney] = useState();
  const actionRef = useRef();
  const formRef = useRef();
  const ref=useRef()

  const changeStatus = (data) => {
    changeApplicableArea({
      status: data.status === 'on' ? 'off' : 'on',
      regionId: data.regionId,
      cityId: data.cityId,
      provinceId: data.provinceId,
    }, { showSuccess: true })
      .then(res => {
        if (res.code === 0) {
          actionRef.current.reload();
        }
      })
  }

  const columns = [
    {
      title: '省份',
      dataIndex: 'provinceName',
      valueType: 'text',
      hideInSearch: true,
      editable:false,
    },
    {
      title: '城市',
      dataIndex: 'cityName',
      valueType: 'text',
      hideInSearch: true,
      editable:false,
    },
    {
      title: '地区/县城',
      dataIndex: 'regionName',
      valueType: 'text',
      hideInSearch: true,
      editable:false,
    },
    {
      title: '入驻保证金(元)',
      dataIndex: 'deposit',
      valueType: 'text',
      hideInSearch: true,
      renderFormItem: (data,r) => {
        return <FromWrap
                content={
                  (value, onChange) => 
                  <InputNumber
                    min="0"
                    max="1000000"
                    precision='2'
                    value={value}
                    onChange={onChange}
                    stringMode
                  />
                 }
                right={(value) => {
                  return (
                    <a onClick={()=>{
                      setEarnestMoney({data:data.entry,deposit:r.record?.deposit})
                      setVisible(true)
                    }}>确定</a>
                  )
                }}
              />
        },
      render: (text, record, _, action) =>{
        return <FromWrap
                content={
                  () => 
                  <InputNumber
                    min="0"
                    max="1000000"
                    precision='2'
                    value={text}
                    disabled={true}
                    stringMode
                  />
                }
                right={(value) => {
                  return (
                    <a onClick={()=>{action?.startEditable?.(record.regionId);}}>修改</a>
                  )
                }}
              />
      }
    },
    {
      title: '所在地区',
      dataIndex: 'area',
      hideInTable: true,
      renderFormItem: () => (<AddressCascader changeOnSelect placeholder="请选择" />),
      editable:false,
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueType: 'text',
      render: (_) => {
        return <span style={{ color: _ === 'on' ? 'green' : 'red' }}>{_ === 'on' ? '启用' : '禁用'}</span>
      },
      hideInSearch: true,
      editable:false,
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueType: 'select',
      valueEnum: {
        'on': '启用',
        'off': '禁用'
      },
      hideInTable: true,
      editable:false,
    },
    {
      title: '操作',
      valueType: 'option',
      render: (_, data) => {
        return <a onClick={() => { changeStatus(data) }}>{data.status === 'on' ? '禁用' : '启用'}</a>
      },
      editable:false,
    },
  ];
  const getAreaDatas = (v) => {
    const arr = [];
    const brr = []
    v?.forEach?.(item => {
      let deep = 0;
      let node = window.yeahgo_area.find(it => it.id === item);
      const nodeIds = [node.id];
      const nodeNames = [node.name]
      if(node.children){
        const toTreeData = (data) => { 
          data?.forEach(item => {
            if(item.deep == 3){
              brr.push(item.id)
            }
              toTreeData(item.children)
          })  
        }
        toTreeData(node?.children)
      }
      while (node.pid) {//找父级
        deep += 1;
        node = window.yeahgo_area.find(it => it.id === node.pid);
        nodeIds.push(node.id);
        nodeNames.push(node.name);
      }
      arr.push({
        provinceId: nodeIds[deep],
        provinceName: nodeNames[deep],
        cityId: deep > 0 ? nodeIds[deep - 1] : 0,
        cityName: deep > 0 ? nodeNames[deep - 1] : '',
        regionId: deep > 1 ? nodeIds[deep - 2] : 0,
        regionName: deep > 1 ? nodeNames[deep - 2] : '',
      })
    })
  if(brr.length){
    return getAreaData(brr)
  }else{
    return arr;
  }
}
  const postData = (data) => {
    if (data.tips) {
      setTips(data.tips)
    }
    return data.records;
  }

  const getUncheckableItemValues = () => {
    setUncheckableItemValues(window.yeahgo_area.filter(item => item.deep !== 3).map(item => item.id))
    getApplicableArea({
      page: 1,
      size: 9999,
    }).then(res => {
      const keys = res.data.records?.map(item => item.regionId)
      setDisabledItemValues(keys)
    })
  }

  const setArea = () => {
    if (selectKeys.length === 0) {
      message.error('请选择要添加的区域')
      return;
    }
    setApplicableArea({
      areas: getAreaDatas(selectKeys).map((ele)=>({...ele,status:'on'})),
      append: true,
    }, { showSuccess: true }).then(res => {
      if (res.code === 0) {
        actionRef.current.reload();
        getUncheckableItemValues();
        document.querySelector('.tips').click()
      }
    })
  }

  useEffect(() => {
    getUncheckableItemValues();
  }, [])

  const onsubmit = (values,selectedRows) => {
    const arr=selectedRows.map(ele=>({
      provinceId:ele.provinceId,
      cityId:ele.cityId,
      regionId:ele.regionId,
      deposit:values.deposit
    }))
    const params={
      deposit_list:arr
    }
    editApplicableAreaDeposit(params).then(res=>{
      if(res.code==0){
        message.success('配置成功')
        actionRef.current.reload()
      }
    })
  }
  const checkConfirm = (rule, value, callback) => {
    return new Promise(async (resolve, reject) => {
      if (value&&value<0||value>1000000){
        await reject('只能输入0-100万之间数字')
      }else if (value&&!/^[0-9]+(\.[0-9]{2})?$/.test(value)) {
        await reject('输入0-100万之间数字,保留2位小数')
      } else {
        await resolve()
      }
    })
  }

  return (
    <>
      <div style={{ backgroundColor: '#fff', padding: 30 }}>
        <AddressMultiCascader
          style={{ width: 130,marginLeft:'30px' }}
          value={selectKeys}
          placeholder="添加地区"
          renderValue={() => <span style={{ color: '#8e8e93' }}>添加地区</span>}
          renderExtraFooter={() => <div style={{ padding: 10, textAlign: 'right' }}><Button type="primary" onClick={() => { setArea() }}>确定</Button></div>}
          onChange={setSelectKeys}
          disabledItemValues={disabledItemValues}
          onClose={() => { setSelectKeys([]) }}
        />
      </div>
      <EditableProTable
        rowKey="regionId"
        options={false}
        actionRef={actionRef}
        formRef={formRef}
        request={getApplicableArea}
        recordCreatorProps={false}
        scroll={{ x: 'max-content', scrollToFirstRowOnChange: true, }}
        toolBarRender={() => <div className="tips">{tips}</div>}
        search={{
          defaultCollapsed: true,
          optionRender: (searchConfig, formProps, dom) => [
            ...dom.reverse(),
          ],
        }}
        columns={columns}
        pagination={{
          pageSize: 10,
        }}
        editable={{
          type: 'multiple',
          editableKeys,
          onSave: async (rowKey, data, row) => {
            console.log(rowKey, data, row);
            await waitTime(2000);
          },
          onChange: setEditableRowKeys,
        }}
        postData={postData}
        rowSelection={{}}
        tableAlertRender={({ selectedRowKeys, selectedRows, onCleanSelected }) => (
          <Space size={24}>
            <span>
            <InfoCircleFilled  style={{color:'#108EE9'}}/> 已选 {selectedRowKeys.length} 项
            </span>
            <ProForm
              form={form}
              {...formItemLayout}
              formRef={ref}
              submitter={false}
              onFinish={async (values) => {
                  await onsubmit(values,selectedRows);
                  onCleanSelected()
                  return true;
              }
              }
            >
              <Space>
              <ProFormText
                width="md"
                name="deposit"
                label="设置入驻保证金为"
                placeholder="0-100万之间数字，保留2位小数"
                labelCol={5}
                fieldProps={{
                  addonAfter:'元'
                }}
                rules={[{ validator: checkConfirm }]}
              />
              <Form.Item>
                <Button type="primary" onClick={()=>{
                    ref?.current.submit()
                  }}>
                    确定
                </Button>
              </Form.Item>
              </Space>
            </ProForm >
          </Space>
        )}
      />
      {
        visible&&<AmendModel
        earnestMoney={earnestMoney}
        setVisible={setVisible}
        visible={visible}
        callback={()=>{ actionRef.current.reload(); setEditableRowKeys([]);setEarnestMoney(null) }}
        onClose={()=>{ actionRef.current.reload(); setEditableRowKeys([]);setEarnestMoney(null) }}
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
          style={{backgroundColor:"#fff",padding:'25px'}}
          onChange={(val)=>{
            setSeleType(val)
          }}
        >
          <TabPane tab="开店区域和保证金" key="1">
            {
              seleType==1&&<ShopArea/>
            }
          </TabPane>
          <TabPane tab="服务费" key="2">
            {
              seleType==2&&<ServiceCharge/>
            }
          </TabPane>
          <TabPane tab="绿色通道缴费" key="3">
            {
              seleType==3&&<Handicapped/>
            }
          </TabPane>
        </Tabs>
        {/* <div style={{ backgroundColor: '#fff', padding: 30, display: 'flex' }}>
          设置后立即生效，只对生效后新申请的店铺有效！
        </div> */}
      </PageContainer>
  )
}
