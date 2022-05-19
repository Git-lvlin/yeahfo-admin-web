import React, { useEffect, useState,useRef} from 'react';
import { ModalForm,ProFormTextArea} from '@ant-design/pro-form';
import { Button, message,Typography,Descriptions, Space,Image,List,Avatar } from 'antd';
import { feedbackReply,feedbackDetail} from '@/services/user-management/user-feedback';
import { history,connect } from 'umi';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { amountTransform } from '@/utils/utils'
import styles from './style.less'
const { Title } = Typography;

export default props=>{
    const {detailId,visible,setVisible,canBlack,onClose}=props
    const [detailData, setDetailData] = useState()
    const [replySuc,setReplySuc]=useState(0)
    const formRef = useRef();
    useEffect(()=>{
      feedbackDetail({id:detailId}).then(res=>{
        if(res.code==0){
          setDetailData(res.data)
        }
      })
    },[replySuc])
    return (
        <ModalForm
          title='用户反馈详情'
          key={detailId}
          onVisibleChange={setVisible}
          visible={visible}
          formRef={formRef}
          width={1200}
          modalProps={{
            forceRender: true,
            destroyOnClose: true,
            onCancel: () => {
              onClose();
            }
          }}
          submitter={{
          render: (props, defaultDoms) => {
            if(detailData?.replies.length==0){
              return [
                <Button  type="primary" key="submit" onClick={() => {
                    props.form?.submit?.()
                  }}>
                    回复
                </Button>
                ];
            }

          },
          }}
          onFinish={async (values) => {
            feedbackReply({feedBackId:detailId,...values}).then(res=>{
            if(res.code==0){
              setReplySuc(1)
              formRef?.current.resetFields()
              message.success('操作成功')
              return true;
            }
          })
          }}
          className={styles.detail_model}
      >
        <p><Image src={detailData?.createIcon} height={50} width={50} />&nbsp;&nbsp;{detailData?.createName} &nbsp;&nbsp;{detailData?.createTime}</p>
          <Descriptions style={{ flex: 1 }}>
            <Descriptions.Item label="联系手机">{detailData?.mobile}</Descriptions.Item>
            <Descriptions.Item label="问题类型">
              <Space>{detailData?.parentType} <span style={{color:'red'}}>[{detailData?.type}]</span></Space>
            </Descriptions.Item>
            <Descriptions.Item label="系统和型号">
              {detailData?.system}&nbsp;&nbsp;{detailData?.model}
            </Descriptions.Item>
            <Descriptions.Item label="APP版本">{detailData?.version}</Descriptions.Item>
            <Descriptions.Item label="状态">
            {{0: <span style={{color:'red'}}>进行中</span>,1: <span style={{color:'#999999'}}>已处理</span>}[detailData?.status]}
            </Descriptions.Item>
          </Descriptions>
          <p style={{wordWrap:'break-word'}}>反馈内容：{detailData?.content}</p>
          <List
            grid={{
              gutter: 16,
            }}
            dataSource={detailData?.imgs}
            renderItem={item => (
              <List.Item>
                <Image width={100} height={100} src={item}/>
              </List.Item>
            )}
          />
          <Descriptions style={{ flex: 1 }}>
            <Descriptions.Item label="关联订单号">
              {detailData?.orderInfo?.orderSn}
            </Descriptions.Item>
          </Descriptions>
          <List
            itemLayout="horizontal"
            dataSource={detailData?.orderInfo?.goodsInfo}
            renderItem={item => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar src={item?.skuImageUrl} />}
                  title={<p>{item?.goodsName}</p>}
                  description={<Space><span style={{color:'red'}}>￥{amountTransform(detailData?.orderInfo?.payAmount, '/').toFixed(2)}</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span>{detailData?.orderInfo?.payTime}</span></Space>}
                />
              </List.Item>
            )}
          />
          {
            detailData?.replies.length==0&&<>
              <p>回复：</p>
              <ProFormTextArea 
                name="content" 
                rules={[{ required: true, message: '请输入回复内容' }]}
                fieldProps={{
                  maxLength:500,
                  showCount:true
                }} 
              />
            </>
          }
          {
            detailData?.replies.length>0&&<List
            header={<div></div>}
            dataSource={detailData?.replies}
            renderItem={item => (
              <List.Item
                style={{display:'block'}}
              >
                <List.Item.Meta
                  title={
                  <p style={{wordWrap:'break-word'}}>
                    客服回复：
                    {item?.content}
                  </p>
                  }
                  description={<Space><span>回复人：{item?.createName}</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span>回复时间：{item?.createTime}</span></Space>}
                />
                
              </List.Item>
            )}
          />
          }
      </ModalForm>
    )
}

