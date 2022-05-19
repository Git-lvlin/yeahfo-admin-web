import React, {useState, useRef} from 'react'
import { PageContainer } from '@/components/PageContainer';
import ProTable from '@ant-design/pro-table'
import { PlusOutlined } from '@ant-design/icons'
import { customMessageList, customMessageDetail, customMessageAuditIm } from '@/services/message-management/message-template-config'
import { history } from 'umi'
import { Space, Button, Tooltip, Popconfirm, message } from 'antd'
import Edit from './edit'
import Detail from './detail'
import Audit from './audit'
import '../styles.less'

const Index = () => {
  const [formVisible, setFormVisible] = useState(false)
  const [visible, setVisible] = useState(false)
  const [detailData, setDetailData] = useState(null)
  const [auditVisible, setAuditVisible] = useState(false)
  const [id, setId] = useState('')
  const actionRef = useRef()

  const getDetail = id => {
    customMessageDetail({id}).then(res=> {
      if(res?.success){
        setDetailData({...res?.data})
        setFormVisible(true)
      }
    })
  }
  const handleOk = id =>{
    customMessageAuditIm({id}).then(res=>{
      if(res.success){
        actionRef.current.reload()
        message.success('推送成功')
        actionRef.current.reload()
      }
    })
  }
  const PopConfirm = props =>{
    const {id} = props
    return(
      <Popconfirm 
        title="确认现在将此消息推送出去么？" 
        cancelText="取消"
        okText="继续"
        onConfirm={()=>handleOk(id)}
      >
        <a>推送</a>
      </Popconfirm>
    )
  }
  const columns = [
    { 
      title: '编号',
      dataIndex: 'id',
      valueType: 'indexBorder', 
    },
    { 
      title: '消息名称',
      dataIndex: 'name', 
      align: 'center' 
    },
    { 
      title: '自定义类型',
      dataIndex: 'type',
      align: 'center',
      valueEnum: {
        1: '优惠促销',
        2: '内容推广',
        3: '系统公告'
      }, 
    },
    { 
      title: '消息模板-标题', 
      dataIndex: 'title', 
      align: 'center'
    },
    { 
      title: '消息模板-内容', 
      dataIndex: 'content',
      width: "20%",
      align: 'center' 
    },
    { 
      title: '推送渠道',
      dataIndex: 'pushType',
      valueEnum: {
        1: '站内信',
        2: '推送消息',
        3: '短信',
        4: '小程序'
      }, 
      align: 'center' 
    },
    { 
      title: '创建信息',
      dataIndex: 'createInfo',
      align: 'center',
      render: (_, data) => {
        return(
          <>
            <div>{data?.createInfo?.name}</div>
            <div>{data?.createInfo?.time}</div>
          </>
        )
      }
    },
    { 
      title: '审核信息',
      dataIndex: 'updateInfo',
      align: 'center',
      render: (_, data) => {
        return(
          <>
            <div>{data?.updateInfo?.name}</div>
            <div>{data?.updateInfo?.time}</div>
          </>
        )
      }
    },
    {
      title: '推送信息',
      dataIndex: 'pushInfo',
      align: 'center',
      render: (_, data) => {
        return(
          <>
            <div>{data?.pushInfo?.name}</div>
            <div>{data?.pushInfo?.time}</div>
          </>
        )
      }
    },
    {
      title: '状态',
      dataIndex: 'status',
      align: 'center',
      valueEnum: {
        0: '草稿中',
        1: '待审核',
        2: '待推送',
        3: '已拒绝',
        4: '已发送',
        5: '发送失败'
      },
      render: (_, records) => {
        return (
          <div 
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
            <span>{_.props.valueEnum[records.status]}</span>
            {
              records.status === 3
              &&
              <Tooltip
                placement="top"
                title={records.remark}
              >
                <svg style={{marginLeft: 4}} viewBox="64 64 896 896" focusable="false" data-icon="question-circle" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"></path><path d="M623.6 316.7C593.6 290.4 554 276 512 276s-81.6 14.5-111.6 40.7C369.2 344 352 380.7 352 420v7.6c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V420c0-44.1 43.1-80 96-80s96 35.9 96 80c0 31.1-22 59.6-56.1 72.7-21.2 8.1-39.2 22.3-52.1 40.9-13.1 19-19.9 41.8-19.9 64.9V620c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8v-22.7a48.3 48.3 0 0130.9-44.8c59-22.7 97.1-74.7 97.1-132.5.1-39.3-17.1-76-48.3-103.3zM472 732a40 40 0 1080 0 40 40 0 10-80 0z"></path></svg>
              </Tooltip>
            }
          </div>
        )
      }
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      align: 'center',
      render: (_, data) => {
        return(
          <Space>
            { data.status == 1 && <a onClick={()=>{setAuditVisible(true); setId(data.id)}}>审核</a>}
            { data.status == 2 && <PopConfirm id={data?.id} />}
            { (data.status == 0 || data.status == 3) && <a onClick={()=>getDetail(data?.id)}>编辑</a>}
            <a onClick={()=>{setVisible(true); setId(data.id)}}>详情</a>
          </Space>
        )
      }
    }
  ]
  return (
    <PageContainer
      title={false}
    >
      <ProTable
        rowKey='id'
        options={false}
        columns={columns}
        actionRef={actionRef}
        request={ customMessageList }
        scroll={{ y: window.innerHeight - 400, scrollToFirstRowOnChange: true, }}
        pagination={{
          showQuickJumper: true,
          pageSize: 10,
        }}
        search={false}
        toolBarRender={() => [
          <Button onClick={ ()=>setFormVisible(true) } type="primary">
            <PlusOutlined/>
            新建
          </Button>
        ]}
      />
      { formVisible &&
        <Edit 
          visible={setFormVisible}
          detailData={detailData}
          callback={() => { 
            actionRef.current.reload()
            setDetailData(null) 
          }}
          onClose={() => {
            setDetailData(null)
            setFormVisible(false)
          }}
        />
      }
      { visible &&
        <Detail
          visible={visible}
          setVisible={setVisible}
          id={id}
        />
      }
      { auditVisible &&
        <Audit
          visible={auditVisible}
          setVisible={setAuditVisible}
          id={id}
          callback={() => { 
            actionRef.current.reload()
            setDetailData(null) 
          }}
        />
      }
    </PageContainer>
  )
}

export default Index
