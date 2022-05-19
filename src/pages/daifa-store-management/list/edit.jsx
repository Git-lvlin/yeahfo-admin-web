import React, { useState, useEffect, useRef } from 'react';
import { Form, Tree, message, Checkbox } from 'antd';
import {
  DrawerForm,
  ProFormText,
  ProFormRadio,
  ProFormSelect
} from '@ant-design/pro-form';
import Upload from '@/components/upload';
import {  storeList,storeAdd, storeEdit } from '@/services/daifa-store-management/list';
import { getBanks } from '@/services/supplier-management/supplier-list';
import { categoryAll } from '@/services/common';
import { arrayToTree } from '@/utils/utils'


const CTree = (props) => {
  const { value, onChange, treeData, data, keys, ...rest } = props;
  const [selectKeys, setSelectKeys] = useState(keys);
  const [selectAll, setSelectAll] = useState(false);
  const onSelectAll = ({ target }) => {
    const { checked } = target;
    if (checked) {
      setSelectKeys(data.map(item => item.id));
      onChange(data.map(item => item.id))

    } else {
      setSelectKeys([]);
      onChange([])
    }
    setSelectAll(checked);
  }

  const onCheck = (checkedKeys) => {
    setSelectKeys(checkedKeys)
    onChange(checkedKeys)
    setSelectAll(!treeData.some(item => {
      return !checkedKeys.includes(item.key);
    }))
  }

  useEffect(() => {
    onChange(keys)
  }, [])

  return (
    <div style={{ flex: 1 }}>
      <Checkbox
        onChange={onSelectAll}
        checked={selectAll}
        style={{ marginLeft: 23, marginBottom: 5 }}
      >
        全部分类
      </Checkbox>
      <Tree
        {...rest}
        treeData={treeData}
        onCheck={onCheck}
        checkedKeys={selectKeys}
      />
    </div>

  )
}

