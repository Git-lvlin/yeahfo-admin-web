import { useState, useRef, useEffect } from 'react';
import { 
  againRentNoticeTime,
  againRentNoticeContent,
  supplyRentNoticeTime,
  supplyRentNoticeConten,
  firestRent,
  buySend,
  rentSend,
  serviceOrManagerNotice,
  serviceNoticeContent
} from '@/services/hydrogen-atom-management/hydrogen-atom-configuration';
import * as api from '@/services/setting/account-management';
import { Divider, Form, Button,Select,Typography } from 'antd';
import ProForm, {
  ProFormText,
  ProFormSelect,
  ProFormTimePicker
} from '@ant-design/pro-form';
import type { ProFormInstance } from '@ant-design/pro-form';
import moment from 'moment'
import ConfirmModel from './confirm-model'
import type { selectItem,paramsItem } from './data'
const { Option } = Select;
const { Title } = Typography;

const formItemLayout = {
    labelCol: { span: 7 },
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
  
const checkConfirm = (rule, value, callback) => {
return new Promise(async (resolve, reject) => {
    if (value && !/^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/.test(value)) {
    await reject('请输入正确的手机号')
    }else {
    await resolve()
    }
})
}
  
export default () => {
    const formRef2=useRef<ProFormInstance>()
    const formRef3=useRef<ProFormInstance>()
    const formRef4=useRef<ProFormInstance>()
    const formRef5=useRef<ProFormInstance>()
    const formRef6=useRef<ProFormInstance>()
    const formRef7=useRef<ProFormInstance>()
    const formRef8=useRef<ProFormInstance>()
    const formRef9=useRef<ProFormInstance>()
    const formRef10=useRef<ProFormInstance>()
    const [form2] = Form.useForm()
    const [form3] = Form.useForm()
    const [form4] = Form.useForm()
    const [form5] = Form.useForm()
    const [form6] = Form.useForm()
    const [form7] = Form.useForm()
    const [form8] = Form.useForm()
    const [form9] = Form.useForm()
    const [form10] = Form.useForm()
    const [visible, setVisible] = useState(false);
    const [paramsType,setParamsType]=useState<paramsItem>()
    const [onselect,setOnselect]=useState([])
    useEffect(()=>{
      api.adminList({status:1,size:1000}).then(res=>{
        setOnselect(res.data?.map((ele:selectItem)=>(
          {label:ele.nickname,value:ele.targetId}
        )))
      })
    },[])
    useEffect(()=>{
      againRentNoticeTime({}).then(res=>{
        if(res.code==0){
          const datail=JSON.parse(res.data?.value)
          form2.setFieldsValue({
            times:datail?.times,
            code:res.data?.code,
            cron:datail?.cron
          })
        }
      })
  
      againRentNoticeContent({}).then(res=>{
        if(res.code==0){
          form3.setFieldsValue({
            value:res.data?.value,
            code:res.data?.code
          })
        }
      })
      
      supplyRentNoticeTime({}).then(res=>{
        if(res.code==0){
          const datail=JSON.parse(res.data?.value)
          form4.setFieldsValue({
            days:datail?.days.split(','),
            time:moment(datail?.time, 'HH:mm:ss'),
            code:res.data?.code
          })
        }
      })
  
      supplyRentNoticeConten({}).then(res=>{
        if(res.code==0){
          form5.setFieldsValue({
            value:res.data?.value,
            code:res.data?.code
          })
        }
      })
  
      firestRent({}).then(res=>{
        if(res.code==0){
          const datail=JSON.parse(res.data?.value)
          form6.setFieldsValue({
            remindTime:datail?.remindTime,
            content:datail?.content
          })
        }
      })
  
      buySend({}).then(res=>{
        if(res.code==0){
          const datail=JSON.parse(res.data?.value)
          form7.setFieldsValue({
            remindTime:datail?.remindTime,
            content:datail?.content
          })
        }
      })
  
      rentSend({}).then(res=>{
        if(res.code==0){
          const datail=JSON.parse(res.data?.value)
          form8.setFieldsValue({
            remindTime:datail?.remindTime,
            content:datail?.content
          })
        }
      })
  
      serviceOrManagerNotice({}).then(res=>{
        if(res.code==0){
          const datail=JSON.parse(res.data?.value)
          form9.setFieldsValue({
            phone:datail?.phone,
            managerId:datail?.managerId,
            code:res.data?.code
          })
        }
      })
  
      serviceNoticeContent({}).then(res=>{
        if(res.code==0){
          form10.setFieldsValue({
            value:res.data?.value,
            code:res.data?.code
          })
        }
      })
    },[])
    const content =()=>{
      const children=[]
      for (let index = 1; index < moment().daysInMonth()+1; index++) {
        if(`${index}`.length==1){
          children.push(<Option key={index}>{`0${index}`}</Option>)
        }else{
          children.push(<Option key={index}>{index}</Option>)
        }
        
      }
      return children
    }
    const tagRender=(props:{label:string,value:number})=>{
      const { label,value } = props;
      if(value<10){
        return (
          <p
            style={{ marginRight: 3 }}
          >
             {value}、
          </p>
        );
      }else{
        return (
          <p
            style={{ marginRight: 3 }}
          >
             {label}、
          </p>
        );
      }

    }
    
    return (
    <div style={{background:'#fff',padding:'0 20px'}}>
        <Title style={{ marginBottom: 10 }} level={5}>续租</Title>
        <ProForm<{
          times:string,
          code:string,
          cron:string
        }>
          onFinish={async (values) => {
            setVisible(true)
            setParamsType(values)
          }}
          submitter={{
            render: (props, defaultDoms) => {
                return [];
            },
            }}
          form={form2}
          formRef={formRef2}
          {...formItemLayout}
        ><ProForm.Group>
            <ProFormText
              wrapperCol={20}
              readonly
              name='times'
              label="通知时间"
              rules={[{ required: true, message: '请输入通知时间' }]}
            />
            <ProFormText
              name='code'
              hidden
            />
             <ProFormText
              name='cron'
              hidden
            />
            <Form.Item>
              <Button type="primary" style={{ marginLeft:'595px' }} onClick={()=>{
                formRef2?.current.submit()
              }}>
                确定
              </Button>
            </Form.Item>
          </ProForm.Group>
        </ProForm>
        <Divider style={{ margin: '0 0 20px 0' }} />
        <ProForm<{
            value:string;
            code:string
          }>
          onFinish={async (values) => {
            setVisible(true)
            setParamsType(values)
          }}
          submitter={{
            render: (props, defaultDoms) => {
                return [];
            },
            }}
          form={form3}
          formRef={formRef3}
          {...formItemLayout}
        >
          <ProForm.Group>
            <ProFormText
              name='value'
              width={800}
              label="通知文案"
              placeholder="请输入通知店主续租消息的文案，6-200个字符"
              rules={[
                { required: true, message: '请输入通知文案' },
                () => ({
                  validator(_, value) {
                    if (value&&value.length<6) {
                      return Promise.reject(new Error('请输入6-200个字符'));
                    }
                    return Promise.resolve();
                  },
                })
              ]}
              fieldProps={{
                maxLength:200
              }}
              labelCol={5}
              extra={<p>此处设置站内信文案，<span style={{color:'#DBD0AC'}}>$(参数名)样式为消息参数不可拆散或修改</span></p>}
            />
            <ProFormText
              name='code'
              hidden
            />
            <Form.Item>
            <Button type="primary" onClick={()=>{
              formRef3?.current.submit()
            }}>
              确定
            </Button>
          </Form.Item>
          </ProForm.Group>
        </ProForm>
        <Divider style={{ margin: '0 0 20px 0' }} />
        <Title style={{ marginBottom: 10 }} level={5}>从未缴租时欠费补租</Title>
        <ProForm<{
          days:[];
          time:string;
          code:string
            }>
          onFinish={async (values) => {
            setVisible(true)
            setParamsType(values)
          }}
          submitter={{
            render: (props, defaultDoms) => {
                return [];
            },
            }}
          form={form4}
          formRef={formRef4}
          {...formItemLayout}
        >
          <ProForm.Group>
            <Form.Item labelCol={6} name='days' label="通知时间 : 逾期后第" rules={[{ required: true, message: '请输入通知时间' }]}>
              <Select
                mode="multiple"
                allowClear
                style={{ width: '400px' }}
                placeholder="请选择提醒的通知时间"
                tagRender={tagRender}
              >
                {content()}
              </Select>
            </Form.Item>
            <p>天</p>
            <ProFormTimePicker width={200} name="time" fieldProps={{format:"HH:mm"}}/>
            <ProFormText
              name='code'
              hidden
            />
            <Form.Item>
            <Button type="primary" style={{ marginLeft:'55px' }} onClick={()=>{
              formRef4?.current.submit()
            }}>
              确定
            </Button>
          </Form.Item>
          </ProForm.Group>
        </ProForm>
        <Divider style={{ margin: '0 0 20px 0' }} />
        <ProForm<{
          phone:string;
          time:string;
          managerId:string;
          code:string
            }>
          onFinish={async (values) => {
            setVisible(true)
            setParamsType(values)
          }}
          submitter={{
            render: (props, defaultDoms) => {
                return [];
            },
            }}
          form={form9}
          formRef={formRef9}
          {...formItemLayout}
        >
          <ProForm.Group>
            <ProFormText
              name='phone'
              label='通知客服'
              placeholder='接收用户欠租金通知短信的手机号码'
              rules={[
                { required: true, message: '请输入手机号码' },
                { validator: checkConfirm}
              ]}
              width={300}
              labelCol={5}
            />
            <ProFormSelect
              name="managerId"
              options = {onselect}
              placeholder="选择接收用户欠租金站内信的管理员"
              width={300}
            />
            <ProFormText
              name='code'
              hidden
            />
            <Form.Item>
            <Button type="primary" style={{ marginLeft:'170px' }} onClick={()=>{
              formRef9?.current.submit()
            }}>
              确定
            </Button>
          </Form.Item>
          </ProForm.Group>
        </ProForm>
        <Divider style={{ margin: '0 0 20px 0' }} />
        <ProForm<{
          value:string;
          code:string
            }>
          onFinish={async (values) => {
            setVisible(true)
            setParamsType(values)
          }}
          submitter={{
            render: (props, defaultDoms) => {
                return [];
            },
            }}
          form={form5}
          formRef={formRef5}
          {...formItemLayout}
        >
          <ProForm.Group>
            <ProFormText
              name='value'
              width={775}
              label="用户通知文案"
              placeholder="请输入通知店主补租消息的文案，6-200个字符"
              rules={[
                { required: true, message: '请输入通知文案' },
                () => ({
                  validator(_, value) {
                    if (value&&value.length<6) {
                      return Promise.reject(new Error('请输入6-200个字符'));
                    }
                    return Promise.resolve();
                  },
                })
              ]}
              fieldProps={{
                maxLength:200
              }}
              labelCol={5}
              extra={<p>此处设置站内信文案，<span style={{color:'#DBD0AC'}}>$(参数名)样式为消息参数不可拆散或修改</span></p>}
            />
            <ProFormText
              name='code'
              hidden
            />
            <Form.Item>
            <Button type="primary" onClick={()=>{
              formRef5?.current.submit()
            }}>
              确定
            </Button>
          </Form.Item>
          </ProForm.Group>
        </ProForm>
        <Divider style={{ margin: '0 0 20px 0' }} />
        <ProForm<{
          value:string;
          code:string
            }>
          onFinish={async (values) => {
            setVisible(true)
            setParamsType(values)
          }}
          submitter={{
            render: (props, defaultDoms) => {
                return [];
            },
            }}
          form={form10}
          formRef={formRef10}
          {...formItemLayout}
        >
          <ProForm.Group>
            <ProFormText
              name='value'
              width={775}
              label="客服通知文案"
              placeholder="请输入通知客服需店主补租消息的文案，6-200个字符"
              rules={[
                { required: true, message: '请输入通知文案' },
                () => ({
                  validator(_, value) {
                    if (value&&value.length<6) {
                      return Promise.reject(new Error('请输入6-200个字符'));
                    }
                    return Promise.resolve();
                  },
                })
              ]}
              fieldProps={{
                maxLength:200
              }}
              labelCol={5}
              extra={<p>此处设置站内信文案，<span style={{color:'#DBD0AC'}}>$(参数名)样式为消息参数不可拆散或修改</span></p>}
            />
            <ProFormText
              name='code'
              hidden
            />
            <Form.Item>
            <Button type="primary" onClick={()=>{
              formRef10?.current.submit()
            }}>
              确定
            </Button>
          </Form.Item>
          </ProForm.Group>
        </ProForm>
        <Divider style={{ margin: '0 0 20px 0' }} />
        <Title style={{ marginBottom: 10 }} level={5}>首次交租</Title>
        <ProForm<{
          remindTime:string;
          content:string
            }>
          onFinish={async (values) => {
            setVisible(true)
            setParamsType(values)
          }}
          submitter={{
            render: (props, defaultDoms) => {
                return [];
            },
            }}
          form={form6}
          formRef={formRef6}
          {...formItemLayout}
        >
          <ProFormText
            label="提醒时间"
            labelCol={1}
            width={400}
            name='remindTime'
            readonly
            rules={[{ required: true, message: '请输入提醒时间' }]}
          />
          <ProFormText
            name='content'
            width={800}
            label="通知文案"
            rules={[{ required: true, message: '请输入通知文案' }]}
            labelCol={5}
            extra={<p>此处设置站内信文案，<span style={{color:'#DBD0AC'}}>$(参数名)样式为消息参数不可拆散或修改</span></p>}
            readonly
          />
        </ProForm>
        <Divider style={{ margin: '0 0 20px 0' }} />
        <Title style={{ marginBottom: 10 }} level={5}>购买发货</Title>
        <ProForm<{
          remindTime:string;
          content:string
            }>
          onFinish={async (values) => {
            setVisible(true)
            setParamsType(values)
          }}
          submitter={{
            render: (props, defaultDoms) => {
                return [];
            },
            }}
          form={form7}
          formRef={formRef7}
          {...formItemLayout}
        >
          <ProFormText
            label="通知时间"
            labelCol={1}
            width={400}
            name='remindTime'
            readonly
            rules={[{ required: true, message: '请输入通知时间' }]}
          />
          <ProFormText
            name='content'
            width={800}
            label="通知文案"
            rules={[{ required: true, message: '请输入通知文案' }]}
            labelCol={5}
            extra={<p>此处设置站内信文案，<span style={{color:'#DBD0AC'}}>$(参数名)样式为消息参数不可拆散或修改</span></p>}
            readonly
          />
        </ProForm>
        <Divider style={{ margin: '0 0 20px 0' }} />
        <Title style={{ marginBottom: 10 }} level={5}>租赁发货</Title>
        <ProForm<{
          remindTime:string;
          content:string
            }>
          onFinish={async (values) => {
            setVisible(true)
            setParamsType(values)
          }}
          submitter={{
            render: (props, defaultDoms) => {
                return [];
            },
            }}
          form={form8}
          formRef={formRef8}
          {...formItemLayout}
        >
          <ProFormText
            label="通知时间"
            labelCol={1}
            width={400}
            name='remindTime'
            readonly
            rules={[{ required: true, message: '请输入通知时间' }]}
          />
          <ProFormText
            name='content'
            width={800}
            label="通知文案"
            rules={[{ required: true, message: '请输入通知文案' }]}
            labelCol={5}
            extra={<p>此处设置站内信文案，<span style={{color:'#DBD0AC'}}>$(参数名)样式为消息参数不可拆散或修改</span></p>}
            readonly
          />
        </ProForm>
        <Divider style={{ margin: '0 0 20px 0' }} />
        <p style={{color:'#F8A618',fontWeight:'bold'}}>设置完成，立即生效！</p>
        {visible && <ConfirmModel
          visible={visible}
          setVisible={setVisible}
          paramsType={paramsType}
          callback={()=>{ setParamsType(null)}}
          onClose={() =>{ setParamsType(null)}}
        />}
    </div>
    );
};