import React, { useRef, useEffect, useState } from 'react';
import { message, Form,Space,Button,Modal} from 'antd';
import ProForm, {
  DrawerForm,
  ProFormText,
  ProFormRadio,
  ProFormSelect,
} from '@ant-design/pro-form';
import Upload from '@/components/upload';
import { findAdminArticleTypeList } from '@/services/cms/member/member';
import { adminArticleDetail,saveOrUpdateArticle } from '@/services/business-school/find-admin-article-list';
import  ReactQuill,{ Quill }  from 'react-quill';
import QuillEmoji from 'quill-emoji'
import 'quill-emoji/dist/quill-emoji.css'
import { history } from 'umi';
import styles from './style.less'
import 'react-quill/dist/quill.snow.css';
import upload from '@/utils/upload'
import { now } from 'lodash';


Quill.register({
  'modules/emoji-toolbar': QuillEmoji.ToolbarEmoji,
  // 'modules/emoji-textarea': QuillEmoji.TextAreaEmoji,
  'modules/emoji-shortname': QuillEmoji.ShortNameEmoji
})


const formItemLayout = {
  labelCol: { span: 3 },
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





export default (props) => {
  const { detailData, setVisible, onClose, visible,callback } = props;
  const formRef = useRef();
  const ref = useRef();
  const [onselect,setOnselect]=useState([])
  const [form] = Form.useForm()
  const FromWrap = ({ value, onChange, content, right }) => (
    <div style={{ display: 'flex' }}>
      <div>{content(value, onChange)}</div>
      <div style={{ flex: 1, marginLeft: 10, minWidth: 180 }}>{detailData?.id&&detailData?.edtil?null:right(value)}</div>
    </div>
  )
  const  base64toFile=async (urlData) => {
    //去掉url的头，并转换为byte
    const bytes = window.atob(urlData.split(',')[1]);
    //处理异常,将ascii码小于0的转换为大于0
    const ab = new ArrayBuffer(bytes.length);
    const ia = new Uint8Array(ab);
    ia.forEach((i, index) => {
      ia[index] = bytes.charCodeAt(index);
    });
    //文件流转换成url路径
    const link=await upload(new Blob([ia], { type: urlData.split(',')[0].split(':')[1].split(';')[0],name:+new Date() }),204)
    return link
};

  const onsubmit =async (values) => {
    const {articleContent, ...rest } = values
    const urlData=[]
    articleContent.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/g, async (match, capture) => {
      urlData.push(capture)
    });

    const linkArr=[]
    for (var value of urlData)  {
      if(value.indexOf('base64')!= -1){
        const str=await base64toFile(value)
        linkArr.push({old:value.slice(-20),new:str})
      }else{
        linkArr.push({old:value.slice(-20),new:value})
      }
    }

    const str=articleContent.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/g,(match, capture) => {
      const link=linkArr.find(ele=>{
        return capture.slice(-20)==ele.old
      })
      return `<img src=${link?.new}/>`
    }
    );

    const param = {
      articleType:1,
      articleContent:`<head><style>img{width:100% !important;}</style></head>${str}`,
      ...rest
    }
    if(detailData?.id&&detailData?.edtil){
        return setVisible(false)
    }
    if (detailData?.id&&detailData?.edit) {
      param.id = detailData?.id
    }
    if(!articleContent){
      message.error('请填写文章内容！！');
      return false
    }else{
      saveOrUpdateArticle(param).then((res) => {
          if (res.code === 0) {
            message.success(detailData?.id ?'编辑成功':'提交成功');
            callback(true)
            setVisible(false)
          }
        })
    }

  };

  useEffect(() => {
    if (detailData?.id) {
      adminArticleDetail({id:detailData?.id}).then(res=>{
        form.setFieldsValue({
          ...res.data
        })
      })
    }
    const params={
      isShow:1
    }
    if(detailData?.id){
      delete params.isShow
    }
    findAdminArticleTypeList(params).then(res=>{
      setOnselect(res.data?.map(ele=>(
        {label:ele.typeName,value:ele.id}
      )))
    })
  }, [form, detailData])

  const checkConfirm=(rule, value, callback)=>{
    return new Promise(async (resolve, reject) => {
    if (value&&value.length>0&&!/^[0-9]*[1-9][0-9]*$/.test(value)&&value!=0) {
        await reject('只能输入整数')
    } else {
        await resolve()
    }
    })
  }

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

  const modules={
    toolbar:{
      container:[
        [{ 'size': ['small', false, 'large', 'huge'] }], // custom dropdown
        [{ 'font': [] }],
        [{ 'header': 1 }, { 'header': 2 }],        // custom button values
        ['bold', 'italic', 'underline', 'strike'],    // toggled buttons
        [{ 'align': [] }],
        [{ 'indent': '-1' }, { 'indent': '+1' }],     // outdent/indent
        [{ 'direction': 'rtl' }],             // text direction
        [{ 'script': 'sub' }, { 'script': 'super' }],   // superscript/subscript
        ['blockquote', 'code-block'],
      
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'color': [] }, { 'background': [] }],
        ['emoji', 'image', 'video', 'link'],
      
        ['clean']
      ],
      handlers: {
        image: ()=>imageHandler()
      }
    },
    'emoji-toolbar': true,
    // 'emoji-textarea': true,
    'emoji-shortname': true,
  }
 

  const imageHandler = () => {
    const quillEditor = ref.current?.getEditor()
    const input = document.createElement('input')
    input.setAttribute('type', 'file')
    input.setAttribute('accept', 'image/*')
    input.setAttribute('multiple', 'multiple');
    input.click()
    input.onchange = async () => {
      const file = input.files[0]
      const formData = new FormData()
      formData.append('quill-image', file)
      const code=204
      const link=await upload(file,code)
      const range = quillEditor?.getSelection()
      quillEditor.insertEmbed(range.index, 'image', link)
    }
  }

  return (
    <DrawerForm
      title={`${detailData?.id ? detailData?.edtil?'详情':'编辑图文' : '新建图文'}`}
      onVisibleChange={setVisible}
      formRef={formRef}
      visible={visible}
      form={form}
      width={1500}
      drawerProps={{
        forceRender: true,
        destroyOnClose: true,
        onClose: () => {
          onClose();
        }
      }}
      className={styles.article_list}
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
      onFinish={async (values) => {
        try {
          await onsubmit(values);
        } catch (error) {
          console.log('error',error)
        }
        // 不返回不会关闭弹框
        // return true;
      }}
      {...formItemLayout}
    >
        <ProFormText 
          width="md"
          name="articleTitle"
          label="标题"
          placeholder="请输入文章标题"
          rules={[
            { required: true, message: '请输入文章标题' },
            {validator: numMinLength}
          ]}
          readonly={detailData?.id&&detailData?.edtil}
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
          readonly={detailData?.id&&detailData?.edtil}
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
          width="md"
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

  
        <ProFormSelect
          width="md"
          name="articleTypeId"
          label="所属分类"
          options = {onselect}
          placeholder="请选择所属文章分类"
          rules={[{ required: true, message: '请选择位置!' }]}
          readonly={detailData?.id&&detailData?.edtil}
          extra={detailData?.id&&detailData?.edtil?null:<a onClick={()=>{history.push('/business-school/article-category-list')}}>管理分类</a>}
        />

       
      <ProFormRadio.Group
          name="isTop"
          label="是否置顶"
          rules={[{ required: true, message: '请设置是否置顶!' }]}
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

        {
          onselect.length>0&&
          <div  className={styles.box}>
            <Form.Item
              label="文章详情"
              name="articleContent"
              readonly={detailData?.id&&detailData?.edtil}
              // rules={[{ required: true, message: '请设置文章详情!' }]} 
            >
              <ReactQuill modules={modules} ref={ref}/>
            </Form.Item>
            <div className={styles.mark}>*</div>
          </div>
        }

    </DrawerForm>
  );
};
