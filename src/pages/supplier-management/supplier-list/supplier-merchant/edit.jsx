import React, { useState, useEffect, useRef } from 'react';
import { Form, Button, Tree, message, Checkbox, Input, Space, Typography, Divider } from 'antd';
import {
  DrawerForm,
  ProFormText,
  ProFormRadio,
  ProFormSelect,
  ProFormDigit,
  ProFormDependency,
} from '@ant-design/pro-form';
import Upload from '@/components/upload';
import { supplierAdd, supplierEdit, categoryAll, getBanks } from '@/services/supplier-management/supplier-list';
import md5 from 'blueimp-md5';
import { arrayToTree } from '@/utils/utils'
import FormModal from './form';
import Address from './address';
import Big from 'big.js'

const { Title } = Typography;


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

const SocialCreditInfo = ({ value, onChange }) => {
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
    setDate(e.target.value);
    onChange({
      code,
      date: e.target.value,
    })
  }

  return (
    <Space>
      <Input placeholder="请输入统一社会信用码" value={code} style={{ width: 230 }} onChange={codeChange} />
      <Input placeholder="请选择统一社会信用证有效期" value={date} style={{ width: 230 }} onChange={dateChange} />
    </Space>
  )
}

const LegalInfo = ({ value, onChange }) => {
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
    setDate(e.target.value)
    onChange({
      code,
      userName,
      date: e.target.value,
    })
  }
  return (
    <Space>
      <Input value={userName} placeholder="请输入姓名" style={{ width: 100 }} onChange={userNameChange} />
      <Input value={code} placeholder="请输入身份证号码" style={{ width: 150 }} onChange={codeChange} />
      <Input value={date} placeholder="请输入身份证号码有效期" style={{ width: 200 }} onChange={dateChange} />
    </Space>
  )
}

const ImageInfo = ({ value, onChange, bankAccountType }) => {
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
        <Upload code={301} value={businessLicense} text="上传三合一证件照" maxCount={1} accept="image/*" onChange={businessLicenseChange} />
        <Upload code={302} value={idCardFrontImg} text="上传法人身份证正面照" maxCount={1} accept="image/*" onChange={idCardFrontImgChange} />
        <Upload code={302} value={idCardBackImg} text="上传法人身份证背面照" maxCount={1} accept="image/*" onChange={idCardBackImgChange} />
        {
          bankAccountType === 1
            ?
            <Upload key="1" code={303} value={bankLicenseImg} text="上传开户银行许可证照" maxCount={1} accept="image/*" onChange={bankLicenseImgChange} />
            :
            <Upload key="2" code={303} value={bankCardFrontImg} text="上传结算银行卡正面照" maxCount={1} accept="image/*" onChange={bankCardFrontImgChange} />
        }
      </Space>
      {bankAccountType === 2 && <Space>
        <Upload code={303} value={bankCardBackImg} text="上传结算银行卡背面照" maxCount={1} accept="image/*" onChange={bankCardBackImgChange} />
      </Space>}
    </div>

  )
}

