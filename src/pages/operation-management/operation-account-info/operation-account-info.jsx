import React, { useEffect, useState } from 'react'
import { PageContainer } from '@/components/PageContainer';
import { useParams, history } from 'umi';
import { Form, Spin, Image, Space, Button } from 'antd';
import { detailExt } from '@/services/supplier-management/supplier-list'
import { arrayToTree } from '@/utils/utils'
import moment from 'moment';

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

  const getDetail = (id) => {
    setLoading(true);
    detailExt({
      supplierId: id
    }).then(res => {
      if (res.code === 0) {
        setDetailData(res.data.records)
        // setTreeData(arrayToTree(res.data.records.gcInfo.map(item => ({ ...item, pid: item.gcParentId, title: item.gcName, key: item.id, value: item.id, selectable: false }))))
        // setSelectKeys(res.data.records.gcInfo.map(item => item.id))
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
            label="供应商家名称"
          >
            {detailData.companyName}
          </Form.Item>

          <Form.Item
            label="企业地址"
          >
            {detailData?.bankAccountInfo?.companyAddress}
          </Form.Item>

          <Form.Item
            label="统一社会信用代码"
          >
            <span style={{ marginRight: 20 }}>{detailData?.bankAccountInfo?.socialCreditCode}</span>
            有效期至：{moment(detailData?.bankAccountInfo?.socialCreditCodeExpire).format('YYYY-MM-DD')}
          </Form.Item>

          <Form.Item
            label="经营范围"
          >
            {detailData?.bankAccountInfo?.businessScope}
          </Form.Item>

          <Form.Item
            label="法人身份信息"
          >
            <span style={{ marginRight: 20 }}>{detailData?.bankAccountInfo?.legalName}</span>
            <span style={{ marginRight: 20 }}>{detailData?.bankAccountInfo?.legalIdCardNo}</span>
            有效期至：{moment(detailData?.bankAccountInfo?.socialCreditCodeExpire).format('YYYY-MM-DD')}
          </Form.Item>
          <Form.Item
            label="法人手机号"
          >
            {detailData?.bankAccountInfo?.legalPhone}
          </Form.Item>
          <Form.Item
            label="账户结算银行"
          >
            {detailData?.bankAccountInfo?.bankName}
          </Form.Item>
          <Form.Item
            label="结算银行账户类型"
          >
            {{ 1: '对公账户', 2: '对私账户' }[detailData?.bankAccountInfo?.bankAccountType]}
          </Form.Item>
          <Form.Item
            label="结算银行卡号"
          >
            {detailData?.bankAccountInfo?.bankCardNo}
          </Form.Item>
          <Form.Item
            label="结算银行卡开户名"
          >
            {detailData?.bankAccountInfo?.bankAccountName}
          </Form.Item>
          <Form.Item
            label="开户资质文件"
          >
            <Space style={{ display: 'flex' }}>
              <Image src={detailData?.bankAccountInfo?.businessLicense?.[0]} width={100} height={100} />
              <Image src={detailData?.bankAccountInfo?.idCardFrontImg?.[0]} width={100} height={100} />
            </Space>
            <Space style={{ display: 'flex' }}>
              <Image src={detailData?.bankAccountInfo?.idCardBackImg?.[0]} width={100} height={100} />
              <Image src={detailData?.bankAccountInfo?.bankLicenseImg?.[0]} width={100} height={100} />
            </Space>
          </Form.Item>

          <div style={{textAlign: 'center', marginTop: 100}}>
            <Button type="primary" onClick={() => { window.history.back(); setTimeout(() => { window.location.reload(); }, 200) }}>返回</Button>
          </div>
        </Form>

        
      </Spin>

    </PageContainer>
  )
}


export default SupplierDetail
