import React, { useState, useRef,useEffect } from 'react';
import { Button,Tabs,Image,Form,Modal,Select,Checkbox,message, Space} from 'antd';
import ProTable from '@ant-design/pro-table';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import AddressMultiCascader from '@/components/address-multi-cascader'
import { latedeliveryAreaIndex,addLateDeliveryDesc,addLatedeliveryArea,updateLatedeliveryAreaStatus } from '@/services/setting/shipments-area-configuration'
import { PageContainer } from '@/components/PageContainer';
import ProForm, { ProFormText, ProFormRadio,ProFormDependency } from '@ant-design/pro-form';
import { history,connect } from 'umi';
import DeleModel from './dele-model'


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

export default () => {
    const ref=useRef()
    const formRef=useRef()
    const [tips, setTips] = useState('');
    const [selectKeys, setSelectKeys] = useState([]);
    const [visible, setVisible] = useState(false)
    const [form] = Form.useForm();
    const [position,setPosition]=useState()
    const [cityData,setCityData]=useState()
    const [checkAll,setCheckAll]=useState()
    const [disabledItemValues, setDisabledItemValues] = useState([]);
    const getAreaData = (v) => {
      const arr = [];
      v?.forEach?.(item => {
        let deep = 0;
        let node = window.yeahgo_area.find(it => it.id === item);
        const nodeIds = [node.id];
        const nodeNames = [node.name]
        while (node.pid) {
          deep += 1;
          node = window.yeahgo_area.find(it => it.id === node.pid);
          nodeIds.push(node.id);
          nodeNames.push(node.name);
        }
        arr.push({
          provinceId: nodeIds[deep],
          cityId: deep > 0 ? nodeIds[deep - 1] : 0,
          districtId: deep > 1 ? nodeIds[deep - 2] : 0,
          areaName: nodeNames.reverse().join('|')
        })
      })
    
      return arr;
    }
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
        while (node.pid) {//?????????
          deep += 1;
          node = window.yeahgo_area.find(it => it.id === node.pid);
          nodeIds.push(node.id);
          nodeNames.push(node.name);
        }
        arr.push({
          provinceId: nodeIds[deep],
          cityId: deep > 0 ? nodeIds[deep - 1] : 0,
          districtId: deep > 1 ? nodeIds[deep - 2] : 0,
          areaName: nodeNames.reverse().join('|')
        })
      })
    if(brr.length){
      return getAreaData(brr)
    }else{
      return arr;
    }

    }
    const columns= [
      {
        title: '??????',
        dataIndex: 'provinceName',
        valueType: 'text',
        hideInSearch: true,
      },
      {
        title: '??????',
        dataIndex: 'cityName',
        valueType: 'text',
        hideInSearch: true,
      },
      {
        title: '??????/??????',
        dataIndex: 'districtName',
        valueType: 'text',
        hideInSearch: true,
      },
      {
        title: '??????',
        dataIndex: 'status',
        valueType: 'text',
        render: (_) => {
          return <span style={{ color: _ === 1 ? 'green' : 'red' }}>{_ === 1 ? '?????????' : '?????????'}</span>
        },
        hideInSearch: true,
      },
      {
        title: '??????',
        dataIndex: 'status',
        valueType: 'select',
        valueEnum: {
          '1': '??????',
          '2': '??????'
        },
        hideInTable: true,
      },
      {
        title: '??????',
        valueType: 'option',
        render: (_, data) => [
          <a key='status' onClick={() => { changeStatus(data) }}>{data.status === 1 ? '??????' : '??????'}</a>,
          <a key='delete' onClick={() => { deleteArea(data) }}>??????</a>
        ]
      }, 
    ];
    const deleteArea = (data) => {
      setVisible(true)
      setCityData(data)
    }
    const changeStatus = (data) => {
      updateLatedeliveryAreaStatus({
          type: data.status === 1 ? 2 : 1,
          id: data.id,
        }, { showSuccess: true })
          .then(res => {
            if (res.code === 0) {
                ref.current.reload();
            }
          })
      }
    const getUncheckableItemValues = () => {
        latedeliveryAreaIndex({
          page: 1,
          pageSize: 9999,
        }).then(res => {
          const keys = res.data.records.map(item => item.districtId)
          setDisabledItemValues(keys)
        })
      }
    const setArea = () => {
        if (selectKeys.length === 0) {
          message.error('???????????????????????????')
          return;
        }
        addLatedeliveryArea({
          lateDeliveryArea: getAreaDatas(selectKeys),
          type:1
        }, { showSuccess: true }).then(res => {
          if (res.code === 0) {
            ref.current.reload();
            getUncheckableItemValues();
            document.querySelector('.tips').click()
          }
        })
      }
    const onsubmit = (values) => {
        addLateDeliveryDesc({lateDeliveryDesc:values.lateDeliveryDesc},{ showSuccess: true }).then(res=>{
          if (res.code === 0) {
            ref.current.reload();
          }
        })
    }
    const postData = (data) => {
      const tips=`??? ${data.provinceNum} ?????????   ${data.cityNum} ????????? ${data.districtNum} ?????????/??????  ?????????????????????/?????? ${data.openDistrictNum} ??? ???????????????/?????? ${data.closeDistrictNum} ???`
      setTips(tips)
      setCheckAll(data.isAll)
      form.setFieldsValue({
        isAll:data.isAll,
        lateDeliveryDesc:data.lateDeliveryDesc
      })
      return data.records;
    }
    useEffect(() => {
      getUncheckableItemValues();
    }, [])
    return (
      <PageContainer>
        <div style={{ backgroundColor: '#fff', padding: 30 }}>
            <h6>?????????????????????????????????????????????????????????</h6>
            <p style={{margin:'20px 0 0 0'}}>????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????</p> 
        </div>

        <ProForm
            name="configuration"
            form={form}
            formRef={formRef}
            onFinish={async (values) => {
                await onsubmit(values);
                return true;
            }}
            submitter={false}
            style={{background:'#fff',padding:"20px 0 20px 100px"}}
            {...formItemLayout}
            >
        <Space>
          <ProFormText
            width={1000}
            label="?????????????????????????????????"
            placeholder="??????????????????????????????????????????????????????????????????????????????????????????????????????????????????5-60?????????"
            name="lateDeliveryDesc"
            fieldProps={{
                minLength:5,
                maxLength: 60,
            }}
            labelCol={5}
          />
          <Form.Item>
            <Button type="primary" onClick={()=>{
              formRef?.current.submit()
            }}>
              ??????
            </Button>
          </Form.Item>
        </Space>
        <ProFormRadio.Group
          name="isAll"
          label="???????????????"
          options={[
          {
              label:"??????????????????",
              value: 0,
          },
          {
              label: "?????????????????????????????????????????????????????????",
              value: 1,
          },
          ]}
          labelCol={2}
          fieldProps={{
            onChange: (e) => {
              setPosition(e.target.value)
              if(e.target.value===1){
                addLatedeliveryArea({lateDeliveryArea:[],type:2}).then(res=>{
                  if(res.code==0){
                    ref.current.reload();
                  }
                })
              }else{
                addLatedeliveryArea({lateDeliveryArea:[],type:1}).then(res=>{
                  if(res.code==0){
                    ref.current.reload();
                  }
                })
              }
            },
            value:position
          }}
        />
        <Space style={{display:checkAll==1?'none':'block'}}>
            <AddressMultiCascader
                style={{ width: 130,marginLeft:'30px' }}
                value={selectKeys}
                placeholder="????????????"
                renderValue={() => <span style={{ color: '#8e8e93' }}>????????????</span>}
                renderExtraFooter={() => <div style={{ padding: 10, textAlign: 'right' }}><Button type="primary" onClick={() => { setArea() }}>??????</Button></div>}
                onChange={setSelectKeys}
                disabledItemValues={disabledItemValues}
                onClose={() => { setSelectKeys([]) }}
            />
            <ProTable
                actionRef={ref}
                rowKey="id"
                options={false}
                request={latedeliveryAreaIndex}
                toolBarRender={() => <div className="tips">{tips}</div>}
                search={false}
                columns={columns}
                postData={postData}
                scroll={{ x: 'max-content', scrollToFirstRowOnChange: true, }}
                pagination={{
                  pageSize: 10,
                  showQuickJumper: true,
                }}
            />
        </Space>
        </ProForm>
        {visible&&
          <DeleModel 
            visible={visible} 
            cityData={cityData}
            setVisible={setVisible}
            tabelRef={ref}
            canback={()=>getUncheckableItemValues()}
          />
        }
    </PageContainer>
    );
  };