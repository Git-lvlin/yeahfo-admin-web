import React, { useEffect, useState } from 'react'
import { history } from 'umi';
import { Form, Spin, Tree,Button } from 'antd';
import Upload from '@/components/upload';
import { storeDetail } from '@/services/daifa-store-management/list'
import { arrayToTree } from '@/utils/utils'
import { categoryAll } from '@/services/common';
import moment from 'moment';
import {
  DrawerForm
} from '@ant-design/pro-form';


const formItemLayout = {
  labelCol: { span: 5 },
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

export default props => {
  const {storeNo,setVisible,visible,onClose}=props
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false);
  const [detailData, setDetailData] = useState({});
  const [treeData, setTreeData] = useState([])
  const [selectKeys, setSelectKeys] = useState([]);



  const getDetail = async (storeNo) => {
   setLoading(true);
   await storeDetail({
      storeNo
    }).then(res => {
      if (res.code === 0) {
        const ids = [];
        const businessScope=res.data.businessScope&&JSON.parse(res.data.businessScope)
        businessScope&&businessScope.forEach(item => {
          const gcId = item.gc_id2.split(',').map(item => +item).filter(item => item !== 0)
          const gcId2=[]
          gcId2.push(parseInt(item.gc_id1))
          ids.push(...gcId,...gcId2)
        })
        setSelectKeys(ids)
        setDetailData(res.data)
        form.setFieldsValue(res.data)

        categoryAll().then(res => {
          if (res.code === 0) {
            const tree = arrayToTree(res.data.records.map(item => {
              if (ids.includes(item.id)) {
                return ({
                  ...item,
                  pid: item.gcParentId,
                  title: item.gcName,
                  key: item.id,
                  value: item.id,
                  selectable: false
                })
              }
            }
            )
            )
            setTreeData(tree)
          }
        })

      }
    }).finally(() => {
      setLoading(false);
    })
  }

  useEffect(() => {
    getDetail(storeNo)
  }, [])

  return (
    <DrawerForm
      title='详情'
      visible={visible}
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
      submitter={
        {
          render: (props, defaultDoms) => {
            return [
              <Button type="default" onClick={() =>{ setVisible(false);onClose()}}>
                返回
              </Button>
            ];
          }
        }
      }
      onFinish={async (values) => {
      }}
      {...formItemLayout}
    >
      <Spin
        spinning={loading}
      >
          <Form.Item
            label="店铺名称"
          >
            {detailData.storeName}
          </Form.Item>

          <Form.Item
            label="店主姓名"
          >
            {detailData.realname}
          </Form.Item>

          <Form.Item
            label="店主手机号"
          >
            {detailData.mobile}
          </Form.Item>

          <Form.Item
            label="账户结算银行"
          >
            {detailData.bankName}
          </Form.Item>

          <Form.Item
            label="账户结算银行卡"
          >
            {detailData.bankCard}
          </Form.Item>
    
          <Form.Item
            label="身份证姓名正面照片"
            name="idFront"
          >
            <Upload disabled={true}  multiple maxCount={1} accept="image/*" size={1 * 1024} />
          </Form.Item>
          <Form.Item
            label="身份证国徽面照片"
            name="idBack"
          >
            <Upload disabled={true} multiple maxCount={1} accept="image/*" size={1 * 1024} />
          </Form.Item>
          <Form.Item
            label="手持身份证照片"
            name="idHandheld"
          >
            <Upload disabled={true} multiple maxCount={1} accept="image/*" size={1 * 1024} />
          </Form.Item>

          <Form.Item
            label="结算银行卡正面照"
            name="bankFront"
          >
            <Upload disabled={true} multiple maxCount={1} accept="image/*" size={1 * 1024} />
          </Form.Item>

          <Form.Item
            label="结算银行卡背面照"
            name="bankBack"
          >
            <Upload disabled={true} multiple maxCount={1} accept="image/*" size={1 * 1024} />
          </Form.Item>

          <Form.Item
            label="店主微信号"
          >
            {detailData.wechatNo}
          </Form.Item>

          <Form.Item
            label="店主内部岗位或身份"
          >
            {detailData.station}
          </Form.Item>

          <Form.Item
            label="店主身份证号"
          >
            {detailData.idNumber}
          </Form.Item>
          <Form.Item
            label="主营商品类型"
            name="businessScope"
          >
            {
              treeData?
              <Tree
              checkable
              style={{
                width: '100%',
              }}
              treeData={treeData}
              multiple
              height={200}
              virtual={false}
              checkedKeys={selectKeys}
              expandedKeys={selectKeys}
              disabled
            />
            :'还没有选择主营商品类型'
            }
            
          </Form.Item>

          <Form.Item
            label="状态"
          >
            {detailData.status === 1 ? '已启用' : '已禁用'}
          </Form.Item>

          <Form.Item
            label="创建人"
          >
            {detailData.adminName}
          </Form.Item>

          <Form.Item
            label="创建时间"
          >
            {moment(detailData.createTime).format('YYYY-MM-DD HH:mm:ss')}
          </Form.Item>
      </Spin> 
    </DrawerForm>
  )
}
