import React, { useState, useEffect } from 'react';
import { Form, Button, Input, Space, Typography, Divider, DatePicker, Checkbox } from 'antd';
import {
  DrawerForm,
  ProFormText,
  ProFormRadio,
  ProFormSelect,
  ProFormDependency,
} from '@ant-design/pro-form';
import Upload from '@/components/upload';
import { openAccount, getBanks } from '@/services/operation-management/operation-list';
import Address from './address';
import moment from 'moment'

const { Title } = Typography;

const SocialCreditInfo = ({ value, onChange, disabled }) => {
  const [code, setCode] = useState(value?.code);
  const [date, setDate] = useState(value?.date);

  const codeChange = (e) => {
    setCode(e.target.value);
    onChange({
      code: e.target.value,
      date,
    })
  }

  const dateChange = (e) => {
    setDate(e);
    onChange({
      code,
      date: e,
    })
  }

  const modeChange = (e) => {
    if (e.target.checked) {
      dateChange(moment('2099-12-31'))
    } else {
      dateChange(moment())
    }
  }

  return (
    <Space>
      <Input placeholder="请输入统一社会信用码" disabled={disabled} value={code} style={{ width: 230 }} onChange={codeChange} />
      <DatePicker placeholder="请选择统一社会信用证有效期" disabled={disabled} value={date} style={{ width: 160 }} onChange={dateChange} />
      <Checkbox checked={date?.isSame?.('2099-12-31')} disabled={disabled} onChange={modeChange}>长期</Checkbox>
    </Space>
  )
}

const LegalInfo = ({ value, onChange, disabled }) => {
  const [code, setCode] = useState(value?.code);
  const [date, setDate] = useState(value?.date);
  const [userName, setUserName] = useState(value?.userName);

  const codeChange = (e) => {
    setCode(e.target.value);
    onChange({
      code: e.target.value,
      date,
      userName,
    })
  }

  const userNameChange = (e) => {
    setUserName(e.target.value);
    onChange({
      code,
      date,
      userName: e.target.value,
    })
  }

  const dateChange = (e) => {
    setDate(e)
    onChange({
      code,
      userName,
      date: e,
    })
  }
  return (
    <Space>
      <Input value={userName} disabled={disabled} placeholder="请输入姓名" style={{ width: 100 }} onChange={userNameChange} />
      <Input value={code} disabled={disabled} placeholder="请输入身份证号码" style={{ width: 150 }} onChange={codeChange} />
      <DatePicker value={date} disabled={disabled} placeholder="请输入身份证号码有效期" style={{ width: 200 }} onChange={dateChange} />
    </Space>
  )
}

const ImageInfo = ({ value, onChange, bankAccountType, bindBankSwitch, disabled }) => {
  const [businessLicense, setBusinessLicense] = useState(value?.businessLicense);
  const [idCardFrontImg, setIdCardFrontImg] = useState(value?.idCardFrontImg);
  const [idCardBackImg, setIdCardBackImg] = useState(value?.idCardBackImg);
  const [bankLicenseImg, setBankLicenseImg] = useState(value?.bankLicenseImg);
  const [bankCardFrontImg, setBankCardFrontImg] = useState(value?.bankCardFrontImg);
  const [bankCardBackImg, setBankCardBackImg] = useState(value?.bankCardBackImg);
  const update = (obj) => {
    onChange({
      idCardFrontImg,
      businessLicense,
      idCardBackImg,
      bankLicenseImg,
      bankCardFrontImg,
      bankCardBackImg,
      ...obj,
    })
  }
  const businessLicenseChange = (e) => {
    setBusinessLicense(e)
    update({
      businessLicense: e,
    })
  }
  const idCardFrontImgChange = (e) => {
    setIdCardFrontImg(e)
    update({
      idCardFrontImg: e,
    })
  }
  const idCardBackImgChange = (e) => {
    setIdCardBackImg(e)
    update({
      idCardBackImg: e,
    })
  }
  const bankLicenseImgChange = (e) => {
    setBankLicenseImg(e)
    update({
      bankLicenseImg: e,
    })
  }
  const bankCardFrontImgChange = (e) => {
    setBankCardFrontImg(e)
    update({
      bankCardFrontImg: e,
    })
  }
  const bankCardBackImgChange = (e) => {
    setBankCardBackImg(e)
    update({
      bankCardBackImg: e,
    })
  }
  return (
    <div>
      <Space>
        <Upload code={301} disabled={disabled} value={businessLicense} text="上传三合一证件照" maxCount={1} accept="image/*" size={2 * 1024} onChange={businessLicenseChange} />
        <Upload code={302} disabled={disabled} value={idCardFrontImg} text="上传法人身份证正面照" maxCount={1} accept="image/*" size={2 * 1024} onChange={idCardFrontImgChange} />
        <Upload code={302} disabled={disabled} value={idCardBackImg} text="上传法人身份证背面照" maxCount={1} accept="image/*" size={2 * 1024} onChange={idCardBackImgChange} />
        {bindBankSwitch === 1 && <>
          {
            bankAccountType === 1
              ?
              <Upload key="1" code={303} disabled={disabled} value={bankLicenseImg} text="上传开户银行许可证照" maxCount={1} size={2 * 1024} accept="image/*" onChange={bankLicenseImgChange} />
              :
              <Upload key="2" code={303} disabled={disabled} value={bankCardFrontImg} text="上传结算银行卡正面照" maxCount={1} size={2 * 1024} accept="image/*" onChange={bankCardFrontImgChange} />
          }
        </>}

      </Space>
      {
        bindBankSwitch === 1 && <>
          {bankAccountType === 2 && <Space>
            <Upload code={303} disabled={disabled} value={bankCardBackImg} text="上传结算银行卡背面照" maxCount={1} accept="image/*" size={2 * 1024} onChange={bankCardBackImgChange} />
          </Space>}
        </>
      }

    </div>

  )
}

