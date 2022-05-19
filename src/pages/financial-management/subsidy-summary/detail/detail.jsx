import React,{ useState, useEffect } from 'react'
import { PageContainer } from '@/components/PageContainer';
import ProTable from '@ant-design/pro-table'
import ProForm from '@ant-design/pro-form'
import { useParams, history } from 'umi'
import { Button, Typography, Spin, message, Image } from 'antd'

import { detail, allowanceDetail, settle } from '@/services/financial-management/subsidy-summary'
import { amountTransform } from '@/utils/utils'
import Upload from '@/components/upload'
import styles from './styles.less'

const { Title, Paragraph } = Typography
const { PreviewGroup } = Image

const Detail = ()=> {
  const {id} = useParams()
  const [data, setData] = useState({})
  const [load, setLoad] = useState(false)
  const [change, setchange] = useState(0)

  useEffect(() => {
    setLoad(true)
    allowanceDetail({id}).then(res => {
      setData(res.data)
    }).finally(() => {
      setLoad(false)
    })
    return () => {
      setData({})
    }
  }, [change])

  const VoucherPic = ({pic}) => {
    return pic && pic?.map(res => {
      if(res){
        return (
          <span key={res} className={styles.img}>
            <Image
              width={60}
              height={60}
              src={res}
            />
          </span>
        )
      }
    })
  }

  const submitData = (e) => {
    settle({
      id,
      attachment: e.attachment.join()
    }).then(res => {
      if(res.data) setchange(change + 1)
    })
  }

  const Credentials = ({status}) => {
    switch(status) {
      case 'unSettle':
        return (
          <ProForm
            onFinish={(values) => {
              submitData(values)
              message.success('提交成功')
            }}
            layout="horizontal"
            submitter={{
              searchConfig: {
                resetText: false,
                submitText: '结算确认'
              }
            }}
          >
            <ProForm.Item
              label="上传结算凭证"
              name="attachment"
              rules={[{message: '请上传结算凭证图片', required: true}]}
              tooltip={
                <dl>
                  <dt>图片要求</dt>
                  <dd>1.图片大小2MB以内</dd>
                  <dd>2.图片格式png/jpg/gif</dd>
                  <dd>3.图片最大支持上传3张</dd>
                </dl>
              }
            >
              <Upload
                code={230}
                multiple
                maxCount={3}
                accept="image/*"
                size={2 * 1024}
              />
            </ProForm.Item>
          </ProForm>
        )
      case 'settled':
        return(
          <ProForm
            submitter={false}
            layout="horizontal"
          >
            <ProForm.Item
              label="列表图片："
            >
              <PreviewGroup>
                <VoucherPic pic={(data?.attachment)?.split(',')}/>
              </PreviewGroup>
            </ProForm.Item>
            <Paragraph>结算时间：{data?.settleTime}</Paragraph>
            <Paragraph>结算人员：{data?.settleMan}</Paragraph>
          </ProForm>
        )
      default:
        return ''
    }
  }

  const columns = [
    {
      title: '订单编号',
      dataIndex: 'orderNo',
      align: 'center'
    },
    {
      title: '券码',
      dataIndex: 'couponCode',
      align: 'center'
    },
    {
      title: '券面值',
      dataIndex: 'couponAmount',
      align: 'center',
      render: (_) => `￥${amountTransform(_, '/')}`
    },
    {
      title: '券名称',
      dataIndex: 'couponName',
      align: 'center',
    },
    {
      title: '订单摊分优惠金额',
      dataIndex: 'orderAllowanceAmount',
      align: 'center',
      render: (_) => `￥${amountTransform(_, '/')}`
    },
    {
      title: '获得补贴金额',
      dataIndex: 'allowanceAmount',
      align: 'center',
      render:(_) => `￥${amountTransform(_, '/')}`
    },
    {
      title: '订单支付时间',
      dataIndex: 'createTime',
      align: 'center'
    }
  ]
  return (
    <PageContainer title={false}>
      <Spin spinning={load}>
        {
          <Typography
            className={styles.data}
          >
            <Title level={4}>商家结算资料</Title>
            <Paragraph>补贴单：{data?.sn}</Paragraph>
            <Paragraph>所属商家：{data?.accountName}</Paragraph>
            <Paragraph>商家结算账户：{data?.accountSn}</Paragraph>
            {
              data?.bindCard&&
              <>
                <Paragraph>商家银行账户：{data?.bindCard?.cardNo}</Paragraph>
                <Paragraph>银行账户开户行：{data?.bindCard?.bankName}</Paragraph>
                <Paragraph>账户名：{data?.bindCard?.realname}</Paragraph>
              </>
            }
          </Typography>
          }
      </Spin>
      {
        data?.status !== 'counting'&&
        <Spin spinning={load}>
          <Typography
            className={styles.data}
          >
            <Title level={4}>结算凭证</Title>
            <Paragraph>本次结算金额：￥{data?.amount}</Paragraph>
            <Paragraph>本次结算周期为：{data?.period}</Paragraph>
            <Paragraph>
              {
                data?.status&&
                <Credentials status={data?.status}/>
              }
            </Paragraph>
          </Typography>
        </Spin>
      }
      <ProTable
        rowKey='id'
        columns={columns}
        pagination={{
          pageSize: 10
        }}
        toolBarRender={false}
        params={{ id }}
        request={detail}
        search={false}
      />
      <div
        style={{
          background: '#fff',
          paddingBottom: 20
        }}
      >
        <Button 
          type='primary'
          onClick={() => { window.history.back(); setTimeout(() => { window.location.reload(); }, 200) }}
          style={{
            marginLeft: 20
          }}
        >
          返回
        </Button>
      </div>
    </PageContainer>
  )
}

export default Detail
