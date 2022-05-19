import React, { useState, useEffect,useRef } from 'react';
import { getDetailById } from '@/services/community-management/adsense-get-detail-byid';
import { saveAdsense } from '@/services/community-management/adsense-save-adsense';
import { findAdsensePositionList } from '@/services/community-management/adsense-position-list';
import { productList } from '@/services/intensive-activity-management/intensive-activity-create'
import ProForm, { ProFormText,ProFormRadio,ProFormSelect} from '@ant-design/pro-form';
import { history } from 'umi';
import SelectProductModal from '@/components/select-product-modal'
import { message, Form,Button } from 'antd';
import ProTable from '@ant-design/pro-table';
import { PlusOutlined } from '@ant-design/icons';
import Upload from '@/components/upload';

export default props => {
 const id = props.location.query.id
 const [onselect,setOnselect]=useState([])
 const [position,setPosition]=useState()
 const [visible, setVisible] = useState(false);
 const [goods,setGoods]=useState()
 const [linkData,setLinkData]=useState()
 const [editLinkData,setEditLinkData]=useState()
 const [form] = Form.useForm()
 useEffect(()=>{
   if(id){
    getDetailById({id}).then(res=>{
      res.data.images=res.data.images?.[0]
      form.setFieldsValue(res.data)
      setLinkData(res.data)
      productList({}).then(lis=>{
        lis.data.map(ele=>{
          if(ele.id==res.data.linkId){
            setEditLinkData([ele])
          }
        })
      })
    })
  
   }
   findAdsensePositionList({}).then(res=>{
    setOnselect(res.data.map(ele=>(
        {label:ele.title,value:ele.id}
        )))
    })
 },[])
 const Termination=()=>{
    setVisible(true)
  }
 const deleGoods=()=>{
  setGoods([])
 }
 const columns=[
  {
    title: '商品图片',
    dataIndex: 'imageUrl',
    valueType: 'image',
  },
  {
    title: '商品名称',
    dataIndex: 'goodsName',
  },
  {
    title: '操作',
    render:(_, data)=>[
      <a onClick={()=>deleGoods()}>删除</a>
    ],
    ellipsis:true
  },
]
  //标题验证规则
  const checkConfirm=(rule, value, callback)=>{
    return new Promise(async (resolve, reject) => {
    if (value&&value.length > 20) {
          await reject('标题名称不超过20个字符')
      }
      else if (/[%&',;=?$\x22]/.test(value)) {
          await reject('标题不可以含特殊字符')
      } 
      else {
          await resolve()
      }
    })
  }
  //排序验证规则
  const sortConfirm=(rule, value, callback)=>{
    return new Promise(async (resolve, reject) => {
    if (parseInt(value)<=0||parseInt(value)>100) {
          await reject('序号只能为1-100')
      }
      else {
          await resolve()
      }
    })
  }
  return (
    <ProForm
        onFinish={async (values) => {
          if(id){
            values.id=id
          }
          values.linkId=goods.length?goods[0].id:null
          saveAdsense(values).then(res=>{
            if(res.code==0){
              history.push('/community-management/community-advertising')
              message.success('提交成功');
            }
          })
        }}
        form={form}
        params={{}}
        style={{ background:'#fff',padding:'30px' }}
        submitter={{
          // 完全自定义整个区域
          render: (props, doms) => {
            return [
              <Button type="primary" key="submit" onClick={() => props.form?.submit?.()}>
                保存
              </Button>,
              <Button type="default" onClick={() => { window.history.back(); setTimeout(() => { window.location.reload(); }, 200) }}>
                返回
              </Button>,
              
            ];
          }
        }}
      >
         <ProFormText
            width="md"
            name="title"
            label="广告标题"
            tooltip="最多20个字符"
            placeholder="请输入广告标题"
            rules={[
              { required: true, message: '请输入标题' },
              { validator: checkConfirm}
            ]}
        />
         <ProFormSelect
            name="position"
            width="md"
            label="广告位置"
            options = {onselect}
            placeholder="请选择广告位置"
            rules={[
              { required: true, message: '请选择广告位置' },
            ]}
        />
        <Form.Item  rules={[{ required: true, message: '请上传图片' }]} label="上传图片" name="images">
            <Upload code={204} multiple maxCount={1} accept="image/*"/>
        </Form.Item>
        <ProFormRadio.Group
            name="linkType"
            label="链接类型"
            rules={[
              { required: true, message: '请选择链接类型' },
            ]}
            fieldProps={{
              onChange: (e) => setPosition(e.target.value),
            }}
            options={[
                {
                  label: 'URL链接',
                  value: 1
                },
                {
                  label: '商品链接',
                  value: 2
                },
                {
                  label: '无链接',
                  value: 3
                },
            ]}
        />
          {
            position=='1'||linkData?.url?
           <div style={{display:position==2||position==3?'none':'block'}}>
              <ProFormText
                width="md"
                name="url"
              />
           </div>
            :null
          }
          {
            position=='2'||linkData?.linkId?
            <div style={{display:position==1||position==3?'none':'block'}}>
              <Button type="primary" onClick={Termination} style={{margin:'0 0 20px 20px'}}>
                  <PlusOutlined />
                  添加商品
              </Button>
              <SelectProductModal 
                title={'添加商品'}  
                visible={visible} 
                setVisible={setVisible} 
                callback={(v) => {
                  if (v.length>=2) {
                    message.error('只能选择一个商品');
                    return
                  }
                  setGoods(v)
                 }}
                 hideAll={true}
              />
              <ProTable
                rowKey="id"
                search={false}
                toolBarRender={false}
                columns={columns}
                dataSource={goods||editLinkData}
                style={{display:visible?'none':'block'}}
              />
            </div>
            :null
          }
        <ProFormRadio.Group
            name="state"
            label="状态"
            rules={[
              { required: true, message: '请选择状态' },
            ]}
            initialValue={1}
            options={[
                {
                  label: '禁用',
                  value: 0
                },
                {
                  label: '启用',
                  value: 1
                },
                
            ]}
        />
        <ProFormText
            width="md"
            name="order"
            rules={[
              { required: true, message: '请输入排名' },
              { validator: sortConfirm}
            ]}
            label="排序"
        />
        <p>备注：同一个广告位置，序号1-100，1为最前。</p>
      </ProForm>
  );
};
