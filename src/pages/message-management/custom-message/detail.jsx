import React, { useEffect, useState } from 'react'
import ProForm, {
  ProFormSelect,
  ProFormText
} from '@ant-design/pro-form'
import { Button, Form, Image, Spin, Drawer } from 'antd'
import { customMessageDetail } from '@/services/message-management/message-template-config'
import { PageContainer } from '@/components/PageContainer';
import 'react-quill/dist/quill.snow.css'
import ReactQuill from 'react-quill'

import styles from './styles.less'

export default ({visible, setVisible, id}) => {
  const [form] = Form.useForm()
  const [data, setData] = useState({})
  const [showTab, setShowTab] = useState(1)
  const [linkType, setLinkType] = useState(1)
  const [loading, setLoading] = useState(false)

  const modules = {
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike'],  
        [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
        ['link'],
        [{ 'align': [] }],
        [{
          'background': ['rgb(  0,   0,   0)', 'rgb(230,   0,   0)', 'rgb(255, 153,   0)',
            'rgb(255, 255,   0)', 'rgb(  0, 138,   0)', 'rgb(  0, 102, 204)',
            'rgb(153,  51, 255)', 'rgb(255, 255, 255)', 'rgb(250, 204, 204)',
            'rgb(255, 235, 204)', 'rgb(255, 255, 204)', 'rgb(204, 232, 204)',
            'rgb(204, 224, 245)', 'rgb(235, 214, 255)', 'rgb(187, 187, 187)',
            'rgb(240, 102, 102)', 'rgb(255, 194, 102)', 'rgb(255, 255, 102)',
            'rgb(102, 185, 102)', 'rgb(102, 163, 224)', 'rgb(194, 133, 255)',
            'rgb(136, 136, 136)', 'rgb(161,   0,   0)', 'rgb(178, 107,   0)',
            'rgb(178, 178,   0)', 'rgb(  0,  97,   0)', 'rgb(  0,  71, 178)',
            'rgb(107,  36, 178)', 'rgb( 68,  68,  68)', 'rgb( 92,   0,   0)',
            'rgb(102,  61,   0)', 'rgb(102, 102,   0)', 'rgb(  0,  55,   0)',
            'rgb(  0,  41, 102)', 'rgb( 61,  20,  10)']
        }],
        [{
          'color': ['rgb(  0,   0,   0)', 'rgb(230,   0,   0)', 'rgb(255, 153,   0)',
            'rgb(255, 255,   0)', 'rgb(  0, 138,   0)', 'rgb(  0, 102, 204)',
            'rgb(153,  51, 255)', 'rgb(255, 255, 255)', 'rgb(250, 204, 204)',
            'rgb(255, 235, 204)', 'rgb(255, 255, 204)', 'rgb(204, 232, 204)',
            'rgb(204, 224, 245)', 'rgb(235, 214, 255)', 'rgb(187, 187, 187)',
            'rgb(240, 102, 102)', 'rgb(255, 194, 102)', 'rgb(255, 255, 102)',
            'rgb(102, 185, 102)', 'rgb(102, 163, 224)', 'rgb(194, 133, 255)',
            'rgb(136, 136, 136)', 'rgb(161,   0,   0)', 'rgb(178, 107,   0)',
            'rgb(178, 178,   0)', 'rgb(  0,  97,   0)', 'rgb(  0,  71, 178)',
            'rgb(107,  36, 178)', 'rgb( 68,  68,  68)', 'rgb( 92,   0,   0)',
            'rgb(102,  61,   0)', 'rgb(102, 102,   0)', 'rgb(  0,  55,   0)',
            'rgb(  0,  41, 102)', 'rgb( 61,  20,  10)']
        }],
        ['clean']
      ]
    }
  }
  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
    layout: {
      labelCol: {
        span: 4,
      },
      wrapperCol: {
        span: 14,
      },
    }
  }
  const DynamicProForm = () => {
    if(showTab == 1) {
      return (
        <>
          <ProFormSelect
            name="linkType"
            label="详情链接"
            width="md"
            valueType="select"
            valueEnum={{
              1: '优惠活动详情'
            }}
            readonly
          />
          <ProFormText
            name="link"
            label="活动网址"
            readonly
          />
        </>
      )
    } else if ( showTab == 2 ) {
      return (
        <>
          <ProFormText
            name="detailTitle"
            label="内容标题"
            readonly
          />
          <ProForm.Item
            label="内容图片"
            name="detailcCover"
          >
            <Image 
              width={80}
              height={80}
              src={data?.detail?.img}
            />
          </ProForm.Item>
          <ProForm.Item
            label='内容'
            name='detailContent'
            readonly
          >
            <ReactQuill
              theme='snow'
              modules={ modules }
            />
          </ProForm.Item>
        </>
      )
    } else if(showTab == 3) {
      return (
        <>
          <ProFormText
            name="detailTitle"
            label="公告标题"
            readonly
          />
          <ProForm.Item
            label="公告图片"
            name="detailcCover"
          >
            <Image 
              width={100} 
              height={100}
              src={data?.detail?.img}
            />
          </ProForm.Item>
          <ProForm.Item
            label='公告'
            readonly
            name='detailContent'
          >
            <ReactQuill
              theme='snow'
              modules={ modules }
            />
          </ProForm.Item>
        </>
      )
    }
  }

  useEffect(()=>{
    setLoading(true)
    customMessageDetail({id}).then(res=> {
      if(res.success){
        setData({...res.data})
        const {link, detail} = res.data
        form.setFieldsValue({
          ...res?.data,
          linkType: link?.type,
          link: link?.link,
          detailTitle: detail?.title,
          detailcCover: detail?.img,
          detailContent: detail?.content
        })
        setShowTab(res?.data?.type)
        setLinkType(link?.type)
      }
    }).finally(()=>{
      setLoading(false)
    })
  }, [])

  return (
    <Drawer
      visible={visible}
      onClose={()=>setVisible(false)}
      width={1200}
    >
      <Spin spinning={loading}>
        <ProForm
          className={styles.proForm}
          form={form}
          {...formItemLayout}
          submitter={false}
        >
          <ProFormText
            name="name"
            label="名称"
            readonly
            width="md"
          />
          <ProFormSelect
            name="type"
            label="自定义类型"
            width="md"
            valueType="select"
            valueEnum={{
              1: '优惠促销',
              2: '内容推广',
              3: '系统公告'
            }}
            readonly
          />
          <ProFormText
            name="title"
            label="标题"
            width="md"
            readonly
          />

          <ProFormText
            name="content"
            label="消息内容"
            width="md"
            readonly
          />
          <ProForm.Item
            name="cover"
            label="列表图片"
          >
            <Image 
              width={80}
              height={80}
              src={data?.cover}
            />
          </ProForm.Item>
          <ProFormSelect
            name="pushType"
            label="推送渠道"
            width="md"
            valueType="select"
            valueEnum={{
              1: '站内信',
              2: '推送消息',
              3: '短信',
              4: '小程序'
            }}
            readonly
          />
          <ProFormSelect
            name="targetType"
            label="适用会员"
            width="md"
            valueType="select"
            valueEnum={{
              2: '所有用户',
              3: '店主'
            }}
            readonly
          />
          <DynamicProForm />
        </ProForm>
      </Spin>
    </Drawer>
  )
}