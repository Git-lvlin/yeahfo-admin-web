import React, { useState, useRef,useEffect } from 'react';
import { Button,Tabs,Descriptions} from 'antd';
import ProTable from '@ant-design/pro-table';
import { PageContainer } from '@/components/PageContainer';
import { statInfo,inviteRankList,floorRankList,getActiveConfigList } from '@/services/activity-management/spring-festival-build-building-activity';
import Export from '@/pages/export-excel/export'
import ExportHistory from '@/pages/export-excel/export-history'
import UploadingList from './uploading-list'
import moment from 'moment'
const { TabPane } = Tabs



const InviteRegister=(props) => {
    const { canback } = props;
    const ref=useRef()
    const [onselect,setOnselect]=useState([])
    const [listVisible, setListVisible] = useState(false);
    const [visit, setVisit] = useState(false)
    const columns= [
      {
        title: '序号',
        dataIndex:'id',
        valueType: 'borderIndex',
        hideInSearch: true,
        valueType: 'indexBorder'
      },
      {
        title: '用户名',
        dataIndex: 'nickname',
        valueType: 'text',
      },
      {
        title: '用户手机号',
        dataIndex: 'phone',
        valueType: 'text',
      },
      {
        title: '活动时间',
        key: 'dateTimeRange',
        dataIndex: 'startTime',
        valueType: 'dateTimeRange',
        hideInTable: true,
      },
      {
        title: '活动时间',
        dataIndex: 'startTime',
        valueType: 'text',
        hideInSearch:true,
        render:(_,data)=>{
          return <p>{moment(data.startTime*1000).format('YYYY-MM-DD HH:mm:ss')} 至 {moment(data.endTime*1000).format('YYYY-MM-DD HH:mm:ss')}</p>
        }
      },
      {
        title: '活动名称',
        dataIndex: 'name',
        valueType: 'text',
        hideInSearch:true,
        ellipsis:'true'
      },
      {
        title: '活动名称',
        dataIndex: 'activityId',
        valueType: 'select',
        hideInTable: true,
        valueEnum:onselect
      },
      {
        title: '邀请用户注册数',
        dataIndex: 'inviteNums',
        valueType: 'text',
        hideInSearch:true,
      },
      {
        title: '邀请用户注册且游戏数',
        dataIndex: 'inviteGameNum',
        valueType: 'text',
        hideInSearch:true,
      },
      {
        title: '邀请总排名',
        dataIndex: 'rank',
        valueType: 'text',
        hideInSearch:true,
      },
      {
        title: '盖楼层数',
        dataIndex: 'floor',
        valueType: 'text',
        hideInSearch:true,
      }
    ];
    const postData=(data)=>{
      return data
    }
    useEffect(()=>{
      getActiveConfigList({page:1,size:100}).then(res=>{
        const obj={}
        res.data?.map(ele=>(
          obj[ele.id]={text:ele.name,status:ele.id}
        ))
        setOnselect(obj)
      })
    },[])
    const getFieldValue = (searchConfig) => {
      const {dateTimeRange,...rest}=searchConfig.form.getFieldsValue()
      return {
        startTime:dateTimeRange&&dateTimeRange[0],
        endTime:dateTimeRange&&dateTimeRange[1],
        ...rest,
      }
    }
    return (
      <>
        <ProTable
          actionRef={ref}
          rowKey="uni"
          options={false}
          request={inviteRankList}
          postData={postData}
          scroll={{ x: 'max-content', scrollToFirstRowOnChange: true, }}
          search={{
            defaultCollapsed: true,
            labelWidth: 100,
            optionRender: (searchConfig, formProps, dom) =>{
              const {activityId}=searchConfig.form.getFieldsValue()
              canback(activityId)
              return  [
                ...dom.reverse(),
                <Export
                 key='export'
                 change={(e) => { setVisit(e) }}
                 type={'build-floor-invite-list-export'}
                 conditions={()=>{return getFieldValue(searchConfig)}}
               />,
               <ExportHistory key='task' show={visit} setShow={setVisit} type={'build-floor-invite-list-export'}/>,
               <Button key='add' type="primary" onClick={()=>setListVisible(true)}>添加邀请用户排名</Button>
             ]
            }
          }}
          columns={columns}
          pagination={{
            pageSize: 10,
            showQuickJumper: true,
          }}
        />
         {listVisible&&<UploadingList 
            visible={listVisible} 
            setVisible={setListVisible}
            onClose={() => { ref.current.reload()}}
            callback={() => { ref.current.reload()}}
            />
          }
        </>
    );
  };


