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
            label="????????????"
            rules={[{ required: true, message: '?????????????????????'}]}
            initialValue={linkType}
            fieldProps={{
              onChange: (e)=>{ selectLink(e) }
            }}
            options={[
              {
                label: '??????????????????',
                value: 1
              }
            ]}
          />
          <ProFormText
            name="link"
            label="????????????"
            rules={[{ required: true, message: '?????????????????????'}]}
          />
        </>
      )
    }else if( showTab == 2 ) {
      return (
        <>
          <ProFormText
            name="detailTitle"
            label="????????????"
            placeholder="?????????????????????"
            rules={[{ required: true, message: '?????????????????????'}]}
            fieldProps={{
              maxLength: 18
            }}
          />
          <ProForm.Item
            label="????????????"
            name="detailcCover"
            rules={[
              {
                required: true,
                message: '?????????????????????'
              }
            ]}
            tooltip={
              <dl>
                <dt>????????????</dt>
                <dd>1.????????????2MB??????</dd>
                <dd>2.????????????png/jpg/gif</dd>
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
            label='??????'
            rules={[{ required: true, message: '???????????????'}]}
            name='detailContent'
          >
            <ReactQuill
              className='richText'
              theme='snow'
              key='1'
              placeholder='???????????????'
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
            label="????????????"
            placeholder="?????????????????????"
            rules={[{ required: true, message: '?????????????????????'}]}
            fieldProps={{
              maxLength: 18
            }}
          />
          <ProForm.Item
            label="????????????"
            name="detailcCover"
            rules={[
              {
                required: true,
                message: '?????????????????????'
              }
            ]}
            tooltip={
              <dl>
                <dt>????????????</dt>
                <dd>1.????????????2MB??????</dd>
                <dd>2.????????????png/jpg/gif</dd>
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
            label='??????'
            rules={[{ required: true, message: '???????????????'}]}
            name='detailContent'
          >
            <ReactQuill
              className='richText'
              theme='snow'
              key='2'
              placeholder='???????????????'
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
        message.success('??????????????????')
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
        message.success('????????????')
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
      title={detailData?'??????':'??????'}
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
              ???????????????
            </Button>,
            <Button 
              type="primary"
              key="submit" 
              onClick={() =>{
                submit(form)
              }}
            >
              ??????
            </Button>,
            <Button 
              key="rest"
              onClick={() => onClose()}
            >
              ??????
           </Button>
          ]
        }
      }}
      visible={visible}
      {...formItemLayout}
    >
      <ProFormText
        name="name"
        label="??????"
        placeholder="???????????????"
        rules={[{required: true, message: '???????????????'}]}
        fieldProps={{
          maxLength: 16
        }}
      />
      <ProFormRadio.Group
        name="type"
        label="???????????????"
        rules={[{ required: true, message: '????????????????????????'}]}
        initialValue={showTab}
        fieldProps={{
          onChange: (e)=>{ selectType(e) }
        }}
        options={[
          {
            label: '????????????',
            value: 1
          },
          {
            label: '????????????',
            value: 2
          },
          {
            label: '????????????',
            value: 3
          }
        ]}
      />
      <ProFormText
        name="title"
        label="??????"
        width='md'
        placeholder="???????????????"
        rules={[{ required: true, message: '???????????????'}]}
        fieldProps={{
          maxLength: 20
        }}
      />
       <ProFormTextArea
        name="content"
        label="??????"
        width='lg'
        placeholder="???????????????"
        rules={[{ required: true, message: '???????????????'}]}
        fieldProps={{
          maxLength: 200,
          showCount: true
        }}
      />
      <ProForm.Item
        label="????????????"
        name="cover"
        rules={[{message: '?????????????????????', required: true}]}
        tooltip={
          <dl>
            <dt>????????????</dt>
            <dd>1.????????????500KB??????</dd>
            <dd>2.??????????????? 350 x 125</dd>
            <dd>3.????????????png/jpg/gif</dd>
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
        label="????????????"
        rules={[{ required: true, message: '?????????????????????'}]}
        width="md"
        fieldProps={{
          mode:'multiple'
        }}
        options={[
          {
            value: '1',
            label: '?????????',
            disabled: true,
          },
          {
            value: '2',
            label: '????????????'
          },
          // {
          //   label: 3,
          //   value: '??????'
          // },
          // {
          //   label: 4,
          //   value: '?????????'
          // },
        ]}
      />
       <ProFormRadio.Group
        name="targetType"
        label="????????????"
        rules={[{message: '?????????????????????', required: true} ]}
        tooltip={
          <>?????????????????????1?????????</>
        }
        options={[
          {
            label: '????????????',
            value: 2
          },
          {
            label: '?????????',
            value: 3
          }
        ]}
      />
      <DynamicTab />
    </DrawerForm>
  )
}

export default Edit
