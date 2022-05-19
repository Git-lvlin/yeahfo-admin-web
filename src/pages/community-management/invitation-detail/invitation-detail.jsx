import React, { useState,useEffect,useRef } from 'react';
import { getDynamicDetail,findAdminCommentList,insertComment,insertReply } from '@/services/community-management/dynamic-get-dynamic-detail';
import { Divider, Form, Spin,Button,Image,Menu, Dropdown,Space,List, Avatar,message } from 'antd';
import moment from 'moment';
import { CaretRightFilled } from '@ant-design/icons';
import styles from './style.less'
import ReplyModel from './reply-model'
import { circleHide } from '@/services/community-management/circle-hide';
import { circleTop } from '@/services/community-management/circle-top';

const formItemLayout = {
  labelCol: { span: 2 },
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

export default props => {
  const id=props.location.query.id
  const [form] = Form.useForm()
  const [detailData,setDetailData]=useState([])
  const [loading, setLoading] = useState(false);
  const [listData,setListData] =useState([])
  const commentList=[]

  listData.length>0&&listData.map(ele=>{
    commentList.push({
      href: ele.userHeadUrl,
      title: ele.userName,
      avatar: ele.userHeadUrl,
      description:moment(Number(ele.createTime)).format('YYYY-MM-DD HH:mm:ss'),
      content:ele.content,
      replys:ele.replys,
      dynamicCommentId:ele.id,
      ...ele
    });
  })
  
  useEffect(()=>{
    getDynamicDetail({id}).then(res=>{
      setDetailData(res.data)
    })
    findAdminCommentList({dynamicId:id}).then(res=>{
      setListData(res.data)
    })
  },[loading])
  const oncircleTop=()=>{
    circleTop({id}).then(res=>{
      if(res.code==0){
        message.success('置顶成功')
        return true;
    }
    })
  }
  const oncircleHide=()=>{
    circleHide({id}).then(res=>{
      if(res.code==0){
        message.success('隐藏成功')
        return true;
    }
  })
  }

  const menu = (
    <Menu>
      <Menu.Item>
          <ReplyModel 
            dynamicId={id}
            label={'发布评论'}  
            InterFace={insertComment} 
            canback={(e)=>{
              setLoading(e)
            }}
          />
      </Menu.Item>
      <Menu.Item>
          <p  onClick={()=>oncircleTop()}>置顶</p>
      </Menu.Item>
      <Menu.Item>
          <p  onClick={()=>oncircleHide()}>隐藏帖子</p>
      </Menu.Item>
    </Menu>
  );

  return (
    <>
    <Spin spinning={loading}>
        <Form
          form={form}
          {...formItemLayout}
          className={styles.detailform}
        >
           <h2 className={styles.invitation_head}><CaretRightFilled /> 帖子详情</h2>
           <Dropdown overlay={menu} placement="bottomCenter" arrow>
            <Button style={{marginLeft:'60%'}} type='primary'>帖子管理</Button>
          </Dropdown>
          <Form.Item
            label="内容ID"
          >
            {detailData.id}
          </Form.Item>

          <Form.Item
            label="发布时间"
          >
            {moment(Number(detailData.createTime)).format('YYYY-MM-DD HH:mm:ss')}
          </Form.Item>

          <Form.Item
            label="定位"
          >
            {detailData.address}
          </Form.Item>

          <Form.Item
              label="内容"
            >
              {detailData.content}
              <div className={styles.invitation_content}>
                {
                  detailData.images?.map((ele,index)=>(
                    <Image key={index} className={styles.detailimg}  width={100} height={100} src={ele} alt="" />
                  ))
                }
              </div>
              <div className={styles.commodity} style={{ display:detailData.sourceData?'block':'none'}}>
              <Space>
                <Image width={100} src={detailData.sourceData&&detailData.sourceData.icon} />
                <div>
                <p>{detailData.sourceData&&detailData.sourceData.title}</p>
                {/* <p>{detailData.sourceData.specName}</p> */}
                <p>￥ {detailData.sourceData&&detailData.sourceData.amount}</p>
                </div>
              </Space>
            </div>
            <hr className={styles.boundary}/>
            <p className={styles.comment_sum}>共（{listData&&listData.length}）条评论</p>
            <List
              itemLayout="vertical"
              size="large"
              pagination={{
                onChange: page => {
                  console.log(page);
                },
                pageSize: 3,
              }}
              dataSource={commentList}
              renderItem={item => {
                return <List.Item
                key={item.dynamicCommentId}
                actions={[  
                  <ReplyModel 
                    dynamicCommentId={item.dynamicCommentId}
                    // parentId={}
                    label={'回复'}  
                    InterFace={insertReply} 
                    canback={(e)=>{
                      setLoading(e)
                    }}
                    key='reply'
                  />
                ]}
              >
              <List.Item.Meta
                  avatar={<Avatar src={item.avatar} />}
                  title={<a href={item.href}>{item.title}</a>}
                  description={item.description}
                />
                <Space className={styles.post_content}>
                    {item.content}
                </Space>
                <div className={styles.reply} style={{display:item.replys.length>0?'block':'none'}}>
                      {
                        item.replys.length>0&&item.replys.map((ele,index)=>(
                          <div key={index} style={{display:'flex'}}>
                            <p>{ele.userName}{ele.beUserName?<><span style={{color:'#ccc'}}> 回复 </span>${ele.beUserName} ：</>:' ： '}</p>
                            <p>{ele.content}</p>
                          </div>
                        ))
                      }
                </div>
              </List.Item>
              }}
            />
          </Form.Item>     
        </Form>
        </Spin>
    </>
  );
};