export default (props) => {
  const { visible, setVisible, detailData, callback = () => { }, onClose = () => { } } = props;
  const [form] = Form.useForm()
  const [selectData, setSelectData] = useState([]);

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

  const submit = (values) => {
    const {
      password,
      gc,
      addressInfo,
      socialCreditInfo,
      legalInfo,
      imageInfo,
      bankCode,
      ...rest
    } = values;
    return new Promise((resolve, reject) => {
      openAccount({
        ...rest,
        bankCode: bankCode?.value,
        bankName: bankCode?.label,
        businessLicense: [imageInfo?.businessLicense],
        idCardFrontImg: [imageInfo?.idCardFrontImg],
        idCardBackImg: [imageInfo?.idCardBackImg],
        bankLicenseImg: [imageInfo?.bankLicenseImg],
        bankCardFrontImg: [imageInfo?.bankCardFrontImg],
        bankCardBackImg: [imageInfo?.bankCardBackImg],
        legalName: legalInfo?.userName,
        legalIdCardNo: legalInfo?.code,
        legalIdCardExpire: moment(legalInfo?.date)?.format?.('YYYYMMDD'),
        socialCreditCode: socialCreditInfo?.code,
        socialCreditCodeExpire: moment(socialCreditInfo?.date)?.format?.('YYYYMMDD'),
        provinceCode: addressInfo?.area?.[0],
        areaCode: addressInfo?.area?.[1],
        companyAddress: addressInfo?.info,
        operationId: detailData?.operationId,
      }, { showSuccess: true, showError: true }).then(res => {
        if (res.code === 0) {
          resolve();
          callback();
        } else {
          reject();
        }
      })
    });
  }

  const bankAccountTypeChange = (e) => {
    if (e.target.value === 1) {
      const companyName = form.getFieldValue('companyName');
      form.setFieldsValue({
        bankAccountName: companyName
      })
    }
  }

  const setDisable = () => {
    return detailData?.bankAccountInfo?.auditStatus === 1 || detailData?.bankAccountInfo?.auditStatus === 4
  }

  useEffect(() => {
    if (detailData) {
      const { bankAccountInfo } = detailData
      form.setFieldsValue({
        bindBankSwitch: bankAccountInfo?.bindBankSwitch,
        bankAccountName: bankAccountInfo?.companyName,
      })

      if (bankAccountInfo) {
        const {
          provinceCode,
          areaCode,
          companyAddress,
          socialCreditCode,
          socialCreditCodeExpire,
          businessScope,
          legalName,
          legalIdCardNo,
          legalIdCardExpire,
          legalPhone,
          businessLicense,
          bankLicenseImg,
          idCardBackImg,
          idCardFrontImg,
          bankCardFrontImg,
          bankCardBackImg,
          bankCode,
          bankName,
          bankAccountType,
          bankCardNo,
          bankAccountName,
          companyName,
        } = bankAccountInfo
        form.setFieldsValue({
          addressInfo: {
            area: provinceCode ? [provinceCode, areaCode] : [],
            info: companyAddress,
          },
          socialCreditInfo: {
            code: socialCreditCode,
            date: socialCreditCodeExpire ? moment(socialCreditCodeExpire) : '',
          },
          businessScope,
          legalInfo: {
            code: legalIdCardNo,
            userName: legalName,
            date: legalIdCardExpire ? moment(legalIdCardExpire) : ''
          },
          legalPhone,
          imageInfo: {
            businessLicense: businessLicense?.[0],
            bankLicenseImg: bankLicenseImg?.[0],
            idCardFrontImg: idCardFrontImg?.[0],
            idCardBackImg: idCardBackImg?.[0],
            bankCardBackImg: bankCardBackImg?.[0],
            bankCardFrontImg: bankCardFrontImg?.[0],
          },
          bankCode: bankCode ? { label: bankName, value: bankCode } : undefined,
          bankAccountType: bankAccountType || 1,
          bankCardNo,
          bankAccountName: (bankAccountType || 1) === 1 ? companyName : bankAccountName,
          companyName,
        })
      }

    }
  }, [form, detailData]);

  return (
    <DrawerForm
      title={`${detailData ? '编辑' : '新建'}运营商`}
      onVisibleChange={setVisible}
      drawerProps={{
        forceRender: true,
        destroyOnClose: true,
        width: 1300,
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
        bankAccountType: 1,
        bindBankSwitch: 1,
      }}
      {...formItemLayout}
      submitter={{
        render: (props) => {
          return (
            <Space>
              <Button onClick={() => { setVisible(false) }}>
                取消
              </Button>
              {(detailData?.bankAccountInfo?.auditStatus !== 1 && detailData?.bankAccountInfo?.auditStatus !== 4) && <Button type="primary" onClick={() => { props.submit(); }}>
                确认
              </Button>}
            </Space>
          )
        },
      }}
    >
      <Title level={4}>资金账户信息</Title>
      <Divider />
      <div style={{ display: 'flex' }}>
        <div style={{ flex: 1 }}>
          <ProFormText
            name="companyName"
            label="企业名称"
            placeholder="请输入企业名称"
            rules={[{ required: true, message: '请输入企业名称' }]}
            fieldProps={{
              maxLength: 30,
              onChange: (e) => {
                const bankAccountType = form.getFieldValue('bankAccountType');
                if (bankAccountType === 1) {
                  form.setFieldsValue({
                    bankAccountName: e.target.value
                  })
                }
              }
            }}
            disabled={setDisable()}
          />
          <Form.Item
            label="企业地址"
            name="addressInfo"
            validateFirst
            rules={[
              () => ({
                required: true,
                validator(_, value = {}) {
                  const { area, info } = value;
                  if (area?.length === 0 || !area) {
                    return Promise.reject(new Error('请选择企业所在地'));
                  }

                  if (!info?.replace(/\s/g, '')) {
                    return Promise.reject(new Error('请输入企业详细地址'));
                  }

                  return Promise.resolve();
                },
              })]}
          >
            <Address disabled={setDisable()} />
          </Form.Item>
          <Form.Item
            label="统一社会信用码"
            name="socialCreditInfo"
            validateFirst
            rules={[{ required: true },
            () => ({
              validator(_, value = {}) {
                const { code, date } = value;
                if (!code?.replace(/\s/g, '')) {
                  return Promise.reject(new Error('请输入统一社会信用码'));
                }
                if (!date) {
                  return Promise.reject(new Error('请选择统一社会信用证有效期'));
                }
                return Promise.resolve();
              },
            })]}
          >
            <SocialCreditInfo disabled={setDisable()} />
          </Form.Item>
          <ProFormText
            name="businessScope"
            label="经营范围"
            placeholder="请输入经营范围"
            rules={[{ required: true, message: '请输入经营范围' }]}
            disabled={setDisable()}
          />
          <Form.Item
            label="法人姓名"
            name="legalInfo"
            validateFirst
            rules={[
              () => ({
                required: true,
                validator(_, value = {}) {
                  const { code, date, userName } = value;
                  if (!userName?.replace(/\s/g, '')) {
                    return Promise.reject(new Error('请输入姓名'));
                  }

                  if (!code?.replace(/\s/g, '')) {
                    return Promise.reject(new Error('请输入身份证号码'));
                  }

                  if (!date) {
                    return Promise.reject(new Error('请选择身份证号码有效期'));
                  }
                  return Promise.resolve();
                },
              })
            ]}
          >
            <LegalInfo disabled={setDisable()} />
          </Form.Item>
          <ProFormText
            name="legalPhone"
            label="法人手机号"
            placeholder="请输入法人手机号"
            rules={[{ required: true, message: '请输入法人手机号' }]}
            fieldProps={{
              maxLength: 11,
            }}
            disabled={setDisable()}
          />
          <ProFormSelect
            label="绑卡状态"
            required
            name="bindBankSwitch"
            options={[
              {
                label: '暂不绑卡',
                value: 0,
              },
              {
                label: '现在绑卡',
                value: 1,
              }
            ]}
            disabled={setDisable()}
          />
        </div>
        <div style={{ flex: 1 }}>
          <ProFormDependency name={['bindBankSwitch']}>
            {
              ({ bindBankSwitch }) => bindBankSwitch === 1 && <ProFormRadio.Group
                name="bankAccountType"
                label="结算银行账户类型"
                rules={[{ required: true }]}
                options={[
                  {
                    label: '对公账户',
                    value: 1,
                  },
                  {
                    label: '对私账户',
                    value: 2,
                  },
                ]}
                fieldProps={{
                  onChange: bankAccountTypeChange
                }}
                disabled={setDisable()}
              />
            }
          </ProFormDependency>

          <ProFormDependency name={['bankAccountType', 'bindBankSwitch']}>
            {
              ({ bankAccountType, bindBankSwitch }) => (
                <Form.Item
                  label={
                    <div style={{ position: 'relative', top: 20 }}>
                      <div>开户资质文件</div>
                      <div>jpg/png格式</div>
                      <div>大小不超过2MB</div>
                    </div>
                  }
                  name="imageInfo"
                  validateFirst
                  rules={[
                    () => ({
                      required: true,
                      validator(_, value = {}) {
                        const { businessLicense, idCardFrontImg, idCardBackImg, bankLicenseImg, bankCardFrontImg, bankCardBackImg } = value;
                        if (!businessLicense) {
                          return Promise.reject(new Error('请上传三合一证件照'));
                        }
                        if (!idCardFrontImg) {
                          return Promise.reject(new Error('请上传法人身份证正面照'));
                        }
                        if (!idCardBackImg) {
                          return Promise.reject(new Error('请上传法人身份证背面照'));
                        }
                        if (bindBankSwitch === 1) {
                          if (!bankLicenseImg && bankAccountType === 1) {
                            return Promise.reject(new Error('请上传开户银行许可证照'));
                          }
                          if (!bankCardFrontImg && bankAccountType === 2) {
                            return Promise.reject(new Error('请上传结算银行卡正面照'));
                          }
                          if (!bankCardBackImg && bankAccountType === 2) {
                            return Promise.reject(new Error('请上传结算银行卡背面照'));
                          }
                        }

                        return Promise.resolve();
                      },
                    })
                  ]}
                >
                  <ImageInfo disabled={setDisable()} bankAccountType={bankAccountType} bindBankSwitch={bindBankSwitch} />
                </Form.Item>
              )
            }
          </ProFormDependency>


          <ProFormDependency name={['bindBankSwitch']}>
            {
              ({ bindBankSwitch }) => bindBankSwitch === 1 && <>
                <ProFormSelect
                  name="bankCode"
                  label="账户结算银行"
                  placeholder="请选择结算收款银行"
                  request={getBanks}
                  rules={[{ required: true, message: '请选择账户结算银行' }]}
                  fieldProps={{
                    labelInValue: true,
                  }}
                  disabled={setDisable()}
                />
                <ProFormText
                  name="bankCardNo"
                  label="结算银行卡号"
                  placeholder="请输入结算银行卡号"
                  rules={[{ required: true, message: '请输入结算银行卡号' }]}
                  disabled={setDisable()}
                />
                <ProFormDependency name={['bankAccountType']}>
                  {
                    ({ bankAccountType }) => (
                      <ProFormText
                        name="bankAccountName"
                        label="结算银行卡开户名"
                        placeholder="请输入结算银行卡开户名"
                        rules={[{ required: true, message: '请输入结算银行卡开户名' }]}
                        extra="银行账户类型为对公账户时，开户名为运营商企业名称"
                        disabled={bankAccountType === 1 || setDisable()}
                      />
                    )
                  }
                </ProFormDependency>
              </>
            }
          </ProFormDependency>
        </div>
      </div>
    </DrawerForm>
  );
};
