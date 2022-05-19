import React, { useState, useEffect, useRef } from 'react';
import { Form, message } from 'antd';
import {
  DrawerForm,
  ProFormText,
} from '@ant-design/pro-form';
import AddressCascader from '@/components/address-cascader'
import { changeAreaInfo } from '@/services/intensive-store-management/store-detail'


export default (props) => {
  const { visible, setVisible, data, callback = () => { }, onClose = () => { } } = props;
  const [form] = Form.useForm()
  const [addressText, setAddressText] = useState('');
  const [location, setLocation] = useState([]);
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
      const { area, ...rest } = values;
      let userInfo = window.localStorage.getItem('user');
      userInfo = userInfo && JSON.parse(userInfo)
      changeAreaInfo({
        storeNo: data.storeNo,
        optReason: '',
        provinceName: area[0].label,
        provinceId: area[0].value,
        cityName: area[1].label,
        cityId: area[1].value,
        regionName: area[2]?.label,
        regionId: area[2]?.value,
        longitude: location[0],
        latitude: location[1],
        optAdminId: userInfo.id,
        optAdminName: userInfo.username,
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

  const onValuesChange = () => {
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
    map.current = new AMap.Map('container2', {
      zoom: 20,
      center: [data.longitude, data.latitude],
    });
    map.current.on('click', function (ev) {
      map.current.clearMap()
      const marker = new AMap.Marker({
        position: new AMap.LngLat(ev.lnglat.lng, ev.lnglat.lat),
      });
      map.current.add(marker)
      setLocation([ev.lnglat.lng, ev.lnglat.lat]);
    });
    const marker = new AMap.Marker({
      position: new AMap.LngLat(data.longitude, data.latitude),
    });
    map.current.add(marker)
    setLocation([data.longitude, data.latitude])
    // const keys = Object.keys(data.areaInfo);
    const areaData = [
      {
        label: data.areaInfo[data.provinceId],
        value: data.provinceId,
      }, {
        label: data.areaInfo[data.cityId],
        value: data.cityId,
      },
      {
        label: data.areaInfo[data.regionId],
        value: data.regionId,
      }
    ]

    form.setFieldsValue({
      area: areaData,
      address: data.address,
      houseNumber: data.houseNumber,
      communityName: data.memberShop.communityName
    })
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
      title={`地址编辑`}
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
      {...formItemLayout}
    >
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
      <div id="container2" style={{ width: '100%', height: 300, marginBottom: 10 }}></div>
    </DrawerForm>
  );
};
