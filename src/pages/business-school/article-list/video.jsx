import React, { useRef, useEffect, useState} from 'react';
import { message, Form,Button  } from 'antd';
import ProForm, {
  DrawerForm,
  ProFormText,
  ProFormRadio,
  ProFormSelect,
} from '@ant-design/pro-form';
import Upload from '@/components/upload';
import { saveOrUpdateArticle,adminArticleDetail } from '@/services/business-school/find-admin-article-list';
import 'react-quill/dist/quill.snow.css';





const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 14 },
  layout: {
    labelCol: {
      span: 4,
    },
    wrapperCol: {
      span: 14,
    },
  }
};


const numMinLength=(rule, value, callback)=>{
  return new Promise(async (resolve, reject) => {
  if (value&&value.length<4) {
      await reject('不少于4个字符')
  }else if (/[%&',;=?$\x22]/.test(value)) {
    await reject('圈子名称不可以含特殊字符')
  }else {
      await resolve()
  }
  })
}



export default (props) => {
  const { detailData, setVisible, onClose, visible,callback } = props;
  const formRef = useRef();
  const [form] = Form.useForm()

  const FromWrap = ({ value, onChange, content, right }) => (
    <div style={{ display: 'flex' }}>
      <div>{content(value, onChange)}</div>
      <div style={{ flex: 1, marginLeft: 10, minWidth: 180 }}>{detailData?.id&&detailData?.edtil?null:right(value)}</div>
    </div>
  )

  useEffect(() => {
    if(detailData?.id){
        adminArticleDetail({id:detailData?.id}).then(res=>{
            form.setFieldsValue({
                ...res.data
              })
        })
    }

  }, [form, detailData])

  const onsubmit = (values) => {
    const { ...rest } = values
    var audio = new Audio(values.videoUrl)
    audio.addEventListener("loadedmetadata", function (e) {
      const min=parseInt(audio.duration/60)
      const s=parseInt(audio.duration % 60)
      const param = {
        articleType:2,
        videoDuration:`${min>=10?min:'0'+min}:${s>=10?s:'0'+s}`,
        ...rest
      }
      if(audio.duration>3600){
        message.error('上传视频必须在60分钟以内！！');
        return false
      }
      if(detailData?.id&&detailData?.edtil){
        return setVisible(false)
      }
      if (detailData?.id) {
        param.id = detailData?.id
      }
      return new Promise((resolve) => {
        saveOrUpdateArticle(param).then((res) => {
          if (res.code === 0) {
            message.success(detailData?.id ?'编辑成功':'提交成功');
            resolve(true);
            callback(true)
          }
        })
    
      });
      
    });

  };


  const checkConfirm=(rule, value, callback)=>{
    return new Promise(async (resolve, reject) => {
    if (value&&value.length>0&&!/^[0-9]*[1-9][0-9]*$/.test(value)&&value!=0) {
        await reject('只能输入整数')
    } else {
        await resolve()
    }
    })
}

  return (
    <DrawerForm
      title={`${detailData?.id ?detailData?.edtil?'详情': '编辑视频' : '新建视频'}`}
      onVisibleChange={setVisible}
      formRef={formRef}
      visible={visible}
      form={form}
      drawerProps={{
        forceRender: true,
        destroyOnClose: true,
        onClose: () => {
          onClose();
        }
      }}
      onFinish={async (values) => {
        await onsubmit(values);
        // 不返回不会关闭弹框
        return true;
      }}
      submitter={
        {
          render: (props, defaultDoms) => {
            return [
              <>
                {
                  detailData?.id&&detailData?.edtil?null:<Button type="primary" key="submit" onClick={() => {
                    props.form?.submit?.()
                  }}>
                    提交
                  </Button>
                }
              </>,
              <Button type="default" onClick={() => setVisible(false)}>
                返回
              </Button>
            ];
          }
        }
      }
      {...formItemLayout}
    >
        <ProFormText 
          width="md"
          name="articleTitle"
          label="标题"
          placeholder="请输入视频标题"
          rules={[
            { required: true, message: '请输入视频标题' },
            {validator: numMinLength}
          ]}
          readonly={detailData?.id&&detailData?.edtil&&true}
          fieldProps={{
            minLength:4,
            maxLength: 60,
          }} 
        />

        <ProFormText 
          width="md"
          name="authorNickName"
          label="发布人昵称"
          placeholder="请输入当前登录账户昵称"
          rules={[
            { required: true, message: '请输入当前登录账户昵称' },
            {validator: numMinLength}
          ]}
          readonly={detailData?.id&&detailData?.edtil&&true}
          fieldProps={{
            minLength:4,
            maxLength: 20,
          }}
          initialValue={'约购小助手'}
        />

        <Form.Item
          label="封面图片"
          name="coverPicture"
          rules={[{ required: true, message: '请上传图片!' }]}
          readonly={detailData?.id&&detailData?.edtil}  
        >
          <FromWrap
            content={(value, onChange) => <Upload multiple value={value} onChange={onChange}   maxCount={1} accept="image/*"  size={(1*1024)/2} />}
            right={(value) => {
              return (
                <dl>
                  <dt>图片要求</dt>
                  <dd>1.图片大小500kb以内</dd>
                  <dd>2.建议尺寸为 720 x 200</dd>
                  <dd>3.图片格式png/jpg/gif</dd>
                </dl>
              )
            }}
          />
        </Form.Item>

        <ProFormSelect
          name="storeType"
          label="可展示店铺"
          options={[
            {
                value: 1,
                label: '所有店铺',
            },
            {
                value: 2,
                label: '社区店',
            },
            {
                value: 3,
                label: '内部店',
            },
            {
                value: 4,
                label: '自营店',
            },
          ]}
          placeholder="请选择可展示的店铺"
          rules={[{ required: true, message: '请选择店铺!' }]}
          readonly={detailData?.id&&detailData?.edtil}  
        />

      <ProFormRadio.Group
          name="isTop"
          label="是否置顶"
          rules={[{ required: true, message: '是否置顶!' }]}
          options={[
            {
              label: '置顶',
              value: 1,
            },
            {
              label: '不置顶',
              value: 0,
            },
          ]}
          initialValue={1}
          readonly={detailData?.id&&detailData?.edtil}  
        />
        
       <ProFormRadio.Group
          name="isShow"
          label="状态"
          rules={[{ required: true, message: '请设置是否显示隐藏!' }]}
          options={[
            {
              label: '显示',
              value: 1,
            },
            {
              label: '隐藏',
              value: 0,
            },
          ]}
          readonly={detailData?.id&&detailData?.edtil} 
        />

        <ProFormText 
          width="md"
          name="virtualClickNum"
          label="虚拟浏览量"
          placeholder="请输入虚拟浏览量，8位以内整数"
          rules={[
            { required: true, message: '请输入虚拟浏览量,8位以内整数' },
            {validator: checkConfirm}
          ]}
          fieldProps={{
            maxLength: 8,
          }}
          readonly={detailData?.id&&detailData?.edtil}  
        />

        <Form.Item
          label="上传视频"
          name="videoUrl"
          rules={[{ required: true, message: '请上传视频!' }]}
          readonly={detailData?.id&&detailData?.edtil}  
        >
          <FromWrap
            content={(value, onChange) =>  <Upload multiple value={value} onChange={onChange} maxCount={1} size={500*1024}  accept="video/*" />}
            right={(value) => {
              return (
                <dl>
                  <dt>视频要求</dt>
                  <dd>1.500MB以内</dd>
                  <dd>2.60分钟以内</dd>
                  <dd>3.mp4格式</dd>
                </dl>
              )
            }}
          />
         
        </Form.Item>

    </DrawerForm>
  );
};