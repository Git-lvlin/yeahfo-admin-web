import React, { useState, useEffect } from 'react';
import { Drawer, Typography, Form, Space, Image, Button } from 'antd';
import { detailExt, getSubsidiary } from '@/services/operation-management/operation-list'

import { auditAccount } from '@/services/operation-management/audit-list'
import moment from 'moment';
import Reject from './reject';


const { Title } = Typography;

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
  layout: {
    labelCol: {
      span: 4,
    },
    wrapperCol: {
      span: 14,
    },
  }
};

const Detail = (props) => {
  const { visible, setVisible, id, supId, callback } = props;
  const [detailData, setDetailData] = useState({});
  const [rejectVisible, setRejectVisible] = useState(false);
  const [companyNameData, setCompanyNameData] = useState([])

  const getDetail = () => {
    detailExt({
      operationId: supId
    }).then(res => {
      if (res.code === 0) {
        setDetailData({
          ...res.data,
        })
      }
    })
  }

  const audit = (auditStatus, auditReason) => {
    auditAccount({
      id,
      auditStatus,
      auditReason,
    }, { showSuccess: true })
      .then(res => {
        if (res.code === 0) {
          callback();
          setVisible(false)
        }
      })
  }

  useEffect(() => {
    getDetail();
    getSubsidiary()
      .then(res => {
        if (res.code === 0) {
          setCompanyNameData(res.data)
        }
      })
  }, [])

  return (
    <Drawer
      title="审核详情"
      width={1200}
      placement="right"
      onClose={() => { setVisible(false) }}
      visible={visible}
      footer={
        <div style={{ textAlign: 'right' }}>
          <Space>
            <Button onClick={() => { setVisible(false) }}>取消</Button>
            <Button onClick={() => { setRejectVisible(true) }} type="danger">审核拒绝</Button>
            <Button onClick={() => { audit(1) }} type="primary">审核通过去开户</Button>
          </Space>
        </div>
      }
    >
      <Form
        {...formItemLayout}
      >
        <Title level={4}>基本信息</Title>
        <div style={{ display: 'flex' }}>
          <div style={{ flex: 1 }}>
            <Form.Item
              label="运营商名称"
            >
              {detailData.companyName}
            </Form.Item>
            <Form.Item
              label="运营商登录账号"
            >
              {detailData.accountName}
            </Form.Item>
            <Form.Item
              label="运营商联系人"
            >
              {detailData.companyUserName}
            </Form.Item>
            <Form.Item
              label="所属分公司"
            >
              {companyNameData.find(v => v.id === detailData.subsidiaryId)?.companyName}
            </Form.Item>
          </div>
          <div style={{ flex: 1 }}>
            <Form.Item
              label="联系人手机号"
            >
              {detailData.companyUserPhone}
            </Form.Item>
            <Form.Item
              label="运营商所管辖区域"
            >
              {detailData.provinceName}{detailData.cityName}{detailData.areaName}
            </Form.Item>
            <Form.Item
              label="是否需要开户认证"
            >
              {detailData.accountSwitch === 1 ? '需要' : '不需要'}
            </Form.Item>
          </div>
        </div>
        <Title level={4}>运营商资金账户信息</Title>
        <div style={{ display: 'flex' }}>
          <div style={{ flex: 1 }}>
            <Form.Item
              label="运营商名称"
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
              label="结算银行卡开户名"
            >
              {detailData?.bankAccountInfo?.bankAccountName}
            </Form.Item>
          </div>
          <div style={{ flex: 1 }}>
            <Form.Item
              label="法人身份信息"
            >
              <span style={{ marginRight: 20 }}>{detailData?.bankAccountInfo?.legalName}</span>
              <span style={{ marginRight: 20 }}>{detailData?.bankAccountInfo?.legalIdCardNo}</span>
              有效期至：{moment(detailData?.bankAccountInfo?.legalIdCardExpire).format('YYYY-MM-DD')}
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
          </div>
        </div>
        <div style={{ display: 'flex' }}>
          <div style={{ flex: 1 }}>
            <Form.Item
              label="开户资质文件"
            >
              <Space style={{ display: 'flex' }}>
                <Image src={detailData?.bankAccountInfo?.businessLicense?.[0]} width={150} height={150} />
                <Image src={detailData?.bankAccountInfo?.idCardFrontImg?.[0]} width={150} height={150} />
                <Image src={detailData?.bankAccountInfo?.idCardBackImg?.[0]} width={150} height={150} />
              </Space>
              <Space style={{ display: 'flex' }}>
                {detailData?.bankAccountInfo?.bankLicenseImg?.[0] && <Image src={detailData?.bankAccountInfo?.bankLicenseImg?.[0]} width={150} height={150} />}
                {detailData?.bankAccountInfo?.bankCardFrontImg?.[0] && <Image src={detailData?.bankAccountInfo?.bankCardFrontImg?.[0]} width={150} height={150} />}
                {detailData?.bankAccountInfo?.bankCardBackImg?.[0] && <Image src={detailData?.bankAccountInfo?.bankCardBackImg?.[0]} width={150} height={150} />}
              </Space>
            </Form.Item>
          </div>
          <div style={{ flex: 1 }}></div>
        </div>
        {rejectVisible
          &&
          <Reject
            visible={rejectVisible}
            setVisible={setRejectVisible}
            callback={(text) => { audit(2, text) }}
          />
        }
      </Form>
    </Drawer>
  )
}

export default Detail;