const BuildBuilding=(props) => {
    const { canback } = props;
    const ref=useRef()
    const [detailList,setDetailList]=useState()
    const [visit, setVisit] = useState(false)
    const [onselect,setOnselect]=useState([])
    const columns= [
      {
        title: '序号',
        dataIndex:'id',
        valueType: 'borderIndex',
        hideInSearch: true,
        valueType: 'indexBorder'
      },
      {
        title: '用户名',
        dataIndex: 'nickname',
        valueType: 'text',
      },
      {
        title: '用户手机号',
        dataIndex: 'phone',
        valueType: 'text',
      },
      {
        title: '活动时间',
        key: 'dateTimeRange',
        dataIndex: 'startTime',
        valueType: 'dateTimeRange',
        hideInTable: true,
      },
      {
        title: '活动时间',
        dataIndex: 'startTime',
        valueType: 'text',
        hideInSearch:true,
        render:(_,data)=>{
          return <p>{moment(data.startTime*1000).format('YYYY-MM-DD HH:mm:ss')} 至 {moment(data.endTime*1000).format('YYYY-MM-DD HH:mm:ss')}</p>
        }
      },
      {
        title: '活动名称',
        dataIndex: 'name',
        valueType: 'text',
        hideInSearch: true,
        ellipsis:'true'
      },
      {
        title: '活动名称',
        dataIndex: 'activityId',
        valueType: 'select',
        hideInTable: true,
        valueEnum:onselect
      },
      {
        title: '盖楼层数',
        dataIndex: 'floor',
        valueType: 'text',
        hideInSearch: true,
      },
      {
        title: '盖楼总排名',
        dataIndex: 'rank',
        valueType: 'text',
        hideInSearch: true,
      },
      {
        title: '邀请用户注册数',
        dataIndex: 'inviteNums',
        valueType: 'text',
        hideInSearch: true,
      },
      {
        title: '邀请用户注册且游戏',
        dataIndex: 'inviteGameNum',
        valueType: 'text',
        hideInSearch: true,
      }
    ];
    useEffect(()=>{
      getActiveConfigList({page:1,size:100}).then(res=>{
        const obj={}
        res.data?.map(ele=>(
          obj[ele.id]={text:ele.name,status:ele.id}
        ))
        setOnselect(obj)
      })
    },[])
    const postData=(data)=>{
      setDetailList(data)
      return data
    }
    const getFieldValue = (searchConfig) => {
      const {dateTimeRange,...rest}=searchConfig.form.getFieldsValue()
      return {
        startTime:dateTimeRange&&dateTimeRange[0],
        endTime:dateTimeRange&&dateTimeRange[1],
        ...rest,
      }
    }
    return (
        <ProTable
          actionRef={ref}
          rowKey="uni"
          options={false}
          request={floorRankList}
          postData={postData}
          search={{
            defaultCollapsed: true,
            labelWidth: 100,
            optionRender: (searchConfig, formProps, dom) =>{
              const {activityId}=searchConfig.form.getFieldsValue()
              canback(activityId)
              return [
                ...dom.reverse(),
                <Export
                 key='export'
                 change={(e) => { setVisit(e) }}
                 type={'build-floor-rank-list-export'}
                 conditions={()=>{return getFieldValue(searchConfig)}}
               />,
               <ExportHistory key='task' show={visit} setShow={setVisit} type={'build-floor-rank-list-export'}/>
             ]
            }
          }}
          columns={columns}
          pagination={{
            pageSize: 10,
            showQuickJumper: true,
          }}
        />
    );
  };

  export default (props) =>{
    const [seleType,setSeleType]=useState(1)
    const [detailList,setDetailList]=useState()
    const [searchName,setSearchName]=useState()
    useEffect(()=>{
        statInfo({activityId:searchName}).then(res=>{
            setDetailList(res.data)
        })
    },[searchName])
    return (
        <PageContainer>
        <div style={{backgroundColor:'#fff',marginBottom:'20px'}}>
            <Descriptions labelStyle={{fontWeight:'bold'}} column={10} layout="vertical" bordered>
                <Descriptions.Item  label="参与总人数">{detailList?.participationNums}  </Descriptions.Item>
                <Descriptions.Item  label="盖楼次数">{detailList?.buildHouseNums}  </Descriptions.Item>
                <Descriptions.Item  label="抽奖次数">{detailList?.drawNums}  </Descriptions.Item>
                <Descriptions.Item  label="已获奖人数">{detailList?.drawPrizeUsers}  </Descriptions.Item>
                <Descriptions.Item  label="已获奖次数">{detailList?.drawPrizeNums}  </Descriptions.Item>
                <Descriptions.Item  label="获奖总金额">{detailList?.totalPrizeAmount}  </Descriptions.Item>
                <Descriptions.Item  label="提现人数">{detailList?.withdrawUsers}  </Descriptions.Item>
                <Descriptions.Item  label="提现次数">{detailList?.withdrawNums}  </Descriptions.Item>
                <Descriptions.Item  label="注册人数">{detailList?.registerUsers}  </Descriptions.Item>
                <Descriptions.Item  label="注册且游戏人数">{detailList?.downloadUsers}  </Descriptions.Item>
            </Descriptions>
         </div>
          <Tabs
            centered
            defaultActiveKey="1"
            style={{backgroundColor:"#fff",padding:'25px'}}
            onChange={(val)=>{
              setSeleType(val)
            }}
          >
            <TabPane tab="邀请注册排名" key="1">
              {
                seleType==1&&<InviteRegister canback={(val)=>{
                  setSearchName(val)
                }}/>
              }
            </TabPane>
            <TabPane tab="盖楼排名" key="2">
              {
                seleType==2&&<BuildBuilding  canback={(val)=>{
                  setSearchName(val)
                }}/>
              }
            </TabPane>
          </Tabs>
        </PageContainer>
    )
  }