export default (props) => {
  const { visible, setVisible, detailData, callback = () => { }, onClose = () => { } } = props;
  const [form] = Form.useForm()
  const [treeData, setTreeData] = useState([])
  const [selectKeys, setSelectKeys] = useState([]);
  const [dataList,setDataList]=useState([])
  const originData = useRef([])

  const formItemLayout = {
    labelCol: { span: 6},
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

  const submit = (values) => {
    const { password, gc, ...rest } = values;
    return new Promise((resolve, reject) => {
      const apiMethod = detailData ? storeEdit : storeAdd;

      const obj = {};
      let gcArr = []
      if (gc?.length) {
        const parentIds = [];

        gc.forEach(element => {
          originData.current.forEach(it => {
            if (it.id === element) {
              parentIds.push(it.gcParentId)
            }
          })
        });

        const gcData = [...new Set([...gc, ...parentIds].filter(item => item !== 0))]
        gcData.forEach(item => {
          const findItem = originData.current.find(it => item === it.id);
          const { gcParentId, id } = findItem;
          if (gcParentId== 0) {
            if (obj[id]) {
              obj[id].push(gcParentId)  
            } else {
              obj[id] = [gcParentId];
            }
          }
          if (gcParentId!== 0) {
            if (obj[gcParentId]) {
              obj[gcParentId].push(id)  
            } else {
              obj[gcParentId] = [id];
            }
        }

        })

        for (const key in obj) {
          if (Object.hasOwnProperty.call(obj, key)) {
            const g = { gc_id1: key };
            if (obj[key].length>=2) {
              g.gc_id2 = obj[key].filter(item => item !== 0).join(',')
            } else {
              g.gc_id2 ="0"
            }
            gcArr.push(g)
          }
        }

      } else { 
        gcArr = ''
      }
      apiMethod({
        ...rest,
        storeNo:detailData&&detailData.storeNo,
        bankCode:values.bankCode&&values.bankCode.key,
        bankName:values.bankCode&&values.bankCode.label,
        businessScope: JSON.stringify(gcArr),
      }, { showSuccess: true }).then(res => {
        if (res.code === 0) {
          resolve();
          callback();
        } else {
          reject();
          message.error(res.msg);
        }
      })
    });
  }

  //店铺认证
  const verifyStoreName=(rule,value,callback)=>{
    return new Promise((resolve, reject) => {
      dataList.map(ele=>{
        if(!detailData){
          if(ele.storeName==value){
            reject(`店铺名称已存在，请重新输入`);
          }
        }else if(value&&value.length>30){
            reject('店铺名称不超过30个字符')
          }

        if(detailData&&detailData.storeName!=value){
            if(ele.storeName==value){
              reject(`店铺名称已存在，请重新输入`);
            }
        }else if(value&&value.length>30){
          reject('店铺名称不超过30个字符')
        }
      })
          resolve()
  })
}
  //店主认证
  const verifyRealname=(rule,value,callback)=>{
    return new Promise((resolve, reject) => {
    dataList.map(ele=>{
      if(!detailData){
        if(ele.realname==value){
          reject(`店主姓名已存在，请重新输入`);
        }else if(value&&value.length>30){
          reject('店主姓名不超过30个字符')
        }    
      }
    })

    resolve()
  })
}
  //手机验证
  const verifyMobile=(rule,value,callback)=>{
    return new Promise((resolve, reject) => {
      dataList.map(ele=>{
        if(!detailData){
          if(ele.mobile==value){
            reject(`手机号已存在，请重新输入`);
          }
        }
      })
    resolve()
  })
}
  useEffect(() => {
    if (detailData) {
      form.setFieldsValue({
        ...detailData
      })
      const ids = [];
      const businessScope = detailData.businessScope&&JSON.parse(detailData.businessScope);
      businessScope&&businessScope.forEach(item => {
        const gcId = item.gc_id2.split(',').map(item => +item).filter(item => item !== 0)
        const gcId2=[]
        gcId2.push(parseInt(item.gc_id1))
          ids.push(...gcId)
      })
      setSelectKeys(ids)
    }
    categoryAll()
      .then(res => {
        if (res.code === 0) {
          originData.current = res.data.records;
          const tree = arrayToTree(res.data.records.map(item => ({
            ...item,
            pid: item.gcParentId,
            title: item.gcName,
            key: item.id,
            value: item.id,
            selectable: false
          })))
          setTreeData(tree)
        }
      })
      storeList({}).then(res=>{
        setDataList(res.data)
      })
  }, []);
  return (
    <DrawerForm
      title={`${detailData ? '编辑' : '新建'}`}
      onVisibleChange={setVisible}
      drawerProps={{
        forceRender: true,
        destroyOnClose: true,
        width: 800,
        onClose: () => {
          onClose();
        }
      }}
      form={form}
      onFinish={async (values) => {
        await submit(values);
        return true;
      }}
      visible={visible}
      initialValues={{
        status: 1,
      }}
      {...formItemLayout}
    >
      <ProFormText
        name="storeName"
        label="店铺名称"
        placeholder="请输入店铺名称"
        rules={[
            { required: true, message: '请输入店铺名称' },
            { validator:verifyStoreName}
        ]}
      />
      <ProFormText
        name="realname"
        label="店主姓名"
        placeholder="请输入店主姓名"
        rules={[
          { required: true, message: '请输入店主姓名' },
          { validator:verifyRealname}
        ]}
        disabled={!!detailData}
      />
      <ProFormText
        name="mobile"
        label="店主手机号码"
        placeholder="请输入店主手机号码"
        rules={[
            { required: true, message: '请输入店主手机号码' },
            { validator:verifyMobile}
        ]}
        fieldProps={{
          maxLength: 11,
        }}
        disabled={!!detailData}
      />
       <ProFormText
        name="idNumber"
        label="店主身份证号"
        placeholder="请输入店主身份证号"
        rules={[{ required: true, message: '请输入店主身份证号' }]}
        fieldProps={{
          maxLength: 18,
        }}
        disabled={!!detailData}
      />
      {
        detailData?
        null:
        <ProFormSelect
          name="bankCode"
          label="账户结算银行"
          placeholder="请选择结算收款银行"
          request={getBanks}
          rules={[{ required: true, message: '请选择账户结算银行' }]}
          fieldProps={{
            labelInValue: true,
          }}
        />
      }
      
      {
        detailData?
        null:
        <ProFormText
          name="bankCard"
          label="结算银行卡号"
          placeholder="请输入结算银行卡号"
          rules={[{ required: true, message: '请输入结算银行卡号' }]}
          fieldProps={{
            maxLength: 16,
          }}
      />
      }
      
      {
        detailData?
        null:
        <ProFormText
          name="bankUserName"
          label="结算银行卡开户名"
          placeholder="请输入结算银行卡开户名"
          rules={[{ required: true, message: '请输入结算银行卡开户名' }]}
      />
      }
       
      <Form.Item
        label="身份证姓名正面照片"
        name="idFront"
        rules={[{ required: true }]}
        tooltip={
          <dl>
            <dt>图片要求</dt>
            <dd>1.图片大小1MB以内</dd>
            <dd>2.图片格式png/jpg/gif</dd>
          </dl>
        }
        extra="1.图片大小1MB以内 2.图片格式png/jpg/gif"
      >
        <Upload code={304} disabled={!!detailData} multiple maxCount={1} accept="image/*" size={1 * 1024} />
      </Form.Item>
      <Form.Item
        label="身份证国徽面照片"
        name="idBack"
        tooltip={
          <dl>
            <dt>图片要求</dt>
            <dd>1.图片大小1MB以内</dd>
            <dd>2.图片格式png/jpg/gif</dd>
          </dl>
        }
        rules={[{ required: true }]}
        extra="1.图片大小1MB以内 2.图片格式png/jpg/gif"
      >
        <Upload code={304} disabled={!!detailData} multiple maxCount={1} accept="image/*" size={1 * 1024} />
      </Form.Item>
      <Form.Item
        label="手持身份证照片"
        name="idHandheld"
        rules={[{ required: true }]}
        tooltip={
          <dl>
            <dt>图片要求</dt>
            <dd>1.图片大小1MB以内</dd>
            <dd>2.图片格式png/jpg/gif</dd>
          </dl>
        }
        extra="1.图片大小1MB以内 2.图片格式png/jpg/gif"
      >
        <Upload code={304} disabled={!!detailData} multiple maxCount={1} accept="image/*" size={1 * 1024} />
      </Form.Item>
      {
         detailData?
         null:
         <Form.Item
          label="结算银行卡正面照"
          name="bankFront"
          rules={[{ required: true }]}
          tooltip={
            <dl>
              <dt>图片要求</dt>
              <dd>1.图片大小1MB以内</dd>
              <dd>2.图片格式png/jpg/gif</dd>
            </dl>
          }
          extra="1.图片大小1MB以内 2.图片格式png/jpg/gif"
        >
          <Upload code={304} disabled={!!detailData} multiple maxCount={1} accept="image/*" size={1 * 1024} />
        </Form.Item>
      }
      
      {
        detailData?
        null:
        <Form.Item
          label="结算银行卡背面照"
          name="bankBack"
          rules={[{ required: true }]}
          tooltip={
            <dl>
              <dt>图片要求</dt>
              <dd>1.图片大小1MB以内</dd>
              <dd>2.图片格式png/jpg/gif</dd>
            </dl>
          }
          extra="1.图片大小1MB以内 2.图片格式png/jpg/gif"
        >
          <Upload code={304} disabled={!!detailData} multiple maxCount={1} accept="image/*" size={1 * 1024} />
        </Form.Item>
      }
     
      <ProFormText
        name="wechatNo"
        label="微信号"
        placeholder="请输入微信号"
        rules={[
          { validator:(rule,value,callback)=>{
            return new Promise(async (resolve, reject) => {
            if(value&&value.length>20){
              await reject('微信号不超过20个字符')
            }else {
              await resolve()
          }
          })
        }}
        ]}
      />
      <ProFormText
        name="station"
        label="店主内部岗位或身份"
        placeholder="请输入店主内部岗位或身份"
        rules={[
          { validator:(rule,value,callback)=>{
            return new Promise(async (resolve, reject) => {
            if(value&&value.length>30){
              await reject('岗位或身份不超过30个字符')
            }else {
              await resolve()
          }
          })
        }}
        ]}
      />
      <ProFormText
        name="remark"
        label="备注"
        placeholder="请输入备注"
        rules={[
          { validator:(rule,value,callback)=>{
            return new Promise(async (resolve, reject) => {
            if(value&&value.length>100){
              await reject('备注不超过100个字符')
            }else {
              await resolve()
          }
          })
        }}
        ]}
      />

      <Form.Item
        label="主营商品类型"
        name="gc"
      >
        <CTree
          checkable
          style={{
            width: '100%',
          }}
          treeData={treeData}
          multiple
          height={200}
          data={originData.current}
          virtual={false}
          keys={selectKeys}
        />
      </Form.Item>

      <ProFormRadio.Group
        name="status"
        label="状态"
        rules={[{ required: true }]}
        options={[
          {
            label: '启用',
            value: 1,
          },
          {
            label: '禁用',
            value: 2,
          }
        ]}
      />
    </DrawerForm>
  );
};