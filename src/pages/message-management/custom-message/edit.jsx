import React, { useState, useEffect } from 'react'
import ProForm,{
  DrawerForm,
  ProFormText,
  ProFormRadio,
  ProFormTextArea,
  ProFormSelect
} from '@ant-design/pro-form'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { Form, Button, message } from 'antd'

import { customMessageAdd, customMessageEdit } from '@/services/message-management/message-template-config'
import Upload from '@/components/upload'

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

const Edit = props => {
  const { visible, setVisible, callback, detailData, onClose } = props
  const [form] = Form.useForm()
  const [showTab, setShowTab] = useState(1)
  const [linkType, setLinkType] = useState(1)
  const apiMethods = detailData? customMessageEdit : customMessageAdd

  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
    layout: {
      labelCol: {
        span: 4
      },
      wrapperCol: {
        span: 14
      }
    }
  }
  const selectLink = e => {
    setLinkType(e.target.value)
  }
  const DynamicTab =() => {
    if(showTab == 1) {
      return (
        <>
          <ProFormRadio.Group
            name="linkType"
            label="详情链接"
            rules={[{ required: true, message: '请输入详情链接'}]}
            initialValue={linkType}
            fieldProps={{
              onChange: (e)=>{ selectLink(e) }
            }}
            options={[
              {
                label: '优惠活动详情',
                value: 1
              }
            ]}
          />
          <ProFormText
            name="link"
            label="活动网址"
            rules={[{ required: true, message: '请输入活动网址'}]}
          />
        </>
      )
    }else if( showTab == 2 ) {
      return (
        <>
          <ProFormText
            name="detailTitle"
            label="内容标题"
            placeholder="请输入内容标题"
            rules={[{ required: true, message: '请输入内容标题'}]}
            fieldProps={{
              maxLength: 18
            }}
          />
          <ProForm.Item
            label="内容图片"
            name="detailcCover"
            rules={[
              {
                required: true,
                message: '请上传内容图片'
              }
            ]}
            tooltip={
              <dl>
                <dt>图片要求</dt>
                <dd>1.图片大小2MB以内</dd>
                <dd>2.图片格式png/jpg/gif</dd>
              </dl>
            }
          >
            <Upload 
              code={304}
              multiple
              maxCount={1} 
              accept="image/*"
              size={2 * 1024} 
            />
          </ProForm.Item>
          <ProForm.Item
            label='内容'
            rules={[{ required: true, message: '请输入内容'}]}
            name='detailContent'
          >
            <ReactQuill
              className='richText'
              theme='snow'
              key='1'
              placeholder='请输入内容'
              id='ReactQuill'
              modules={ modules }
            />
          </ProForm.Item>
        </>
      )
    } else {
      return (
        <>
          <ProFormText
            name="detailTitle"
            label="公告标题"
            placeholder="请输入公告标题"
            rules={[{ required: true, message: '请输入公告标题'}]}
            fieldProps={{
              maxLength: 18
            }}
          />
          <ProForm.Item
            label="公告图片"
            name="detailcCover"
            rules={[
              {
                required: true,
                message: '请上传公告图片'
              }
            ]}
            tooltip={
              <dl>
                <dt>图片要求</dt>
                <dd>1.图片大小2MB以内</dd>
                <dd>2.图片格式png/jpg/gif</dd>
              </dl>
            }
          >
            <Upload 
              code={304}
              multiple
              maxCount={1}
              accept="image/*" 
              size={2 * 1024} 
            />
          </ProForm.Item>
          <ProForm.Item
            label='公告'
            rules={[{ required: true, message: '请输入公告'}]}
            name='detailContent'
          >
            <ReactQuill
              className='richText'
              theme='snow'
              key='2'
              placeholder='请输入公告'
              id='ReactQuill'
              modules={ modules }
            />
          </ProForm.Item>
        </>
      )
    }
  }
  const selectType = e => {
    setShowTab(e.target.value)
  }
  const draft = (values) => {
    const { pushType,...rest } = values.getFieldsValue()
    let params = {}
    if(rest.type == 1) {
      params = {...rest, link:{ type: rest?.linkType, link: rest?.link }, status: 0, pushType: pushType.join(',')}
    } else {
      params = {...rest, detail: {title: rest?.detailTitle, img: rest?.detailcCover, content: rest?.detailContent}, status: 0, pushType: pushType.join(',')}
    }
    customMessageAdd(params).then(res=>{
      if(res?.success) {
        callback()
        onClose()
        message.success('草稿保存成功')
      }
    }).finally(()=>{
      onClose()
    })
  }
  const submit = values => {
    const { pushType,...rest } = values.getFieldsValue()
    let params = {}
    if(rest.type == 1) {
      params = { ...rest, link: { type: rest?.linkType, link: rest?.link }, status: 1, pushType: pushType.join(','), id:detailData?.id}
    } else {
      params = { ...rest, detail: { title: rest?.detailTitle, img: rest?.detailcCover, content: rest?.detailContent }, status: 1, pushType: pushType.join(','), id:detailData?.id}
    }
    apiMethods(params).then(res=>{
      if(res?.success) {
        onClose()
        callback()
        message.success('提交成功')
      }
    }).finally(()=>{
      onClose()
    })
  }
  useEffect(() => {
    if(detailData){
      const {link, detail} = detailData
      form.setFieldsValue({
        ...detailData,
        linkType: link?.type,
        link: link?.link,
        detailTitle: detail?.title,
        detailcCover: detail?.img,
        detailContent: detail?.content
      })
      setShowTab(detailData?.type)
      setLinkType(link?.type)
    }
    return undefined
  }, [detailData])
  return (
    <DrawerForm
      title={detailData?'编辑':'新建'}
      onVisibleChange={setVisible}
      drawerProps={{
        forceRender: true,
        destroyOnClose: true,
        onClose: ()=> onClose()
      }}
      initialValues={{
        pushType: ['1']
      }}
      form={form}
      submitter={{
        render: () => {
          return [
            !detailData&&
            <Button 
              type="primary" 
              key="draft" 
              onClick={() => {
                draft(form)
              }}
            >
              保存为草稿
            </Button>,
            <Button 
              type="primary"
              key="submit" 
              onClick={() =>{
                submit(form)
              }}
            >
              提交
            </Button>,
            <Button 
              key="rest"
              onClick={() => onClose()}
            >
              返回
           </Button>
          ]
        }
      }}
      visible={visible}
      {...formItemLayout}
    >
      <ProFormText
        name="name"
        label="名称"
        placeholder="请输入名称"
        rules={[{required: true, message: '请输入名称'}]}
        fieldProps={{
          maxLength: 16
        }}
      />
      <ProFormRadio.Group
        name="type"
        label="自定义类型"
        rules={[{ required: true, message: '请输入自定义类型'}]}
        initialValue={showTab}
        fieldProps={{
          onChange: (e)=>{ selectType(e) }
        }}
        options={[
          {
            label: '优惠促销',
            value: 1
          },
          {
            label: '内容推广',
            value: 2
          },
          {
            label: '系统公告',
            value: 3
          }
        ]}
      />
      <ProFormText
        name="title"
        label="标题"
        width='md'
        placeholder="请输入标题"
        rules={[{ required: true, message: '请输入标题'}]}
        fieldProps={{
          maxLength: 20
        }}
      />
       <ProFormTextArea
        name="content"
        label="内容"
        width='lg'
        placeholder="请输入内容"
        rules={[{ required: true, message: '请输入内容'}]}
        fieldProps={{
          maxLength: 200,
          showCount: true
        }}
      />
      <ProForm.Item
        label="封面图片"
        name="cover"
        rules={[{message: '请上传封面图片', required: true}]}
        tooltip={
          <dl>
            <dt>图片要求</dt>
            <dd>1.图片大小500KB以内</dd>
            <dd>2.图片尺寸为 350 x 125</dd>
            <dd>3.图片格式png/jpg/gif</dd>
          </dl>
        }
      >
        <Upload
          code={304}
          multiple
          maxCount={1}
          proportion={{width: '350', height:'125'}}
          accept="image/*"
          size={.5 * 1024}
        />
      </ProForm.Item>
      <ProFormSelect
        name="pushType"
        label="推送渠道"
        rules={[{ required: true, message: '请选择推送渠道'}]}
        width="md"
        fieldProps={{
          mode:'multiple'
        }}
        options={[
          {
            value: '1',
            label: '站内信',
            disabled: true,
          },
          {
            value: '2',
            label: '推送消息'
          },
          // {
          //   label: 3,
          //   value: '短信'
          // },
          // {
          //   label: 4,
          //   value: '小程序'
          // },
        ]}
      />
       <ProFormRadio.Group
        name="targetType"
        label="适用会员"
        rules={[{message: '请选择适用会员', required: true} ]}
        tooltip={
          <>每位用户仅接收1次消息</>
        }
        options={[
          {
            label: '全部用户',
            value: 2
          },
          {
            label: '仅店主',
            value: 3
          }
        ]}
      />
      <DynamicTab />
    </DrawerForm>
  )
}

export default Edit
