import React, { useState,useEffect,useRef } from 'react';
import { miniCircleList } from '@/services/community-management/circle-admin-circle-list';
import { listSystemVirtualMember } from '@/services/community-management/memberinfo-list-system-virtual-member';
import ProForm, { ProFormTextArea,ProFormSelect} from '@ant-design/pro-form';
import { history } from 'umi';
import { message, Form,Button,Modal,Space,Image } from 'antd';
import { releaseDynamic } from '@/services/community-management/dynamic-release-dynamic';
import Upload from '@/components/upload';
import Assigngoodsmodel from './assign-goods-model'

export default props => {
  const [onselect,setOnselect]=useState([])
  const [virtual,setVirtual]=useState([])
  const actionRef = useRef();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading,setLoading]=useState(true)
  const [spuIdsArr,setSpuIdsArr]=useState([])
  //会员昵称下拉接口调用
  useEffect(()=>{
    miniCircleList({}).then(res=>{
          setOnselect(res.data.map(ele=>(
              {label:ele.name,value:ele.id}
          )))
      })
    listSystemVirtualMember({}).then(res=>{
        setVirtual(res.data.map(ele=>(
            {label:ele.nickName,value:ele.id}
        )))
    })
  },[])
  const tailLayout = {
    wrapperCol: { offset: 1, span: 16 },
  };
  const showModal = () => {
    setIsModalVisible(true);
    setLoading(true)
  };
  return (
    <Form
        onFinish={async (values) => {
          if(spuIdsArr.length>0){
            values.sourceData={
              icon:spuIdsArr[0]?.goodsImageUrl,
              title:spuIdsArr[0]?.goodsName,
              amount:spuIdsArr[0]?.goodsSaleMinPrice,
              subtitle:'',
              params:{
                orderType:2,
                spuId:spuIdsArr[0]?.spuId,
                objectId:'',
                activityId:'',
                wsId:''
              }
            }
            values.sourceType=spuIdsArr.length>0?1:0
            values.sourceId=spuIdsArr[0]?.spuId
          } 
          releaseDynamic(values).then(res=>{
            if(res.code==0){
              message.success('发布成功');
              history.push('/community-management/content-management')
            }
          })
        }}
        style={{ padding:'50px',background:'#fff' }}
      >
         <ProFormSelect
            width="md"
            name="userId"
            label="会员昵称"
            options={virtual}
            placeholder="请选择会员昵称"
            rules={[{ required: true, message: '请选择会员昵称' }]}
        />
         <ProFormSelect
            width="md"
            name="circleId"
            label="发布圈子"
            options = {onselect}
            placeholder="请选择发布圈子"
            rules={[{ required: true, message: '请选择发布圈子' }]}
        />
        <ProFormTextArea
            width="md"
            name="content"
            label="分享想法"
            placeholder="用户可编辑500个字。"
            rules={[
              { required: true, message: '请输入分享想法' },
              { validator:(rule,value,callback)=>{
                return new Promise(async (resolve, reject) => {
                if(value&&value.length>500){
                  await reject('最多500个字')
                }else {
                  await resolve()
              }
              })
              }}
            ]}
        />
        <Form.Item label="添加照片" name="images">
         <Upload code={204} multiple maxCount={100} accept="image/*"/>
        </Form.Item>
        <Form.Item label="添加商品">
          <Button type="primary"  onClick={showModal}>
              选择商品
          </Button>
          <Assigngoodsmodel 
            isModalVisible={isModalVisible} 
            setIsModalVisible={setIsModalVisible} 
            actionRef={actionRef}
            callback={(Rows)=>{
              setSpuIdsArr(Rows)
            }}
            loading={loading}
            setLoading={setLoading}
          />
        </Form.Item>
        <Form.Item {...tailLayout} style={{marginTop:'120px'}}>
          <Button type="primary" htmlType="submit">
            保存
          </Button>
        <Button style={{ marginLeft: '20px' }} type="default" onClick={() => { window.history.back(); setTimeout(() => { window.location.reload(); }, 200) }}>
            返回
          </Button>
      </Form.Item>
      </Form>
  );
};
