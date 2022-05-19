import React, { useState, useRef} from 'react';
import { PageContainer } from '@/components/PageContainer';
import ProTable from '@ant-design/pro-table';
import { findAdsensePositionList } from '@/services/community-management/adsense-position-list';
import { Button,Form} from 'antd';
import AdvertisingModal from './advertising-modal'

export default props => {
const ref=useRef()
let id = props.location.query.id
const [visible, setVisible] = useState(false);
const [visible2, setVisible2] = useState(false);
const [form] = Form.useForm()
const [byid,setByid]=useState()
const Termination=(record)=>{
  setByid(record.id)
  setVisible(true)
}
const addPosition=()=>{
  setVisible2(true)
}
const columns= [
  {
      title: 'ID',
      dataIndex: 'id',
      hideInSearch:true
  },
  {
      title: '广告位名称',
      dataIndex: 'title',
      valueType: 'text',
      hideInSearch:true
  },
  {
      title: '状态',
      dataIndex: 'status',
      valueType: 'text',
      valueEnum:{
        "1":"启用",
        "0":"关闭",
      },
      hideInSearch:true
  },
  {
      title:'操作',
      valueType:'text',
      render:(text, record, _, action)=>[
        <Button key='edit' onClick={()=>Termination(record)}>编辑</Button>,
       
      ],
      hideInSearch:true
  }
];
  return (
      <PageContainer>
          <ProTable
            rowKey="id"
            options={false}
            params={{
              page:0,
              size:5,
              sourceId:id,
              status:1,
            }}
            scroll={{ y: window.innerHeight - 450, scrollToFirstRowOnChange: true, }}
            request={findAdsensePositionList}
            actionRef={ref}
            search={{
              optionRender:(searchConfig, formProps, dom) => [
              <Button type="primary" onClick={addPosition} key="refresh">
                添加
              </Button>,
              <AdvertisingModal key='add' title={'添加广告位'} visible={visible2} setVisible={setVisible2}  boxref={ref}/>
              ],
            }}
            toolBarRender={false}
            columns={columns}
          />
         <AdvertisingModal visible={visible} title={'编辑广告位'} setVisible={setVisible} byid={byid} form={form} boxref={ref}/>
    </PageContainer>
  );
};