export default (props) => {
  const { visible, setVisible, detailData, callback = () => { }, onClose = () => { } } = props;
  const [form] = Form.useForm()
  const [formVisible, setFormVisible] = useState(false)
  const [selectData, setSelectData] = useState([]);
  const [treeData, setTreeData] = useState([])
  const [selectKeys, setSelectKeys] = useState([]);
  const originData = useRef([])

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
      const apiMethod = detailData ? supplierEdit : supplierAdd;

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
          if (findItem) {
            const { gcParentId, id } = findItem;

            if (gcParentId !== 0) {
              if (obj[gcParentId]) {
                obj[gcParentId].push(id)
              } else {
                obj[gcParentId] = [id];
              }
            }
          }
        })

        let hasError = false;
        // eslint-disable-next-line no-restricted-syntax
        for (const key in obj) {
          if (Object.hasOwnProperty.call(obj, key)) {
            const g = { gc1: key };
            if (obj[key].length) {
              g.gc2 = obj[key]
            } else {
              hasError = true;
            }
            gcArr.push(g)
          }
        }

        if (hasError) {
          message.error('选择的一级分类下无二级分类，请到分类管理添加二级分类');
          reject()
          return;
        }

      } else {
        gcArr = ''
      }
      apiMethod({
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
        legalIdCardExpire: legalInfo?.date,
        socialCreditCode: socialCreditInfo?.code,
        socialCreditCodeExpire: socialCreditInfo?.date,
        provinceCode: addressInfo?.area?.[0],
        areaCode: addressInfo?.area?.[1],
        companyAddress: addressInfo?.info,
        password: password ? md5(password) : '',
        supplierId: detailData?.supplierId,
        bindSupplierIds: selectData.map(item => item.id).join(','),
        gcInfo: gcArr,
      }, { showSuccess: true, showError: true, noFilterParams: true, paramsUndefinedToEmpty: true }).then(res => {
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
        bankAccountName: form.getFieldValue('companyName')
      })
    }
  }

  const companyNameChange = (e) => {
    form.setFieldsValue({
      bankAccountName: e.target.value
    })
  }

  useEffect(() => {
    if (detailData) {
      form.setFieldsValue({
        ...detailData
      })

      const { bankAccountInfo, warrantyRatioDisplay, defaultWholesaleTaxRateDisplay } = detailData

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
        } = bankAccountInfo
        form.setFieldsValue({
          addressInfo: {
            area: provinceCode ? [provinceCode, areaCode] : [],
            info: companyAddress,
          },
          socialCreditInfo: {
            code: socialCreditCode,
            date: socialCreditCodeExpire,
          },
          businessScope,
          legalInfo: {
            code: legalIdCardNo,
            userName: legalName,
            date: legalIdCardExpire
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
          bankCode: { label: bankName, value: bankCode },
          bankAccountType,
          bankCardNo,
          bankAccountName: bankAccountType === 1 ? detailData.companyName : bankAccountName,
          warrantyRatio: warrantyRatioDisplay,
          defaultWholesaleTaxRate: defaultWholesaleTaxRateDisplay,
        })
      }

      setSelectData(detailData.supplierIds)
      const ids = [];
      detailData.gcInfo.forEach(item => {
        if (item.gcParentId !== 0) {
          ids.push(item.id)
        }
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
  }, [form, detailData]);

  return (
    <DrawerForm
      title={`${detailData ? '编辑' : '新建'}供应商家`}
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
      visible={visible}
      initialValues={{
        status: 1,
        bankAccountType: 1,
        defaultWholesaleTaxRate: 0,
      }}
      {...formItemLayout}
    >
      <Title level={4}>基本信息</Title>
      <Divider />
      <div style={{ display: 'flex' }}>
        <div style={{ flex: 1 }}>
          <ProFormText
            name="companyName"
            label="供应商家名称"
            placeholder="请输入供应商家名称"
            // rules={[{ required: true, message: '请输入供应商家名称' }]}
            fieldProps={{
              maxLength: 30,
              onChange: companyNameChange
            }}
            disabled={detailData?.bankAccountInfo?.auditStatus === 1}
          />
          <ProFormText
            name="accountName"
            label="供应商家登录账号"
            placeholder="请输入供应商家登录账号"
            // rules={[{ required: true, message: '请输入供应商家登录账号' }]}
            fieldProps={{
              maxLength: 18,
            }}
            disabled={detailData?.bankAccountInfo?.auditStatus === 1}
          />
          <ProFormText.Password
            name="password"
            label="供应商家登录密码"
            placeholder="请输入供应商家登录密码"
            validateFirst
            // rules={[
            //   { required: !detailData, message: '请输入供应商家登录密码' },
            //   { required: !detailData, message: '密码应不少于6个字符，不超过18个字符', min: 6, max: 18 }
            // ]}
            fieldProps={{
              visibilityToggle: false,
              maxLength: 18,
            }}
          />
          <ProFormText
            name="companyUserName"
            label="负责人"
            placeholder="请输入负责人"
            // rules={[{ required: true, message: '请输入负责人' }]}
            fieldProps={{
              maxLength: 10,
            }}
          />
          <ProFormText
            name="companyUserPhone"
            label="负责人手机号"
            placeholder="请输入负责人手机号"
            // rules={[{ required: true, message: '请输入负责人手机号' }]}
            fieldProps={{
              maxLength: 11,
              extra: "此手机号会用做平台联系和对绑定的银行卡解绑确认"
            }}
          />
          <ProFormText
            name="orderTipPhone"
            label="提醒手机号"
            placeholder="请输入手机号码 产生待发货订单时自动发送短信"
            fieldProps={{
              maxLength: 11,
            }}
          />
          <ProFormRadio.Group
            name="status"
            label="状态"
            // rules={[{ required: true }]}
            options={[
              {
                label: '启用',
                value: 1,
              },
              {
                label: '禁用',
                value: 2,
              },
            ]}
          />

        </div>
        <div style={{ flex: 1 }}>
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

          <Form.Item
            label="可关联顾问"
          >
            <Button type="primary" onClick={() => { setFormVisible(true) }}>选择顾问</Button>
            <div>
              {!!selectData.length && <div>已选择顾问</div>}
              {
                selectData.map(item => (<div key={item.id}>{item.companyName}</div>))
              }
            </div>
          </Form.Item>
          {/* <ProFormDigit
            placeholder="请输入商品开票税率"
            label="商品开票税率"
            name="defaultWholesaleTaxRate"
            min={1}
            max={50}
            fieldProps={{
              formatter: value => value ? +new Big(value).toFixed(2) : value
            }}
            extra={<><span style={{ position: 'absolute', right: 30, top: 5 }}>%</span></>}
            step
            validateFirst
            rules={[
              { required: true, message: '请输入商品开票税率' },
              () => ({
                validator(_, value) {
                  if (!/^\d+\.?\d*$/g.test(value)) {
                    return Promise.reject(new Error('请输入0-13之间的数字'));
                  }
                  return Promise.resolve();
                },
              })
            ]}
          /> */}
          <ProFormSelect
            name="defaultWholesaleTaxRate"
            label="商品开票税率(%)"
            fieldProps={{
              allowClear: false,
            }}
            // required
            options={[
              {
                label: '0%',
                value: 0
              },
              {
                label: '1%',
                value: 1
              },
              {
                label: '3%',
                value: 3
              },
              {
                label: '6%',
                value: 6
              },
              {
                label: '9%',
                value: 9
              },
              {
                label: '13%',
                value: 13
              }
            ]}
          />
          <ProFormDigit
            placeholder="请输入商品质保金比例"
            label="商品质保金比例"
            name="warrantyRatio"
            min={0}
            max={50}
            fieldProps={{
              formatter: value => value ? +new Big(value).toFixed(2) : value
            }}
            extra={<><span style={{ position: 'absolute', right: 30, top: 5 }}>%</span></>}
            step
          // validateFirst
          // rules={[
          //   { required: true, message: '请输入商品质保金比例' },
          //   () => ({
          //     validator(_, value) {
          //       if (!/^\d+\.?\d*$/g.test(value) || value < 0) {
          //         return Promise.reject(new Error('请输入大于零或等于零的数字'));
          //       }
          //       return Promise.resolve();
          //     },
          //   })
          // ]}
          />
        </div>
      </div>

      {
        detailData?.bankAccountInfo?.auditStatus !== 1
        &&
        <div>
          <Title level={4}>资金账户信息</Title>
          <Divider />
          <div style={{ display: 'flex' }}>
            <div style={{ flex: 1 }}>
              <Form.Item
                label="企业地址"
                name="addressInfo"
              // validateFirst
              // rules={[
              //   () => ({
              //     required: true,
              //     validator(_, value = {}) {
              //       const { area, info } = value;
              //       if (area?.length === 0 || !area) {
              //         return Promise.reject(new Error('请选择企业所在地'));
              //       }

              //       if (!info?.replace(/\s/g, '')) {
              //         return Promise.reject(new Error('请输入企业详细地址'));
              //       }

              //       return Promise.resolve();
              //     },
              //   })]}
              >
                <Address />
              </Form.Item>
              <Form.Item
                label="统一社会信用码"
                name="socialCreditInfo"
              // validateFirst
              // rules={[{ required: true },
              // () => ({
              //   validator(_, value = {}) {
              //     const { code, date } = value;
              //     if (!code?.replace(/\s/g, '')) {
              //       return Promise.reject(new Error('请输入统一社会信用码'));
              //     }
              //     if (!date) {
              //       return Promise.reject(new Error('请选择统一社会信用证有效期'));
              //     }
              //     return Promise.resolve();
              //   },
              // })]}
              >
                <SocialCreditInfo />
              </Form.Item>
              <ProFormText
                name="businessScope"
                label="经营范围"
                placeholder="请输入经营范围"
              // rules={[{ required: true, message: '请输入经营范围' }]}
              />
              <Form.Item
                label="法人姓名"
                name="legalInfo"
              // validateFirst
              // rules={[
              //   () => ({
              //     required: true,
              //     validator(_, value = {}) {
              //       const { code, date, userName } = value;
              //       if (!userName?.replace(/\s/g, '')) {
              //         return Promise.reject(new Error('请输入姓名'));
              //       }

              //       if (!code?.replace(/\s/g, '')) {
              //         return Promise.reject(new Error('请输入身份证号码'));
              //       }

              //       if (!date) {
              //         return Promise.reject(new Error('请选择身份证号码有效期'));
              //       }
              //       return Promise.resolve();
              //     },
              //   })
              // ]}
              >
                <LegalInfo />
              </Form.Item>
              <ProFormText
                name="legalPhone"
                label="法人手机号"
                placeholder="请输入法人手机号"
              // rules={[{ required: true, message: '请输入法人手机号' }]}
              // fieldProps={{
              //   maxLength: 11,
              // }}
              />

            </div>
            <div style={{ flex: 1 }}>
              <ProFormRadio.Group
                name="bankAccountType"
                label="结算银行账户类型"
                // rules={[{ required: true }]}
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
              />
              <ProFormDependency name={['bankAccountType']}>
                {
                  ({ bankAccountType }) => (
                    <Form.Item
                      label={
                        <div style={{ position: 'relative', top: 20 }}>
                          <div>开户资质文件</div>
                          <div>jpg/png格式</div>
                          <div>大小不超过2MB</div>
                        </div>
                      }
                      name="imageInfo"
                    // validateFirst
                    // rules={[
                    //   () => ({
                    //     required: true,
                    //     validator(_, value = {}) {
                    //       const { businessLicense, idCardFrontImg, idCardBackImg, bankLicenseImg, bankCardFrontImg, bankCardBackImg } = value;
                    //       if (!businessLicense) {
                    //         return Promise.reject(new Error('请上传三合一证件照'));
                    //       }
                    //       if (!idCardFrontImg) {
                    //         return Promise.reject(new Error('请上传法人身份证正面照'));
                    //       }
                    //       if (!idCardBackImg) {
                    //         return Promise.reject(new Error('请上传法人身份证背面照'));
                    //       }
                    //       if (!bankLicenseImg && bankAccountType === 1) {
                    //         return Promise.reject(new Error('请上传开户银行许可证照'));
                    //       }
                    //       if (!bankCardFrontImg && bankAccountType === 2) {
                    //         return Promise.reject(new Error('请上传结算银行卡正面照'));
                    //       }
                    //       if (!bankCardBackImg && bankAccountType === 2) {
                    //         return Promise.reject(new Error('请上传结算银行卡背面照'));
                    //       }
                    //       return Promise.resolve();
                    //     },
                    //   })
                    // ]}
                    >
                      <ImageInfo bankAccountType={bankAccountType} />
                    </Form.Item>
                  )
                }
              </ProFormDependency>

              <ProFormSelect
                name="bankCode"
                label="账户结算银行"
                placeholder="请选择结算收款银行"
                request={getBanks}
                // rules={[{ required: true, message: '请选择账户结算银行' }]}
                fieldProps={{
                  labelInValue: true,
                }}
              />
              <ProFormText
                name="bankCardNo"
                label="结算银行卡号"
                placeholder="请输入结算银行卡号"
              // rules={[{ required: true, message: '请输入结算银行卡号' }]}
              />
              <ProFormDependency name={['bankAccountType']}>
                {
                  ({ bankAccountType }) => (
                    <ProFormText
                      name="bankAccountName"
                      label="结算银行卡开户名"
                      placeholder="请输入结算银行卡开户名"
                      // rules={[{ required: true, message: '请输入结算银行卡开户名' }]}
                      extra="银行账户类型为对公账户时，开户名为供应商家企业名称"
                      disabled={bankAccountType === 1}
                    />
                  )
                }
              </ProFormDependency>

            </div>
          </div>
        </div>
      }

      {formVisible && <FormModal
        visible={formVisible}
        setVisible={setFormVisible}
        callback={(v) => { setSelectData(v) }}
        selectData={selectData}
      />}
    </DrawerForm>
  );
};
