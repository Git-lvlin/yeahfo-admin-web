import React, { useState, useRef,useEffect } from 'react';
import { Input, Form, message,Button,InputNumber} from 'antd';
import { EditableProTable } from '@ant-design/pro-table';
import { addConfig,updateConfig,findById,configTest,findFunctions } from '@/services/resource'
import ProForm, { ProFormText,DrawerForm,ProFormRadio,ProFormDateTimeRangePicker,ProFormTextArea,ProFormDependency,ProFormSelect } from '@ant-design/pro-form';
import DiscountsModel from './discounts-model'
import { PageContainer } from '@/components/PageContainer';
import { history,connect } from 'umi';
import styles from './style.less'
const { TextArea } = Input;

const formItemLayout = {
  labelCol: { span:3 },
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

  const data=[
    {
      id:1,
      sourceField:'',
      destField:'',
      functionName:'',
      format:'',
      express:'',
      isMandary:''
    }
  ]
  const data2=[
    {
      id:1,
      dataCode:'',
      sql:'',
      orderNo:'',
      resultType:'',
      express:'',
      remark:''
    }
  ]
  const data3=[
    {
      id:1,
      sourceField:'',
      destField:'',
      functionName:'',
      format:'',
      express:''
    }
  ]


export default (props) =>{
  const {setVisible,visible,onClose,callback,id,edtil,edit}=props
  const [dataSource, setDataSource] = useState(data);
  const [dataSource2, setDataSource2] = useState(data2);
  const [dataSource3, setDataSource3] = useState(data3);
  const [editableKeys, setEditableRowKeys] = useState(() =>data.map((item) => item.id));
  const [editableKeys2, setEditableRowKeys2] = useState(() =>data2.map((item) => item.id));
  const [editableKeys3, setEditableRowKeys3] = useState(() =>data3.map((item) => item.id));
  const [onselect,setOnselect]=useState([])
  const [form] = Form.useForm();
  const [boardData,setBoardData]=useState()
  const [discountsvisible, setDiscountsVisible] = useState(false);
  useEffect(() => {
    findFunctions({}).then(res=>{
      const data={}
      res.data.map((ele)=>(
        data[ele.functionName]=ele.name
      ))
      setOnselect(data)
    })
    if(id){
      findById({id:id}).then(res=>{
          setBoardData(res.data)
          if(edit){
            setEditableRowKeys(res.data?.requestFormatList?.map((item,index) => index))
            setEditableRowKeys2(res.data?.sqlConfigs?.map((item,index) => index))
            setEditableRowKeys3(res.data?.responseFormatList?.map((item,index) => index))
          }
          setDataSource(res.data?.requestFormatList.map(ele=>({
            destField:ele.destField,
            express:ele.express,
            format:ele.format,
            functionName:ele.functionName,
            sourceField:ele.sourceField,
            isMandary:`${ele.isMandary}`,
          })))
          setDataSource2(res.data?.sqlConfigs.map(ele=>(
            {
              dataCode:ele.dataCode,
              sql:ele.sql,
              resultType:`${ele.resultType}`,
              orderNo:ele.orderNo,
              express:ele.express,
              remark:ele.remark
              }
            )))
          setDataSource3(res.data?.responseFormatList)
          form.setFieldsValue({
            ...res.data
          })
      })
    }
  }, [])
  const onsubmit=values=>{
    const {...rest}=values
    const params={
      requestFormatList:dataSource,
      sqlConfigs:dataSource2,
      responseFormatList:dataSource3,
      ...rest
    }
    if(dataSource?.length==0){
      delete params.requestFormatList
    }
    if(dataSource2?.length==0){
      delete params.sqlConfigs
    }
    if(dataSource3?.length==0){
      delete params.responseFormatList
    }
    if(id){
      updateConfig({id:id,...params}).then(res=>{
        if(res.code==0){
          message.success('编辑成功');
        }
      })
    }else{
      addConfig(params).then(res=>{
        if(res.code==0){
          message.success('添加成功');
        }
      })
    }
  }
  const checkConfirm = (rule, value, callback) => {
    return new Promise(async (resolve, reject) => {
      if (value&&/[\u4E00-\u9FA5]/g.test(value)) {
        await reject('编码不能输入汉字!')
      } else {
        await resolve()
      }
    })
  }
  const columns = [
    {
      title: '源字段',
      dataIndex: 'sourceField',
    },
    {
      title: '目标字段',
      dataIndex: 'destField',
      valueType: 'text',
    },
    {
      title: '转换函数',
      dataIndex: 'functionName',
      valueType: 'select',
      valueEnum: onselect,
      fieldProps: {
        placeholder: '请选择'
      },
    },
     {
      title: '转换参数',
      dataIndex: 'format',
      valueType: 'text',
    },
    {
      title: '条件',
      dataIndex: 'express',
      valueType: 'text',
      width:300
    },
    {
      title: '是否必填',
      dataIndex: 'isMandary',
      valueType: 'select',
      valueEnum: {
        false: '否',
        true: '是',
      },
      fieldProps: {
        placeholder: '请选择'
      },
      width:150
    },
    {
      title: '操作',
      valueType: 'text',
      width: 200,
      render: (text, record, _, action) => [
        <a
          key="delete"
          onClick={() => {
            setDataSource(dataSource.filter((item) => item!== record));
          }}
        >
          删除
        </a>,
      ],
      hideInTable:id&&edtil?true:false,
      editable:false,
    },
  ];
  const columns2 = [
    {
      title: '数据集编码',
      dataIndex: 'dataCode',
      width:200
    },
    {
      title: 'SQL',
      dataIndex: 'sql',
      valueType: 'text',
      renderFormItem: (_,r) => {
        return  <TextArea
                    name="sql"
                />
        },
      render: (_,r) =>{
        return <p>{_}</p>
      }
    },
    {
      title: '顺序',
      dataIndex: 'orderNo',
      valueType: 'text',
      width:120
    },
    {
      title: '数据类型',
      dataIndex: 'resultType',
      valueType: 'select',
      valueEnum: {
        1: 'Value',
        2: 'Map',
        3: 'List',
        4: 'Page',
      },
      fieldProps: {
        placeholder: '请选择'
      },
      width:150
    },
    {
      title: '条件',
      dataIndex: 'express',
      valueType: 'text',
      width:300
    },
    {
      title: '备注',
      dataIndex: 'remark',
      valueType: 'text',
      width:120
    },
    {
      title: '操作',
      valueType: 'text',
      width: 200,
      render: (text, record, _, action) => [
        <a
          key="delete"
          onClick={() => {
            setDataSource2(dataSource2.filter((item) => item!== record));
          }}
        >
          删除
        </a>,
      ],
      hideInTable:id&&edtil?true:false,
      editable:false,
    },
  ];
  const columns3 = [
    {
      title: '源字段',
      dataIndex: 'sourceField',
    },
    {
      title: '目标字段',
      dataIndex: 'destField',
      valueType: 'text',
    },
    {
      title: '转换函数',
      dataIndex: 'functionName',
      valueType: 'select',
      valueEnum: onselect,
      fieldProps: {
        placeholder: '请选择'
      },
    },
     {
      title: '转换参数',
      dataIndex: 'format',
      valueType: 'text',
    },
    {
      title: '条件',
      dataIndex: 'express',
      valueType: 'text',
      width:300
    },
    {
      title: '操作',
      valueType: 'text',
      width: 200,
      render: (text, record, _, action) => [
        <a
          key="delete"
          onClick={() => {
            setDataSource3(dataSource3.filter((item) => item!== record));
          }}
        >
          删除
        </a>,
      ],
      hideInTable:id&&edtil?true:false,
      editable:false,
    },
  ];
  return (
    <PageContainer>
        <DrawerForm
          title='数据报表配置'
          form={form}
          onVisibleChange={setVisible}
          visible={visible}
          width={1400}
          drawerProps={{
            forceRender: true,
            destroyOnClose: true,
            onClose: () => {
              onClose();
            }
          }}
          submitter={{
            render: (props, doms) => {
              return [
              <div key='sub'>
              {
                edtil?null:
                <>
                <Button 
                  style={{marginLeft:'250px'}} 
                  type="primary"  
                  key='discount' 
                  onClick={()=>setDiscountsVisible(true)}
                  > 
                  测试 
                </Button>
                <Button style={{margin:'30px'}} type="primary" key="submit" onClick={() => {
                  props.form?.submit?.()
                }}>
                  保存
                </Button>
                </>
              }
              </div>,
              <Button style={{marginLeft:'80px'}} type="default" key="goback" onClick={() => {
                setVisible(false)
                onClose()
              }}>
                返回
              </Button>
              ];
            }
          }} 
          onFinish={async (values)=>{
           await  onsubmit(values);
          }}
          className={styles.data_board_configuration}
        {...formItemLayout}
      >
        <ProFormText
            width="md"
            name="reportCode"
            label="接口编码"
            placeholder="输入接口编码"
            rules={[
              { required: true, message: '请输入接口编码' },
              {validator: checkConfirm}
            ]}
            readonly={id&&edtil}
          />
          <ProFormText
            width="md"
            name="remark"
            label="接口说明"
            placeholder="输入接口说明"
            rules={[{ required: true, message: '请输入接口说明' }]}
            readonly={id&&edtil}
        />


          <EditableProTable
            headerTitle="入参格式化"
            columns={columns}
            rowKey="id"
            controlled
            recordCreatorProps={id&&edtil?false:{
              newRecordType: 'dataSource',
              record: () => ({
                id: Date.now(),
              }),
            }}
            value={dataSource}
            onChange={setDataSource}
            editable={{
              type: 'multiple',
              editableKeys:id&&edtil?[]:editableKeys,
              actionRender: (row, config, defaultDoms) => {
                return [defaultDoms.delete];
              },
              onValuesChange: (record, recordList) => {
                setDataSource(recordList);
              },
              onChange: setEditableRowKeys,
            }}
            className={styles.back}
          /> 


          <EditableProTable
            headerTitle="SQL配置"
            columns={columns2}
            rowKey="id"
            recordCreatorProps={id&&edtil?false:{
              newRecordType: 'dataSource',
              record: () => ({
                id: Date.now(),
              }),
            }}
            controlled
            value={dataSource2}
            onChange={setDataSource2}
            editable={{
              type: 'multiple',
              editableKeys:id&&edtil?[]:editableKeys2,
              actionRender: (row, config, defaultDoms) => {
                return [defaultDoms.delete];
              },
              onValuesChange: (record, recordList) => {
                setDataSource2(recordList);
              },
              onChange: setEditableRowKeys2,
            }}
            className={styles.back}
          /> 


          <EditableProTable
            headerTitle="出参格式化"
            columns={columns3}
            rowKey="id"
            recordCreatorProps={id&&edtil?false:{
              newRecordType: 'dataSource',
              record: () => ({
                id: Date.now(),
              }),
            }}
            controlled
            value={dataSource3}
            onChange={setDataSource3}
            editable={{
              type: 'multiple',
              editableKeys:id&&edtil?[]:editableKeys3,
              actionRender: (row, config, defaultDoms) => {
                return [defaultDoms.delete];
              },
              onValuesChange: (record, recordList) => {
                setDataSource3(recordList);
              },
              onChange: setEditableRowKeys3,
            }}
            className={styles.back}
          /> 
          {
            id&&edtil?
             <Form.Item
              label="响应模板（FreeMarKer）"
              rules={[{ required: true, message: '请填写模板' }]}
              >
              <pre className={styles.line_feed}>
                {
                  boardData?.responseTemplate
                }
              </pre>
              </Form.Item>
           :
           <ProFormTextArea
              name="responseTemplate"
              label="响应模板（FreeMarKer）"
              rules={[{ required: true, message: '请填写模板' }]}
              placeholder="请输入"
              readonly={id&&edtil}
            />
          }
          {discountsvisible&&<DiscountsModel
            setVisible={setDiscountsVisible}
            visible={discountsvisible}
          />
          }
      </DrawerForm>
    </PageContainer>
  )
}
