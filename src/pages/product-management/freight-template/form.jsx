import React, { useEffect, useState } from 'react';
import ProCard from '@ant-design/pro-card';
import { Select, Form, Input } from 'antd';
import styles from './style.less';
import {
  ProFormText,
  DrawerForm,
  ProFormRadio,
  ProFormDependency,
} from '@ant-design/pro-form';
import { findAllProvinces, postageSave } from '@/services/product-management/freight-template'
// import form from '../product-list/form';

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

export default (props) => {
  const { onClose, visible, setVisible, detailData, callback } = props;
  const [originArea, setOriginArea] = useState([]);
  const [specificArea, setSpecificArea] = useState([]);
  const [selectSpecificArea, setSelectSpecificArea] = useState([]);
  const [nonDeliveryArea, setNonDeliveryArea] = useState([]);
  const [selectNonDeliveryArea, setSelectNonDeliveryArea] = useState([]);
  const [deleteArr, setDeleteArr] = useState([]);
  const [form] = Form.useForm();

  const submit = (values) => {
    const { expressName, maxFee, feeOption, isHasNotArea, isHasFree } = values;
    let notConfigure;
    let configure;
    const params = {
      id: detailData ? detailData.id : 0,
      expressName,
      maxFee,
      isHasNotArea,
      isHasFree,
      isHasArea: feeOption.length >= 2 ? 1 : 0
    };

    if (values.notConfigure) {
      const obj = {};
      // eslint-disable-next-line no-return-assign
      values.notConfigure?.forEach(item2 => obj[item2] = [])
      notConfigure = {
        aid: detailData?.notExpressArea?.id ?? 0,
        area: obj
      }
      params.notConfigure = notConfigure;
    }

    if (!isHasNotArea && detailData?.notExpressArea?.id) {
      notConfigure = {
        aid: detailData?.notExpressArea?.id,
        area: {}
      }
      params.notConfigure = notConfigure;
    }

    if (feeOption) {
      configure = feeOption.map(item => {
        const { area, id, ...rest } = item;
        const obj = {};
        // eslint-disable-next-line no-return-assign
        area?.forEach(item2 => obj[item2] = [])
        return {
          aid: area ? (id ?? 0) : -1,
          area: obj,
          set: rest,
        }
      })
      params.configure = configure;
    }

    if (detailData) {
      const removeArr = new Set(deleteArr);
      const ids = [];
      removeArr.forEach(item => {
        if (detailData?.expressArea?.[item]?.id) {
          ids.push(detailData?.expressArea?.[item]?.id)
        }
      })
      params.remove = ids
    }


    return new Promise((resolve, reject) => {
      postageSave(params, { showSuccess: true })
        .then(res => {
          if (res.code === 0) {
            resolve()
          } else {
            reject()
          }
        })
        .catch(() => {
          reject()
        })
    });
  }

  const onValuesChange = (changedValues, allValues) => {
    if (allValues.notConfigure) {
      setSelectNonDeliveryArea(allValues.notConfigure || [])
    }
    if (allValues.feeOption) {
      const areaArr = [];
      allValues.feeOption.forEach(item => {
        if (item?.area) {
          areaArr.push(...item.area)
        }
      })
      setSelectSpecificArea(areaArr)
    }
  }

  useEffect(() => {
    setNonDeliveryArea(originArea.map(item => {
      if (selectSpecificArea.includes(item.value)) {
        return {
          ...item,
          disabled: true,
        }
      }
      return item;
    }));
  }, [selectSpecificArea])

  useEffect(() => {
    setSpecificArea(originArea.map(item => {
      if (selectNonDeliveryArea.includes(item.value)) {
        return {
          ...item,
          disabled: true,
        }
      }
      return item;
    }));
  }, [selectNonDeliveryArea])

  useEffect(() => {
    findAllProvinces()
      .then(res => {
        if (res.code === 0) {
          const areaArr = res.data.map(item => ({ label: item.name, value: `${item.id}` }))
          setOriginArea(areaArr)
          setSpecificArea(areaArr)
          setNonDeliveryArea(areaArr)
        }
      })
  }, [])

  useEffect(() => {
    if (detailData) {
      const feeOption = [JSON.parse(detailData.configure)]

      if (detailData.expressArea) {
        detailData.expressArea.forEach(item => {
          const { configure, citys, id } = item;
          feeOption.push({
            area: Object.keys(citys || {}),
            ...JSON.parse(configure),
            id,
          })
        })
      }

      form.setFieldsValue({
        expressName: detailData.expressName,
        isHasNotArea: detailData.isHasNotArea,
        isHasFree: detailData.isHasFree,
        maxFee: detailData.maxFee,
        feeOption,
        notConfigure: Object.keys(detailData?.notExpressArea?.citys || {})
      })
    }
  }, [form, detailData])

  return (
    <DrawerForm
      title="????????????"
      onVisibleChange={setVisible}
      drawerProps={{
        forceRender: true,
        destroyOnClose: true,
        width: 1200,
        onClose: () => {
          onClose();
        }
      }}
      form={form}
      onFinish={async (values) => {
        await submit(values);
        callback();
        return true;
      }}
      visible={visible}
      initialValues={{
        feeOption: [
          {

          },
        ],
        isHasNotArea: 1,
        isHasFree: 1
      }}
      onValuesChange={onValuesChange}
      {...formItemLayout}
    >
      <Form.Item
        name="expressName"
        label="????????????"
        placeholder="?????????????????????"
        rules={[{ required: true, message: '?????????????????????' }]}
      >
        <Input maxLength={20} style={{ width: 300 }} />
      </Form.Item>
      <ProFormRadio.Group
        name="isHasNotArea"
        label="?????????????????????"
        options={[
          {
            label: '???',
            value: 1,
          },
          {
            label: '??????',
            value: 0,
          },
        ]}
      />
      <ProFormRadio.Group
        name="isHasFree"
        label="??????????????????"
        options={[
          {
            label: '???',
            value: 1,
          },
          {
            label: '??????',
            value: 0,
          },
        ]}
      />
      <Form.Item
        name="no"
        label="????????????"
      />
      <ProCard split="horizontal" bordered headerBordered style={{ marginBottom: 20 }}>
        <ProCard split="vertical" className={styles.header}>
          <ProCard colSpan="85px" className={styles.card}>????????????</ProCard>
          <ProCard colSpan="180px" className={styles.card}>??????????????????</ProCard>
          <ProCard className={styles.card}>????????????</ProCard>
          <ProFormDependency name={['isHasFree']}>
            {({ isHasFree }) => {
              return isHasFree === 1 && <ProCard colSpan="140px" className={styles.card} style={{ borderRight: '1px solid #f0f0f0' }}>????????????</ProCard>
            }}
          </ProFormDependency>
          <ProCard colSpan="140px" className={styles.card}>??????</ProCard>
        </ProCard>
        <ProCard split="vertical" className={styles.normal}>
          <ProCard colSpan="85px" className={styles.card}>??????????????????????????????????????????????????????????????????</ProCard>
          <ProCard className={styles.normal} split="horizontal">
            <Form.List name="feeOption">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, fieldKey, ...restField }) => {
                    return (
                      <ProCard
                        key={key}
                        className={styles.normal}
                        split="vertical"
                        style={{ flex: 1, borderBottom: key !== fields.length - 1 ? '1px solid #f0f0f0' : '' }}
                      >
                        <Form.Item
                          name={[name, 'id']}
                          fieldKey={[fieldKey, 'id']}
                          hidden
                        >
                          <Input style={{ width: 50 }} />
                        </Form.Item>
                        <ProCard colSpan="180px" className={styles.card}>
                          {
                            key === 0
                              ?
                              '??????'
                              :
                              <Form.Item
                                style={{ marginBottom: 0, width: '100%' }}
                                {...restField}
                                name={[name, 'area']}
                                fieldKey={[fieldKey, 'area']}
                              >
                                <Select
                                  mode="multiple"
                                  allowClear
                                  style={{ width: 150 }}
                                  placeholder="??????????????????"
                                  options={specificArea}
                                />
                              </Form.Item>
                          }
                        </ProCard>
                        <ProCard className={styles.normal} split="horizontal">
                          <ProCard className={styles.card} style={{ flex: 1 }}>
                            <Form.Item
                              style={{ marginBottom: 0 }}
                              {...restField}
                              name={[name, 'nw']}
                              fieldKey={[fieldKey, 'nw']}
                            >
                              <Input style={{ width: 50 }} />
                            </Form.Item>
                            &nbsp;???????????????&nbsp;
                            <Form.Item
                              style={{ marginBottom: 0 }}
                              {...restField}
                              name={[name, 'price']}
                              fieldKey={[fieldKey, 'price']}
                            >
                              <Input style={{ width: 50 }} />
                            </Form.Item>
                            &nbsp;???????????????&nbsp;
                            <Form.Item name={[name, 'add']} fieldKey={[fieldKey, 'add']} style={{ marginBottom: 0 }}>
                              <Input style={{ width: 50 }} />
                            </Form.Item>
                            &nbsp;??????????????????&nbsp;
                            <Form.Item name={[name, 'addPrice']} fieldKey={[fieldKey, 'addPrice']} style={{ marginBottom: 0 }}>
                              <Input style={{ width: 50 }} />
                            </Form.Item>
                            &nbsp;???
                          </ProCard>
                          {/* <ProCard className={styles.card} style={{ flex: 1 }}>
                            ?????????&nbsp;
                            <Form.Item name="area5" style={{ marginBottom: 0 }}>
                              <Input style={{ width: 50 }} />
                            </Form.Item>
                            &nbsp;???????????????&nbsp;
                            <Form.Item name="area6" style={{ marginBottom: 0 }}>
                              <Input style={{ width: 50 }} />
                            </Form.Item>
                            &nbsp;???????????????&nbsp;
                            <Form.Item name={[name, 'addPrice']} fieldKey={[fieldKey, 'addPrice']} style={{ marginBottom: 0 }}>
                              <Input style={{ width: 50 }} />
                            </Form.Item>
                            &nbsp;??????????????????&nbsp;
                            <Form.Item name="area8" style={{ marginBottom: 0 }}>
                              <Input style={{ width: 50 }} />
                            </Form.Item>
                            &nbsp;???
                          </ProCard> */}
                        </ProCard>
                        <ProFormDependency name={['isHasFree']}>
                          {({ isHasFree }) => {
                            return isHasFree === 1 && <ProCard colSpan="140px" className={styles.normal} split="horizontal" style={{ borderRight: '1px solid #f0f0f0' }}>
                              <ProCard className={styles.card} style={{ flex: 1 }}>
                                ???&nbsp;
                                <Form.Item name={[name, 'oNw']} fieldKey={[fieldKey, 'oNw']} style={{ marginBottom: 0 }}>
                                  <Input style={{ width: 50 }} />
                                </Form.Item>
                                &nbsp;?????????
                              </ProCard>
                              <ProCard className={styles.card} style={{ flex: 1 }}>
                                ???&nbsp;
                                <Form.Item name={[name, 'oMoney']} fieldKey={[fieldKey, 'oMoney']} style={{ marginBottom: 0 }}>
                                  <Input style={{ width: 50 }} />
                                </Form.Item>
                                &nbsp;?????????
                              </ProCard>
                            </ProCard>
                          }}
                        </ProFormDependency>

                        <ProCard colSpan="140px" className={styles.card}>
                          {
                            key === 0 ? <a onClick={() => { add() }}>?????????????????????<br />???????????????????????????</a> :
                              <a onClick={() => {
                                const arr = [...deleteArr];
                                arr.push(name - 1)
                                setDeleteArr(arr);
                                remove(name)
                              }}>??????</a>
                          }
                        </ProCard>
                      </ProCard>
                    )
                  })}
                </>
              )}
            </Form.List>

          </ProCard>

        </ProCard>

        <ProFormDependency name={['isHasNotArea']}>
          {({ isHasNotArea }) => {
            return isHasNotArea === 1 && <ProCard split="vertical" className={styles.normal} style={{ borderBottom: '1px solid #f0f0f0' }}>
              <ProCard colSpan="85px" className={styles.card}>???????????????</ProCard>
              <ProCard className={styles.card}>
                <Form.Item
                  style={{ marginBottom: 0, width: '100%', display: 'flex', justifyContent: 'center' }}
                  name="notConfigure"
                >
                  <Select
                    mode="multiple"
                    allowClear
                    style={{ width: 600 }}
                    placeholder="???????????????????????????"
                    options={nonDeliveryArea}
                  />
                </Form.Item>
              </ProCard>
            </ProCard>
          }}
        </ProFormDependency>


        {/* <ProCard split="vertical" className={styles.normal}>
          <ProCard colSpan="85px" className={styles.card}>????????????</ProCard>
          <ProCard className={styles.card}>
            XXX??????????????????<br />
            YYY?????????M???/??????????????????M???/??????Q???/??????H???????????????P???/?????????/??????L??????<br />
            ???????????????N???/??????????????????M???/??????Q???/??????H???????????????P???/?????????/??????L??????<br />
          </ProCard>
        </ProCard> */}
      </ProCard>
      <ProFormText
        label="??????????????????"
        name="maxFee"
        fieldProps={{
          style: { width: 300 }
        }}
      />
    </DrawerForm>
  );
};