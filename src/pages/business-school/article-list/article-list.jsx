
import React, { useRef, useState } from 'react';
import { Button, Space, message,Tabs,Image,Dropdown,Menu} from 'antd';
import ProTable from '@ant-design/pro-table';
import { PageContainer } from '@/components/PageContainer';
import Edit from './form';
import Video from './video'
import SetArriveHome from './set-arrive-home';
import { findAdminArticleList } from '@/services/business-school/find-admin-article-list';
import { findAdminArticleTypeList,articleTop,articleOperation } from '@/services/cms/member/member';
import { history,connect } from 'umi';
import { useEffect } from 'react';
import ShowHiddenTop from './show-hidden-top'
const { TabPane } = Tabs

const ArticleList = (props) => {
  const { type,articleTypeId }=props
  const actionRef = useRef();
  const [formVisible, setFormVisible] = useState(false);
  const [homeVisible, setHomeVisible] = useState(false);
  const [detailData, setDetailData] = useState(false)
  const [onselect,setOnselect]=useState([])
  const [showHideTop,setShowHideTop]=useState()
  const [visible, setVisible] = useState(false);

  const getDetail = (data) => {
    setDetailData(data);
    setFormVisible(true);
  }

  useEffect(()=>{
    findAdminArticleTypeList({}).then(res=>{
      const data={}
      res.data?.map(ele=>(
        data[ele.id]=ele.typeName
      ))
      setOnselect(data)
    })
      
  },[])
  const handleMenuClick = ({ key }, record) => {
    if (key === '1') {
      setShowHideTop({id:record.id,isTop:record.isTop,top:true})
      setVisible(true)
    }
    if (key === '2') {
      setShowHideTop({id:record.id,isShow:record.isShow,hide:true})
      setVisible(true)
    }

    if (key === '3') {
      getDetail({id:record.id,edit:true})
    }
  }

  const menu = (record) => (
    <Menu onClick={(e) => { handleMenuClick(e, record) }}>
      <Menu.Item key="1">{record.isTop?'取消置顶':'置顶'}</Menu.Item>
      <Menu.Item key="2">{record.isShow?'隐藏':'显示'}</Menu.Item>
      <Menu.Item key="3">编辑</Menu.Item>
    </Menu>
  )



  const columns = [
    {
      title: '标题',
      dataIndex: 'articleTitle',
      valueType: 'text',
      width:250,
      fieldProps: {
        minLength:4,
        maxLength:60
      },
    },
    {
      title: '店类型',
      dataIndex: 'storeType',
      valueType: 'select',
      valueEnum: {
        1: '全部',
        2: '社区店',
        3: '内部店',
        4: '直营店'
      },
      width:80
    },
    {
      title: '分类',
      dataIndex: 'articleTypeName',
      valueType: 'text',
      hideInTable: type==2?true:false,
      hideInSearch: true,
      width:130
    },
    {
      title: '分类',
      dataIndex: 'articleTypeId',
      valueType: 'select',
      hideInTable: true,
      hideInSearch: type==2?true:false,
      valueEnum:onselect
    },
    {
      title: '发布人昵称',
      dataIndex: 'authorNickName',
      valueType: 'text',
      width:130
    },
    {
      title: '封面图片',
      dataIndex: 'coverPicture',
      render: (text) => <Image src={text} width={50} height={50} />,
      search: false,
    },
    {
      title: '真实浏览量',
      dataIndex: 'clickNum',
      valueType: 'text',
      search: false,
    },
    {
      title: '虚拟浏览量',
      dataIndex: 'virtualClickNum',
      valueType: 'text',
      search: false,
    },
    {
      title: '创建信息',
      dataIndex: 'createId',
      valueType: 'number',
      search: false,
      render:(_,data)=>{
        return <>
               <p>{data.authorName}</p>
               <p>{data.createTime}</p>
              </>
      },
      width:150
    },
    {
      title: '置顶',
      dataIndex: 'isTop',
      valueType: 'select',
      valueEnum: {
        0: '未置顶',
        1: '已置顶',
      },
      width:80
    },
    {
      title: '状态',
      dataIndex: 'isShow',
      valueType: 'select',
      valueEnum: {
        0: '已隐藏',
        1: '已显示',
      },
      width:80
    },
    {
      title: '首页',
      dataIndex: 'isRecommend',
      valueType: 'text',
      search: false,
      valueEnum: {
        0: '否',
        1: '是',
      },
      hideInTable: type==2?true:false,
      hideInSearch: type==2?true:false,
    },
    {
      title: '吐槽数量',
      dataIndex: 'debunkNum',
      valueType: 'number',
      search: false,
      render:(text, record, _, action)=>[
        <a key='num' onClick={()=>history.push('/business-school/shopkeeper-disclose?articleId='+record.id+'&articleTitle='+record.articleTitle+'&type='+type)}>{record.debunkNum}</a>
      ],
    },
    {
      title: '操作',
      valueType: 'option',
      dataIndex: 'option',
      align: 'center',
      fixed: 'right',
      render: (text, record, _, action) => {
        return (
          <Space>
            <Dropdown.Button onClick={(e) => { getDetail({id:record.id,edtil:true}) }} overlay={() => { return menu(record) }}>详情</Dropdown.Button>
          </Space >

        )
      }
    },
  ];

  return (
    <>
    <ProTable
      rowKey="id"
      options={false}
      columns={columns}
      actionRef={actionRef}
      params={
        {
          articleType: type,
          TypeId:articleTypeId
        }
      }
      scroll={{ x: 'max-content', scrollToFirstRowOnChange: true, }}
      pagination={{
        pageSize: 10,
      }}
      request={findAdminArticleList}
      dateFormatter="string"
      toolBarRender={(_,record) => [
        <>
          {
            type==1&&<Button key="setup" type="primary" onClick={() => { setHomeVisible(true) }}>
                      设置到店铺管理页
                    </Button>
          }
        </>,
        <Button key="new" type="primary" onClick={() => { setFormVisible(true) }}>
          新建
        </Button>,
      ]}
    />
    {homeVisible && <SetArriveHome
      visible={homeVisible}
      setVisible={setHomeVisible}
      callback={() => { actionRef.current.reload(); setDetailData(null) }}
    />}
    {formVisible&&type==1 && <Edit
      visible={formVisible}
      setVisible={setFormVisible}
      detailData={detailData}
      callback={() => { actionRef.current.reload(); setDetailData(null) }}
      onClose={() => { actionRef.current.reload(); setDetailData(null) }}
    />}
    {formVisible&&type==2&& <Video
      visible={formVisible}
      setVisible={setFormVisible}
      detailData={detailData}
      callback={() => { actionRef.current.reload(); setDetailData(null) }}
      onClose={() => { actionRef.current.reload(); setDetailData(null) }}
    />}
    {
      showHideTop&&<ShowHiddenTop 
        boxref={actionRef} 
        showHideTop={showHideTop}
        setVisible={setVisible}
        visible={visible}
    />
    }
    </>
  );
};

export default (props) =>{
  const [seleType,setSeleType]=useState(1)
  const articleTypeId=props.location.query.articleTypeId
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
          <TabPane tab="图文文章" key="1">
            {
              seleType==1&&<ArticleList articleTypeId={articleTypeId} type={1} />
            }
          </TabPane>
          <TabPane tab="视频文章" key="2">
            {
              seleType==2&&<ArticleList type={2} />
            }
          </TabPane>
        </Tabs>
      </PageContainer>
  )
}