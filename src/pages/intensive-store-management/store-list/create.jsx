import React, { useState, useEffect, useRef } from 'react';
import { Form, Space } from 'antd';
import {
  DrawerForm,
  ProFormText,
  ProFormRadio,
  ProFormDependency,
} from '@ant-design/pro-form';
import Upload from '@/components/upload';
import AddressCascader from '@/components/address-cascader'
import { storeAdd, giftOrder } from '@/services/intensive-store-management/store-list'
import { amountTransform } from '@/utils/utils'

const FromWrap = ({ value, onChange, content, right }) => (
  <div style={{ display: 'flex' }}>
    <div>{content(value, onChange)}</div>
    <div style={{ flex: 1, marginLeft: 10, minWidth: 180 }}>{right}</div>
  </div>
)

const ImageInfo = ({ value, onChange }) => {
  const [idHandheld, setIdHandheld] = useState(value?.idHandheld);
  const [idCardFrontImg, setIdCardFrontImg] = useState(value?.idCardFrontImg);
  const [idCardBackImg, setIdCardBackImg] = useState(value?.idCardBackImg);
  const update = (obj) => {
    onChange({
      idCardFrontImg,
      idCardBackImg,
      idHandheld,
      ...obj,
    })
  }
  const idHandheldChange = (e) => {
    setIdHandheld(e)
    update({
      idHandheld: e,
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
  return (
    <div>
      <Space>
        <Upload code={305} value={idCardFrontImg} text="上传身份证姓名面照片" maxCount={1} accept="image/*" size={1024 * 1} onChange={idCardFrontImgChange} />
        <Upload code={305} value={idCardBackImg} text="上传身份证国徽面照片" maxCount={1} accept="image/*" size={1024 * 1} onChange={idCardBackImgChange} />
        <Upload code={305} value={idHandheld} text="上传手持身份证照片" maxCount={1} accept="image/*" size={1024 * 1} onChange={idHandheldChange} />
      </Space>
    </div>

  )
}

export default (props) => {
  const { visible, setVisible, callback = () => { }, onClose = () => { } } = props;
  const [form] = Form.useForm()
  const [addressText, setAddressText] = useState('');
  const [location, setLocation] = useState([]);
  const [giftInfo, setGiftInfo] = useState({});
  const map = useRef();

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
    return new Promise((resolve, reject) => {
      const { area, imageInfo, depositStatus, depositValue, serviceFeeStatus, serviceFee, applyType, credentialList, ...rest } = values;
      let userInfo = window.localStorage.getItem('user');
      userInfo = userInfo && JSON.parse(userInfo)
      const obj = {};

      if (applyType === 20) {
        obj.credentialList = credentialList;
      }
      storeAdd({
        provinceName: area[0].label,
        provinceId: area[0].value,
        cityName: area[1].label,
        cityId: area[1].value,
        regionName: area[2].label,
        regionId: area[2].value,
        longitude: location[0],
        latitude: location[1],
        optAdminId: userInfo.id,
        optAdminName: userInfo.username,
        idFront: imageInfo.idCardFrontImg,
        idBack: imageInfo.idCardBackImg,
        idHandheld: imageInfo.idHandheld,
        deposit: depositStatus === 1 ? -1 : amountTransform(depositValue),
        serviceFee: serviceFeeStatus === 1 ? -1 : amountTransform(serviceFee),
        applyType,
        ...obj,
        ...rest,
      }, { showSuccess: true }).then(res => {
        if (res.code === 0) {
          resolve();
          callback();
        } else {
          reject();
        }
      })
    });
  }

  const searchGiftOrder = (v) => {
    giftOrder({
      phone: v
    }).then(res => {
      if (res.code === 0) {
        setGiftInfo(res.data);
      }
    })
  }

  const onValuesChange = (e) => {
    const { area, address } = form.getFieldsValue(['area', 'address'])
    let text = '';
    if (area) {
      area.forEach(item => {
        text += item.label;
      })
    }
    if (address) {
      text += address
    }
    setAddressText(text)
  }

  useEffect(() => {
    map.current = new AMap.Map('container', {
      zoom: 20,
      center: [116.40396, 39.915118],
    });
    map.current.on('click', function (ev) {
      map.current.clearMap()
      const marker = new AMap.Marker({
        position: new AMap.LngLat(ev.lnglat.lng, ev.lnglat.lat),
      });
      map.current.add(marker)
      setLocation([ev.lnglat.lng, ev.lnglat.lat]);
    });
  }, []);

  useEffect(() => {
    if (addressText) {
      AMap.plugin('AMap.Autocomplete', function () {
        const autoOptions = {
          city: '全国'
        }
        const autoComplete = new AMap.Autocomplete(autoOptions);
        autoComplete.search(addressText, function (status, result) {
          // if (status === 'no_data') {
          //   message.error('地图获取不到经纬度信息，请重新填写所在地区或详细地址');
          //   return;
          // }
          if (result.info === 'OK') {
            map.current.clearMap()
            map.current.setZoomAndCenter(20, [result.tips[0].location.lng, result.tips[0].location.lat])
            const marker = new AMap.Marker({
              position: new AMap.LngLat(result.tips[0].location.lng, result.tips[0].location.lat),
            });
            map.current.add(marker)
            setLocation([result.tips[0].location.lng, result.tips[0].location.lat])
          }
        })
      })
    }
  }, [addressText])

  return (
    <DrawerForm
      title={`新建店铺`}
      onVisibleChange={setVisible}
      drawerProps={{
        forceRender: true,
        destroyOnClose: true,
        width: 800,
        onClose: () => {
          onClose();
        }
      }}
      onValuesChange={onValuesChange}
      form={form}
      onFinish={async (values) => {
        await submit(values);
        return true;
      }}
      visible={visible}
      initialValues={{
        depositStatus: 1,
        serviceFeeStatus: 1,
        applyType: 10,
      }}
      {...formItemLayout}
    >
      <ProFormText
        name="phone"
        label="店主手机号码"
        placeholder="请输入店主手机号码"
        rules={[{ required: true, message: '请输入店主手机号码' }]}
        fieldProps={{
          maxLength: 11,
          onChange: (e) => {
            if (/\d{11}/.test(e.target.value)) {
              searchGiftOrder(e.target.value);
            } else {
              setGiftInfo({});
            }
          }
        }}
        width="md"
      />
      <ProFormText
        name="storeName"
        label="店铺名称"
        placeholder="请输入店铺名称"
        rules={[{ required: true, message: '请输入店铺名称' }]}
        fieldProps={{
          maxLength: 30,
        }}
        width="md"
      />
      <ProFormRadio.Group
        name="applyType"
        label="申请类型"
        rules={[{ required: true }]}
        options={[
          {
            label: '正常申请',
            value: 10,
          },
          {
            label: '绿色通道申请',
            value: 20,
          },
        ]}
      />
      <ProFormDependency name={['applyType']}>
        {
          ({ applyType }) => {
            return applyType === 20 && <Form.Item
              label="证明材料"
              name="credentialList"
              rules={[{ required: true, message: '请上传证明材料' }]}
            >
              <FromWrap
                content={(value, onChange) => <Upload value={value} code={305} onChange={onChange} multiple maxCount={10} accept="image/*" size={1024} />}
                right={() => (
                  <dl>
                    <dt>图片要求</dt>
                    <dd>1.图片大小1MB以内</dd>
                    <dd>2.图片格式png/jpg/gif</dd>
                  </dl>
                )}
              />
            </Form.Item>
          }
        }
      </ProFormDependency>

      <Form.Item
        label="所在地区"
        rules={[{ required: true, message: '请选择所在地区' }]}
        name="area"
      >
        <AddressCascader style={{ width: 328 }} />
      </Form.Item>
      <ProFormText
        name="address"
        label="详细地址"
        placeholder="请输入详细地址"
        rules={[{ required: true, message: '请输入详细地址' }]}
        width="md"
      />
      <ProFormText
        name="houseNumber"
        label="门牌号"
        placeholder="请输入门牌号"
        rules={[{ required: true, message: '请输入门牌号' }]}
        width="md"
      />
      <ProFormText
        name="communityName"
        label="小区名称"
        placeholder="请输入小区名称"
        validateFirst
        rules={[
          { required: true, message: '请输入小区名称' },
          { required: true, message: '小区名称2-60个字符', min: 2, max: 60 },
        ]}
        fieldProps={{
          maxLength: 60,
        }}
        width="md"
      />
      <Form.Item
        label="开店礼包购买状态"
      >
        {
          giftInfo.isGiftOrdered !== 1 && '未购买过开店礼包'
        }
        {
          giftInfo.isGiftOrdered === 1
          &&
          <div style={{ display: 'flex' }}>
            <img width={50} height={50} src={giftInfo.goodsImageUrl} />
            <div style={{ marginLeft: 10 }}>
              <div>【<span style={{ color: 'red' }}>{{ 1: '待付款', 2: '待发货', 3: '已发货', 4: '已完成', 5: '已关闭' }[giftInfo.status]}</span>】{giftInfo.goodsName}</div>
              <div>订单编号：{giftInfo.orderSn}</div>
            </div>
          </div>
        }
      </Form.Item>
      <div id="container" style={{ width: '100%', height: 300, marginBottom: 10 }}></div>
      <ProFormText
        name="realname"
        label="店主姓名"
        placeholder="请输入店主姓名"
        rules={[{ required: true, message: '请输入店主姓名' }]}
        width="md"
        fieldProps={{
          placeholder: '请输入店主的真实姓名',
          maxLength: 30,
        }}
      />
      <ProFormText
        name="idNumber"
        label="店主身份证号"
        placeholder="请输入店主身份证号"
        rules={[{ required: true, message: '请输入店主身份证号' }]}
        width="md"
        fieldProps={{
          placeholder: '请输入店主的身份证号码',
          maxLength: 30,
        }}
      />
      <Form.Item
        label="审核资料文件"
        name="imageInfo"
        validateFirst
        rules={[
          () => ({
            required: true,
            validator(_, value = {}) {
              const { idCardFrontImg, idCardBackImg, idHandheld } = value;
              if (!idCardFrontImg) {
                return Promise.reject(new Error('请上身份证正面照片'));
              }
              if (!idCardBackImg) {
                return Promise.reject(new Error('请上传身份证背面照片'));
              }
              if (!idHandheld) {
                return Promise.reject(new Error('请上传手持身份证照片'));
              }
              return Promise.resolve();
            },
          })
        ]}
      >
        <FromWrap
          content={(value, onChange) => (<ImageInfo value={value} onChange={onChange} />)}
          right={
            <dl>
              <dt>图片要求</dt>
              <dd>1.图片大小1MB以内</dd>
              <dd>2.图片格式为：jpg/png/gif</dd>
            </dl>
          }
        />

      </Form.Item>
      <ProFormRadio.Group
        name="depositStatus"
        label="保证金缴纳状态"
        rules={[{ required: true }]}
        options={[
          {
            label: '未缴',
            value: 1,
          },
          {
            label: '已缴',
            value: 2,
          },
        ]}
      />
      <ProFormDependency name={['depositStatus']}>
        {({ depositStatus }) => {
          return depositStatus === 2 &&
            <ProFormText
              name="depositValue"
              label="保证金金额"
              placeholder="请输入保证金金额"
              rules={[{ required: true, message: '请输入保证金金额' }]}
              width="md"
              fieldProps={{
                placeholder: '请输入保证金金额',
                maxLength: 30,
                suffix: '元'
              }}
            />
        }}
      </ProFormDependency>

      <ProFormRadio.Group
        name="serviceFeeStatus"
        label="服务费缴费状态"
        rules={[{ required: true }]}
        options={[
          {
            label: '未缴',
            value: 1,
          },
          {
            label: '已缴',
            value: 2,
          },
        ]}
      />
      <ProFormDependency name={['serviceFeeStatus']}>
        {({ serviceFeeStatus }) => {
          return serviceFeeStatus === 2 &&
            <ProFormText
              name="serviceFee"
              label="服务费金额"
              placeholder="请输入服务费金额"
              rules={[{ required: true, message: '请输入服务费金额' }]}
              width="md"
              fieldProps={{
                placeholder: '请输入服务费金额',
                maxLength: 30,
                suffix: '元'
              }}
            />
        }}
      </ProFormDependency>
    </DrawerForm>
  );
};
