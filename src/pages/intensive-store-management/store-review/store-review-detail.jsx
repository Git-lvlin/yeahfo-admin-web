import React, { useEffect, useState, useRef } from 'react';
import { Form, Spin, Space, Image, Button, message } from 'antd';
import { storeDetail } from '@/services/intensive-store-management/store-review';
import ProForm, { ProFormText, DrawerForm } from '@ant-design/pro-form';
import AddressCascader from '@/components/address-cascader'
import Upload from '@/components/upload';
import RejectForm from './refuse';
import { amountTransform } from '@/utils/utils'
import { approve } from '@/services/intensive-store-management/store-review'
import OrderDetail from '@/pages/order-management/normal-order/detail';


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
  useEffect(() => {
    setIdHandheld(value?.idHandheld)
    setIdCardFrontImg(value?.idCardFrontImg)
    setIdCardBackImg(value?.idCardBackImg)
  }, [value])
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

const orderStatus = { 1: '待付款', 2: '待发货', 3: '已发货', 4: '已完成', 5: '已关闭' };

const Detail = (props) => {
  const { setVisible } = props;
  const [detailData, setDetailData] = useState({});
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm()
  const [addressText, setAddressText] = useState('');
  const [location, setLocation] = useState([]);
  const [rejectFormVisible, setRejectFormVisible] = useState(false);
  const [orderDetailVisible, setOrderDetailVisible] = useState(false);
  const [selectItem, setSelectItem] = useState({});
  const map = useRef();

  const submit = (values) => {
    const { area, imageInfo, serviceFee, ...rest } = values;
    return new Promise((resolve, reject) => {
      let userInfo = window.localStorage.getItem('user');
      userInfo = userInfo && JSON.parse(userInfo)
      approve({
        ...rest,
        provinceId: area[0].value,
        provinceName: area[0].label,
        cityId: area[1].value,
        cityName: area[1].label,
        regionId: area[2].value,
        regionName: area[2].label,
        applyId: props.id,
        optAdminId: userInfo.id,
        optAdminName: userInfo.username,
        longitude: location[0],
        latitude: location[1],
        // realname: detailData.details.realname,
        // idNumber: detailData.details.idNumber,
        idFront: imageInfo.idCardFrontImg,
        idBack: imageInfo.idCardBackImg,
        idHandheld: imageInfo.idHandheld,
        memberId: detailData.memberId,
        verifyStatus: detailData.verifyStatus.code,
        deposit: detailData.deposit.length === 0 ? amountTransform(values.depositValue) : 0,
        serviceFee: detailData.lastServiceFee.id ? detailData.lastServiceFee.payAmount : amountTransform(serviceFee),
      }, { showSuccess: true }).then(res => {
        if (res.code === 0) {
          resolve()
          props.callback();
        } else {
          reject()
        }
      })
    });
  }


  useEffect(() => {
    setLoading(true);
    storeDetail({
      applyId: props.id
    }).then(res => {
      if (res.code === 0) {
        setDetailData(res.data)

        const { details } = res.data;

        form.setFieldsValue({
          area: [
            { label: details.provinceName, value: details.provinceId },
            { label: details.cityName, value: details.cityId },
            { label: details.regionName, value: details.regionId },
          ],
          address: details.address,
          houseNumber: details.houseNumber,
          communityName: details.communityName,
          imageInfo: {
            idCardFrontImg: details.idFront,
            idCardBackImg: details.idBack,
            idHandheld: details.idHandheld,
          },
          realname: details?.realname,
          idNumber: details?.idNumber,
        })

        setLocation([details.longitude || 0, details.latitude || 0]);
        map.current = new AMap.Map('container', {
          zoom: 20,
          center: [details.longitude || 0, details.latitude || 0],
        });
        map.current.add(new AMap.Marker({
          position: new AMap.LngLat(details.longitude || 0, details.latitude || 0),
        }))
        map.current.on('click', function (ev) {
          map.current.clearMap()
          const marker = new AMap.Marker({
            position: new AMap.LngLat(ev.lnglat.lng, ev.lnglat.lat),
          });
          map.current.add(marker)
          setLocation([ev.lnglat.lng, ev.lnglat.lat]);
        });
        setAddressText(`${details.provinceName}${details.cityName}${details.regionName}${details.address}`)
      }
    }).finally(() => {
      setLoading(false);
    })

  }, [])

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
      {...formItemLayout}
      title="店铺审核"
      visible={props?.visible}
      onVisibleChange={props?.setVisible}
      // style={{ width: }}
      width="1200"
      form={form}
      onValuesChange={onValuesChange}
      submitter={{
        render: (props, doms) => {
          return (
            <Space>
              <Button type="primary" onClick={() => props.form?.submit()}>
                通过
              </Button>
              <Button type="danger" onClick={() => {
                setRejectFormVisible(true);
              }}>驳回</Button>
              <Button onClick={() => {
                setVisible(false)
              }}>
                返回
              </Button>
            </Space>
          )
        }
      }}
      onFinish={async (values) => {
        try {
          await submit(values);
          return true;
        } catch (error) {
          console.log('error', error);
        }
      }}
    >
      <Spin
        spinning={loading}
      >
        {
          rejectFormVisible
          &&
          <RejectForm
            visible={rejectFormVisible}
            setVisible={setRejectFormVisible}
            id={props?.id}
            callback={props?.callback}
          />
        }
        <Form.Item
          label="手机号"
        >
          {detailData?.details?.phone}
        </Form.Item>
        <Form.Item
          label="店铺名称"
        >
          {detailData?.details?.storeName}
        </Form.Item>
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
          label=" "
          colon={false}
        >
          <div id="container" style={{ width: 600, height: 300 }}></div>
        </Form.Item>
        <Form.Item
          label="必备礼包订单号"
        >
          {
            detailData?.details?.giftOrder?.isGiftOrdered === 0 && <span style={{ color: 'red' }}>没有购买记录</span>
          }
          {
            detailData?.details?.giftOrder?.isGiftOrdered === 1
            && <a onClick={() => { setSelectItem({ id: detailData?.details?.giftOrder?.id }); setOrderDetailVisible(true) }}>{detailData?.details?.giftOrder?.orderSn}【{orderStatus[detailData?.details?.giftOrder?.status]}】 </a>
          }
        </Form.Item>
        <Form.Item
          label="申请类型"
        >
          {{ 10: '正常申请', 20: '绿色通道申请' }[detailData?.details?.applyType]}
        </Form.Item>
        {detailData?.details?.applyType === 20 && <Form.Item
          label="证明文件"
        >
          {
            detailData?.details?.credentialList.map(item => (<Image style={{ marginRight: 10 }} width={50} height={50} src={item} key={item} />))
          }
        </Form.Item>}
        <ProFormText
          name="realname"
          label="姓名"
          placeholder="请输入姓名"
          rules={[{ required: true, message: '请输入姓名' }]}
          width="md"
        />
        <ProFormText
          name="idNumber"
          label="身份证号"
          placeholder="请输入身份证号"
          rules={[{ required: true, message: '请输入身份证号' }]}
          width="md"
        />
        {/* <Form.Item
            label="姓名"
          >
            {detailData?.details?.realname}
          </Form.Item> */}
        {/* <Form.Item
            label="身份证号"
          >
            {detailData?.details?.idNumber}
          </Form.Item> */}
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
        <Form.Item
          label="申请时间"
        >
          {detailData?.createTime}
        </Form.Item>
        {
          !!detailData?.deposit?.payAmount
          &&
          <>
            <Form.Item
              label="保证金缴纳状态"
            >
              已交（¥{amountTransform(detailData?.deposit?.payAmount, '/')}）
            </Form.Item>
            <Form.Item
              label="保证金缴纳时间"
            >
              {detailData?.deposit?.payTime}
            </Form.Item>
          </>
        }
        {
          detailData?.deposit?.length === 0
          && <ProFormText
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
        }
        {
          !!detailData?.lastServiceFee?.id
          &&
          <>
            <Form.Item
              label="服务费金额"
            >
              ¥{amountTransform(detailData?.lastServiceFee?.payAmount, '/')}
            </Form.Item>
            <Form.Item
              label="服务费缴纳时间"
            >
              {detailData?.lastServiceFee?.payTime}
            </Form.Item>
          </>
        }
        {
          detailData?.lastServiceFee?.id === 0
          && <ProFormText
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
        }
        {
          orderDetailVisible &&
          <OrderDetail
            id={selectItem?.id}
            visible={orderDetailVisible}
            setVisible={setOrderDetailVisible}
          />
        }
      </Spin>

    </DrawerForm>
  )
}

export default Detail;
