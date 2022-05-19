import React, { useRef, useEffect, useState } from 'react';
import { message, Form,Transfer } from 'antd';
import ProForm, { ModalForm,ProFormRadio } from '@ant-design/pro-form';
import { settingRecommend,recommendArticleList } from '@/services/business-school/find-admin-article-list';


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
  const { setVisible, visible,callback } = props;
  const formRef = useRef();
  const [form] = Form.useForm()
  const [mockData,setMockData]=useState([])
  const [targetKeys, setTargetKeys] = useState([]);
  const [formLayout, setFormLayout] = useState(2);
  const [formLayout2, setFormLayout2] = useState(1);
  useEffect(() => {
    recommendArticleList({storeType:formLayout2==1?formLayout2:formLayout||2}).then(res=>{
      setMockData(res.data.map(ele=>(
        {key:ele.id,title:ele.articleTitle,description:ele.isRecommend}
      )))
      if(res.code==0){
        setTargetKeys(res.data.filter(item => item.isRecommend==1).map(item => item.id))
      }
    })
    
  }, [form,formLayout,formLayout2])

  const [selectedKeys, setSelectedKeys] = useState([]);
  const onChange = (nextTargetKeys, direction, moveKeys) => {
      setTargetKeys(nextTargetKeys);
  };
  
  const onSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
      setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
  };

  const onsubmit = () => {
    return new Promise((resolve,reject) => {
      if(targetKeys.length<=6){
        settingRecommend({ids:targetKeys,storeType:formLayout2==1?formLayout2:formLayout}).then((res) => {
          if (res.code === 0) {
            resolve(true);
            callback(true)
          }
        })
      }else{
        message.error('首页最多6篇')
            reject(false);
      }
    });
  };

  return (
    <ModalForm
      title={<p>设置展示到店铺管理页<span style={{color:"#CACACA",fontSize:'10px'}}>将要展示到店铺管理页的文章加入右侧</span></p>}
      onVisibleChange={setVisible}
      formRef={formRef}
      visible={visible}
      form={form}
      onFinish={async () => {
        await onsubmit();
        message.success('设置成功');
        // 不返回不会关闭弹框
        return true;
      }}
      {...formItemLayout}
    >
       <ProFormRadio.Group
        style={{
          margin: 16,
        }}
        label="文章展示性质"
        radioType="button"
        fieldProps={{
          value: formLayout2,
          onChange: (e) => setFormLayout2(e.target.value),
        }}
        options={[
          {
              label:'所有店都展示的文章',
              value: 1,
          },
          {
              label: '指定店铺才展示的文章',
              value: 0,
          }
        ]}
      />
      {
         formLayout2==0&&<ProFormRadio.Group
               style={{
                 margin: 16,
               }}
               label="设置店铺类型"
               radioType="button"
               fieldProps={{
                 value: formLayout,
                 onChange: (e) => setFormLayout(e.target.value),
               }}
               options={[
                 {
                     label:'社区店',
                     value: 2,
                 },
                 {
                     label: '内部店',
                     value: 3,
                 },
                 {
                     label: '自营店',
                     value: 4,
                 }
             ]}
           />
      }
      <Transfer
        dataSource={mockData}
        titles={['文章列表', '首页文章']}
        targetKeys={targetKeys}
        selectedKeys={selectedKeys}
        onChange={onChange}
        showSelectAll={false}
        onSelectChange={onSelectChange}
        operations={['加入右侧 ', '加入左侧']}
        render={item => item.title}
      />
      {
        targetKeys.length>6&&<p style={{color:'red',paddingLeft:'390px'}}>首页最多6篇</p>
      }
    </ModalForm>
  );
};