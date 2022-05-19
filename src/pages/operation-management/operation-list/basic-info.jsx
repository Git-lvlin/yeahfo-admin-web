import React, { useState, useEffect } from 'react';
import { Form, Typography, Divider, Input } from 'antd';
import {
  DrawerForm,
  ProFormText,
  ProFormRadio,
  ProFormSelect,
} from '@ant-design/pro-form';
import { operationAdd, operationEdit, getSubsidiary } from '@/services/operation-management/operation-list';
import md5 from 'blueimp-md5';
import AddressCascader from '@/components/address-cascader'

const { Title } = Typography;

const Address = ({ value, onChange, disabled }) => {
  const [area, setArea] = useState(value?.area);
  const [info, setInfo] = useState(value?.info);

  const handleProvinceChange = (val) => {
    setArea(val)
    onChange({
      area: val,
      info,
    })
  };

  const onInfoChang = e => {
    onChange({
      area,
      info: e.target.value
    })
    setInfo(e.target.value)
  }

  return (
    <>
      <AddressCascader value={area} placeholder="请选择所在地区" disabled={disabled} onChange={handleProvinceChange} style={{ width: '100%' }} />
      <div style={{ marginTop: 10 }}>
        <Input value={info} placeholder="请输入详细地址" disabled={disabled} onChange={onInfoChang} />
      </div>
    </>
  )
}


export default (props) => {
  const { visible, setVisible, detailData, callback = () => { }, onClose = () => { } } = props;
  const [form] = Form.useForm()
  const [companyNameData, setCompanyNameData] = useState([])

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
      address,
      addressInfo,
      companyUserName,
      companyUserPhone,
      contactPhone,
      ...rest
    } = values;
    return new Promise((resolve, reject) => {
      const apiMethod = detailData ? operationEdit : operationAdd;
      const params = {
        ...rest,
        companyUserName,
        companyUserPhone,
        operationId: detailData?.operationId,
        provinceId: address[0].value,
        provinceName: address[0].label,
        cityId: address?.[1]?.value ?? 0,
        cityName: address?.[1]?.label ?? null,
        areaId: address?.[2]?.value ?? 0,
        areaName: address?.[2]?.label ?? null,
        contactName: companyUserName,
        contactPhone,
        attrProvinceId: addressInfo.area[0].value,
        attrCityId: addressInfo.area[1].value,
        attrAreaId: addressInfo.area[2].value,
        attrProvinceName: addressInfo.area[0].label,
        attrCityName: addressInfo.area[1].label,
        attrAreaName: addressInfo.area[2].label,
        detailAddress: addressInfo.info,
        address: `${addressInfo.area[0].label}${addressInfo.area[1].label}${addressInfo.area[2].label}${addressInfo.info}`,
      }

      if (password) {
        params.password = md5(password)
        params.sourcePwd = password
      }

      apiMethod(params, { showSuccess: true, showError: true }).then(res => {
        if (res.code === 0) {
          resolve();
          callback();
        } else {
          reject();
        }
      })
    });
  }

  useEffect(() => {
    if (detailData) {
      const address = [];
      if (detailData.provinceId) {
        address.push({
          value: detailData.provinceId,
          label: detailData.provinceName
        })
      }
      if (detailData.cityId) {
        address.push({
          value: detailData.cityId,
          label: detailData.cityName
        })
      }
      if (detailData.areaId) {
        address.push({
          value: detailData.areaId,
          label: detailData.areaName
        })
      }
      form.setFieldsValue({
        ...detailData,
        subsidiaryId: detailData.subsidiaryId === 0 ? undefined : detailData.subsidiaryId,
        address,
      })

      const { addressInfo } = detailData;
      if (addressInfo) {
        form.setFieldsValue({
          contactPhone: addressInfo.contactPhone,
          addressInfo: {
            area: [
              {
                value: addressInfo.provinceId,
                label: addressInfo.provinceName,
              },
              {
                value: addressInfo.cityId,
                label: addressInfo.cityName,
              },
              {
                value: addressInfo.areaId,
                label: addressInfo.areaName,
              }
            ],
            info: addressInfo.detailAddress,
          }
        })
      }
    }
  }, [form, detailData]);

  useEffect(() => {
    getSubsidiary()
      .then(res => {
        if (res.code === 0) {
          setCompanyNameData(res.data)
        }
      })
  }, [])

  return (
    <DrawerForm
      title={`${detailData ? '编辑' : '新建'}运营商`}
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
        accountSwitch: 1,
        status: 1,
      }}
      {...formItemLayout}
    >
      <Title level={4}>基本信息</Title>
      <Divider />
      <ProFormText
        name="companyName"
        label="运营商名称"
        placeholder="请输入运营商名称"
        rules={[{ required: true, message: '请输入运营商名称' }]}
        fieldProps={{
          maxLength: 30,
        }}
      />
      <ProFormText
        name="accountName"
        label="运营商登录账号"
        placeholder="请输入运营商登录账号"
        rules={[{ required: true, message: '请输入运营商登录账号' }]}
        fieldProps={{
          maxLength: 18,
        }}
        disabled={detailData?.bankAccountInfo?.auditStatus === 1}
      />
      <ProFormText.Password
        name="password"
        label="运营商登录密码"
        placeholder="请输入运营商登录密码"
        validateFirst
        rules={[
          { required: !detailData, message: '请输入运营商登录密码' },
          { required: !detailData, message: '密码应不少于6个字符，不超过18个字符', min: 6, max: 18 }
        ]}
        fieldProps={{
          visibilityToggle: false,
          maxLength: 18,
          autoComplete: 'new-password',
        }}
      />
      <ProFormText
        name="companyUserName"
        label="运营商联系人"
        placeholder="请输入运营商联系人"
        rules={[{ required: true, message: '请输入运营商联系人' }]}
        fieldProps={{
          maxLength: 10,
        }}
      />
      <ProFormText
        name="companyUserPhone"
        label="联系人手机号"
        placeholder="请输入联系人手机号"
        rules={[{ required: true, message: '请输入联系人手机号' }]}
        fieldProps={{
          maxLength: 11,
        }}
      />
      <Form.Item
        label="运营商所管辖区域"
        rules={[{ required: true, message: '请选择运营商所管辖区域' }]}
        name="address"
      >
        <AddressCascader changeOnSelect />
      </Form.Item>
      <ProFormText
        name="contactPhone"
        label="售后联系方式"
        placeholder="请输入售后联系方式"
        rules={[{ required: true, message: '请输入售后联系方式' }]}
      />
      <Form.Item
        label="售后地址"
        name="addressInfo"
        validateFirst
        rules={[
          () => ({
            required: true,
            validator(_, value = {}) {
              const { area, info } = value;
              if (area?.length === 0 || !area) {
                return Promise.reject(new Error('请选择售后地址所在地'));
              }

              if (!info?.replace(/\s/g, '')) {
                return Promise.reject(new Error('请输入详细地址'));
              }

              return Promise.resolve();
            },
          })]}
      >
        <Address />
      </Form.Item>
      <ProFormSelect
        label="所属分公司"
        options={companyNameData.map(item => ({ label: item.companyName, value: item.id }))}
        name="subsidiaryId"
        rules={[{ required: true, message: '请选择所属分公司' }]}
      />

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
            value: 0,
          },
        ]}
      />
      <ProFormRadio.Group
        name="accountSwitch"
        label="是否需要开户认证"
        rules={[{ required: true }]}
        options={[
          {
            label: '需要',
            value: 1,
          },
          {
            label: '不需要',
            value: 0,
          },
        ]}
      />
    </DrawerForm>
  );
};
