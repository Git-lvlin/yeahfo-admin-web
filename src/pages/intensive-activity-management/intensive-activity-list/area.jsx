import React, { useState, useEffect } from 'react';
import { Form } from 'antd';
import {
  ModalForm,
} from '@ant-design/pro-form';
import {
  getWholesaleArea,
  updateWholesaleArea,
} from '@/services/intensive-activity-management/intensive-activity-list'
import AddressMultiCascader from '@/components/address-multi-cascader'
import './area.less';

export default (props) => {
  const { visible, setVisible, wsId } = props;
  const [form] = Form.useForm();
  const [areaData, setAreaData] = useState([]);
  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
    layout: {
      labelCol: {
        span: 4,
      },
      wrapperCol: {
        span: 14,
      },
    }
  };

  const getAreaData = (v) => {
    const arr = [];
    if (v[0] === 0) {
      return '';
    }
    v.forEach(item => {
      let deep = 0;
      let node = window.yeahgo_area.find(it => it.id === item);
      const nodeIds = [node.id];
      const nodeNames = [node.name]
      while (node.pid) {
        deep += 1;
        node = window.yeahgo_area.find(it => it.id === node.pid);
        nodeIds.push(node.id);
        nodeNames.push(node.name);
      }
      arr.push({
        provinceId: nodeIds[deep],
        cityId: deep > 0 ? nodeIds[deep - 1] : 0,
        areaId: deep > 1 ? nodeIds[deep - 2] : 0,
        areaName: nodeNames.reverse().join('')
      })
    })

    return arr;
  }

  const submit = (values) => {
    return new Promise((resolve, reject) => {
      updateWholesaleArea({
        wsId,
        allowArea: getAreaData(values.allowArea)
      }, { showSuccess: true })
        .then(res => {
          if (res.code === 0) {
            resolve()
          } else {
            reject()
          }
        })
    });
  }

  const getAreas = (areas = []) => {
    const areaArr = [];
    for (let index = 0; index < areas.length; index++) {
      const refuseArea = areas[index];
      if (refuseArea.areaId) {
        areaArr.push(refuseArea.areaId)
        continue;
      }
      if (refuseArea.cityId) {
        areaArr.push(refuseArea.cityId)
        continue;
      }
      areaArr.push(refuseArea.provinceId)
    }
    return areaArr;
  }

  useEffect(() => {
    getWholesaleArea({
      wsId
    }).then(res => {
      if (res.code === 0) {
        form.setFieldsValue({
          allowArea: getAreas(res.data.allowArea)
        })
      }
    })
    const data = JSON.parse(JSON.stringify(window.yeahgo_area))
    data.unshift({ name: '全国', id: 0, pid: -1 })
    setAreaData(data)
  }, [])

  return (
    <ModalForm
      title={<>修改售卖区域<span style={{ marginLeft: 10, fontSize: 12, color: '#0000006d' }}>请设置集约活动要售卖的区域</span></>}
      onVisibleChange={setVisible}
      visible={visible}
      width={700}
      form={form}
      onFinish={async (values) => {
        await submit(values);
        return true;
      }}
      {...formItemLayout}
    >
      <Form.Item
        name="allowArea"
        label="可集约店铺区域"
        rules={[{ required: true, message: '请选择可集约店铺区域' }]}
      >
        <AddressMultiCascader
          data={areaData}
          style={{ width: '640px' }}
          pId={-1}
          preventOverflow
        />
      </Form.Item>
    </ModalForm >
  );
};