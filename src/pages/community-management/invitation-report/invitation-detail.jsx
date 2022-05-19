import React, { useState,useEffect } from 'react';
import { getDynamicDetail } from '@/services/community-management/dynamic-get-dynamic-detail';
import { Form, Spin,Image,Button } from 'antd';
import { ModalForm} from '@ant-design/pro-form';
import moment from 'moment';


export default props => {
  const { id }=props
  const [detailData,setDetailData]=useState([])
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
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
  const Termination=()=>{
    setVisible(true)
    setLoading(true);
    getDynamicDetail({id}).then(res=>{
      setDetailData(res.data)
    }).finally(() => {
      setLoading(false);
    })
  }

  return (
    <>
      <ModalForm
        title="帖子详情"
        key="1"
        onVisibleChange={setVisible}
        visible={visible}
        submitter={{
          render: (props, defaultDoms) => {
              return [
                <Button onClick={()=>setVisible(false)}>返回</Button>
              ];
          },
          }}
        {...formItemLayout}
        trigger={<Button style={{marginRight:'10px'}} onClick={()=>Termination()}>预览</Button>}
      >
        <Spin
          spinning={loading}
        >
        
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
            </Form.Item>
            <Form.Item
              label="商品快照"
            >
              {
                detailData.images?.map(ele=>(
                  <Image style={{margin:'10px'}} width={100} height={100} src={ele} alt="" />
                ))
              }
            </Form.Item>  
        </Spin> 
      </ModalForm>
    </>
  );
};
