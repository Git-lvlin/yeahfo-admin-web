import React, { useEffect, useState } from 'react'
import { PageContainer } from '@/components/PageContainer';
import { useParams, history } from 'umi';
import { Form, Spin, Tree, Button } from 'antd';
import { detailExt } from '@/services/supplier-management/supplier-list'
import { arrayToTree } from '@/utils/utils'

const formItemLayout = {
  labelCol: { span: 10 },
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

const SupplierDetail = () => {
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [detailData, setDetailData] = useState({});
  const [treeData, setTreeData] = useState([])
  const [selectKeys, setSelectKeys] = useState([]);



  const getDetail = (id) => {
    setLoading(true);
    detailExt({
      supplierId: id
    }).then(res => {
      if (res.code === 0) {
        setDetailData(res.data.records)
        setTreeData(arrayToTree(res.data.records.gcInfo.map(item => ({ ...item, pid: item.gcParentId, title: item.gcName, key: item.id, value: item.id, selectable: false }))))
        setSelectKeys(res.data.records.gcInfo.map(item => item.id))
      }
    }).finally(() => {
      setLoading(false);
    })
  }

  useEffect(() => {
    getDetail(params.id)
  }, [])

  return (
    <PageContainer>
      <Spin
        spinning={loading}
      >
        <Form
          {...formItemLayout}
          style={{ backgroundColor: '#fff', paddingTop: 50, paddingBottom: 100 }}
        >
          <Form.Item
            label="供应商家ID"
          >
            {detailData.supplierId}
          </Form.Item>
          <Form.Item
            label="供应商家名称"
          >
            {detailData.companyName}
          </Form.Item>

          <Form.Item
            label="供应商家登录账号"
          >
            {detailData.accountName}
          </Form.Item>

          <Form.Item
            label="负责人"
          >
            {detailData.companyUserName}
          </Form.Item>

          <Form.Item
            label="负责人手机号"
          >
            {detailData.companyUserPhone}
          </Form.Item>

          <Form.Item
            label="主营商品类型"
            name="gc"
          >
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
          </Form.Item>

          <Form.Item
            label="状态"
          >
            {detailData.status === 1 ? '已启用' : '已禁用'}
          </Form.Item>
          <Form.Item
            label="创建人"
          >
            {detailData.operateName}
          </Form.Item>
          <Form.Item
            label="创建时间"
          >
            {detailData.createTime}
          </Form.Item>
          <div style={{ marginTop: 30, textAlign: 'center' }}>
            <Button onClick={() => { window.history.back(); setTimeout(() => { window.location.reload(); }, 200) }}>返回</Button>
          </div>
        </Form>

      </Spin>

    </PageContainer>
  )
}


export default SupplierDetail
