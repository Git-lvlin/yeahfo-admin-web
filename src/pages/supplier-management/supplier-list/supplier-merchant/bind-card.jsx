import React, { useState, useEffect } from 'react';
import { Form, Button, Input, Space, Typography, Divider, DatePicker } from 'antd';
import {
  DrawerForm,
  ProFormText,
  ProFormRadio,
  ProFormSelect,
  ProFormDependency,
} from '@ant-design/pro-form';
import Upload from '@/components/upload';
import { getBanks } from '@/services/supplier-management/supplier-list';
import { bindBank } from '@/services/supplier-management/bind-card';


const ImageInfo = ({ value, onChange, bankAccountType, bindBankSwitch, disabled }) => {
  const [bankLicenseImg, setBankLicenseImg] = useState(value?.bankLicenseImg);
  const [bankCardFrontImg, setBankCardFrontImg] = useState(value?.bankCardFrontImg);
  const [bankCardBackImg, setBankCardBackImg] = useState(value?.bankCardBackImg);
  const update = (obj) => {
    onChange({
      bankLicenseImg,
      bankCardFrontImg,
      bankCardBackImg,
      ...obj,
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
        {
          bankAccountType === 1
            ?
            <Upload key="1" code={303} disabled={disabled} value={bankLicenseImg} text="上传开户银行许可证照" maxCount={1} size={2 * 1024} accept="image/*" onChange={bankLicenseImgChange} />
            :
            <>
              <Upload key="2" code={303} disabled={disabled} value={bankCardFrontImg} text="上传结算银行卡正面照" maxCount={1} size={2 * 1024} accept="image/*" onChange={bankCardFrontImgChange} />
              <Upload key="3" code={303} disabled={disabled} value={bankCardBackImg} text="上传结算银行卡背面照" maxCount={1} accept="image/*" size={2 * 1024} onChange={bankCardBackImgChange} />
            </>
        }
      </Space>
    </div>

  )
}

export default (props) => {
  const { setVisible, detailData, callback = () => { }, onClose = () => { } } = props;
  const [form] = Form.useForm()

  const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 10 },
    layout: {
      labelCol: {
        span: 4,
      },
      wrapperCol: {
        span: 10,
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
      bindBank({
        ...rest,
        bankCode: bankCode?.value,
        bankName: bankCode?.label,
        businessLicense: [imageInfo?.businessLicense],
        bankLicenseImg: [imageInfo?.bankLicenseImg],
        bankCardFrontImg: [imageInfo?.bankCardFrontImg],
        bankCardBackImg: [imageInfo?.bankCardBackImg],
        supplierId: detailData?.supplierId,
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
      form.setFieldsValue({
        bankAccountName: detailData.companyName
      })
    }
  }

  useEffect(() => {
    if (detailData) {
      const { bankAccountInfo } = detailData
      form.setFieldsValue({
        bindBankSwitch: bankAccountInfo?.bindBankSwitch,
      })

      if (bankAccountInfo) {
        const {
          bankLicenseImg,
          bankCardFrontImg,
          bankCardBackImg,
          bankCode,
          bankName,
          bankAccountType,
          bankCardNo,
          bankAccountName,
          accountType,
          legalName,
        } = bankAccountInfo
        form.setFieldsValue({
          imageInfo: {
            bankLicenseImg: bankLicenseImg?.[0],
            bankCardBackImg: bankCardBackImg?.[0],
            bankCardFrontImg: bankCardFrontImg?.[0],
          },
          bankCode: bankCode ? { label: bankName, value: bankCode } : undefined,
          bankAccountType: bankAccountType || 1,
          bankCardNo,
          bankAccountName: (bankAccountType || 1) === 1 ? detailData.companyName : bankAccountName,
        })

        if (accountType === 2) {
          form.setFieldsValue({
            bankAccountName: legalName,
            bankAccountType: 2,
          })
        }
      }
    }
  }, [form, detailData]);

  return (
    <DrawerForm
      title={`绑定银行卡信息`}
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
        try {
          await submit(values);
          return true;
        } catch (error) {
          console.log('error', error);
        }
      }}
      visible
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
              <Button type="primary" onClick={() => { props.submit(); }}>
                确认
              </Button>
            </Space>
          )
        },
      }}
    >
      <div style={{ display: 'flex' }}>
        <div style={{ flex: 1 }}>
          <ProFormRadio.Group
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
            disabled={detailData?.bankAccountInfo?.accountType === 2}
          />

          <ProFormDependency name={['bankAccountType', 'bindBankSwitch']}>
            {
              ({ bankAccountType, bindBankSwitch }) => (
                <>
                  {
                    detailData?.bankAccountInfo?.accountType === 1
                    &&
                    <Form.Item
                      label={
                        <div style={{ height: 130 }}>
                          <div>开户资质文件</div>
                          <div>jpg/png格式</div>
                          <div>大小不超过2MB</div>
                        </div>
                      }
                      name="imageInfo"
                      validateFirst
                      rules={[
                        () => ({
                          required: detailData?.bankAccountInfo?.accountType !== 2,
                          validator(_, value = {}) {
                            const { bankLicenseImg, bankCardFrontImg, bankCardBackImg } = value;

                            if (detailData?.bankAccountInfo?.accountType === 2) {
                              return Promise.resolve();
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
                      <ImageInfo bankAccountType={bankAccountType} bindBankSwitch={bindBankSwitch} />
                    </Form.Item>
                  }
                </>
              )
            }
          </ProFormDependency>


          <ProFormSelect
            name="bankCode"
            label="账户结算银行"
            placeholder="请选择结算收款银行"
            request={getBanks}
            rules={[{ required: true, message: '请选择账户结算银行' }]}
            fieldProps={{
              labelInValue: true,
            }}
          // disabled={detailData?.bankAccountInfo?.auditStatus === 1}
          />
          <ProFormText
            name="bankCardNo"
            label="结算银行卡号"
            placeholder="请输入结算银行卡号"
            rules={[{ required: true, message: '请输入结算银行卡号' }]}
          // disabled={detailData?.bankAccountInfo?.auditStatus === 1}
          />
          <ProFormDependency name={['bankAccountType']}>
            {
              ({ bankAccountType }) => (
                <ProFormText
                  name="bankAccountName"
                  label="结算银行卡开户名"
                  placeholder="请输入结算银行卡开户名"
                  rules={[{ required: true, message: '请输入结算银行卡开户名' }]}
                  extra={
                    <>
                      {detailData?.bankAccountInfo?.accountType === 2 && '银行账户类型为对私账户时，开户名固定为个人真实姓名'}
                      {detailData?.bankAccountInfo?.accountType === 1 && bankAccountType === 1 && '银行账户类型为对公账户时：银行卡开户名为供应商企业名称；银行卡开户地址的省市区要与企业地址的省市区相同'}
                    </>
                  }
                  disabled={bankAccountType === 1 || detailData?.bankAccountInfo?.accountType === 2}
                />
              )
            }
          </ProFormDependency>
        </div>
      </div>
    </DrawerForm>
  );
};
