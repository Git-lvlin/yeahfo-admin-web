import React, { useState, useRef, useEffect } from 'react';
import ProTable from '@ant-design/pro-table';
import { PageContainer } from '@/components/PageContainer';
import AddressMultiCascader from '@/components/address-multi-cascader'
import AddressCascader from '@/components/address-cascader'
import { Button, message } from 'antd';
import { allowAreaList,allowAreaAdd } from '@/services/intensive-store-management/fresh-shop-configuration'
import StopModel from './stop-model'


const ShopArea = () => {
  const [tips, setTips] = useState('');
  const [selectKeys, setSelectKeys] = useState([]);
  const [disabledItemValues, setDisabledItemValues] = useState([]);
  const [visible, setVisible] = useState(false);
  const [formDetail , setFormDetail ] = useState()
  const actionRef = useRef();
  const formRef = useRef();

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
        provinceName: nodeNames[deep],
        cityId: deep > 0 ? nodeIds[deep - 1] : 0,
        cityName: deep > 0 ? nodeNames[deep - 1] : '',
        regionId: deep > 1 ? nodeIds[deep - 2] : 0,
        regionName: deep > 1 ? nodeNames[deep - 2] : '',
        status:'on'
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
        status:'on'
      })
    })
  if(brr.length){
    return getAreaData(brr)
  }else{
    return arr;
  }
}

  const columns = [
    {
      title: '省份',
      dataIndex: 'provinceName',
      valueType: 'text',
      hideInSearch: true
    },
    {
      title: '城市',
      dataIndex: 'cityName',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '地区/县城',
      dataIndex: 'regionName',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '所在地区',
      dataIndex: 'area',
      hideInTable: true,
      renderFormItem: () => (<AddressCascader changeOnSelect placeholder="请选择" />),
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueType: 'text',
      render: (_) => {
        return <span style={{ color: _ === 'on' ? 'green' : 'red' }}>{_ === 'on' ? '已启用' : '已禁用'}</span>
      },
      hideInSearch: true
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueType: 'select',
      valueEnum: {
        'on': '已启用',
        'off': '已禁用'
      },
      hideInTable: true,
    },
    {
      title: '操作',
      valueType: 'option',
      render: (_, data) => {
        return <a onClick={() => { setFormDetail(data);setVisible(true) }}>{data.status === 'on' ? '禁用' : '启用'}</a>
      }
    },
  ];

  const postData = (data) => {
    if (data.tips) {
      setTips(data.tips)
    }
    return data.records;
  }

  const getUncheckableItemValues = () => {
    allowAreaList({
      page: 1,
      pageSize: 9999,
    }).then(res => {
      const keys = res.data.records.map(item => item.regionId)
      setDisabledItemValues(keys)
    })
  }

  const setArea = () => {
    if (selectKeys.length === 0) {
      message.error('请选择要添加的区域')
      return;
    }
    allowAreaAdd({
      areas: getAreaDatas(selectKeys),
      append:true
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

  return (
    <PageContainer title='可申请为生鲜店铺的区域配置'>
      <div style={{ backgroundColor: '#fff', paddingTop: 30 }}>
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
      <ProTable
        rowKey="regionId"
        options={false}
        actionRef={actionRef}
        formRef={formRef}
        request={allowAreaList}
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
          showQuickJumper: true,
        }}
        postData={postData}
      />
      {visible && <StopModel
        visible={visible}
        setVisible={setVisible}
        formDetail={formDetail}
        callback={()=>{ actionRef.current.reload(); setFormDetail(null)}}
        onClose={() => { actionRef.current.reload(); setFormDetail(null) }}
      />}
    </PageContainer>
  );
};

export default ShopArea;
