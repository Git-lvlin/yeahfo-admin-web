import React, { useState, useEffect, useRef } from 'react';
import { Button, Space, Tooltip, Image, Menu, Dropdown } from 'antd';
import ProTable from '@ant-design/pro-table';
import ProCard from '@ant-design/pro-card';
import { QuestionCircleOutlined } from '@ant-design/icons'
import { PageContainer } from '@/components/PageContainer';
import { getStoreList, applyConditionPage } from '@/services/intensive-store-management/store-list';
import { history } from 'umi';
import AddressCascader from '@/components/address-cascader';
import { getAuth } from '@/components/auth';
import Form from './form';
import Create from './create';
import Return from './return';
import ExcelModal from './excel-modal'
import GradeChange from './grade-change'
import Export from '@/pages/export-excel/export'
import ExportHistory from '@/pages/export-excel/export-history'
import { amountTransform } from '@/utils/utils'
import Detail from './detail';
import AuditInfo from './audit-info';
import OrderDetail from '@/pages/order-management/normal-order/detail';
import styles from './style.less'
import ContentModel from './content-model';

const StoreList = (props) => {
  const { storeType } = props
  const [visible, setVisible] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [createVisible, setCreateVisible] = useState(false);
  const [returnVisible, setReturnVisible] = useState(false);
  const [excelVisible, setExcelVisible] = useState(false);
  const [selectItem, setSelectItem] = useState(null);
  const [visit, setVisit] = useState(false)
  const [detailVisible, setDetailVisible] = useState(false);
  const [orderVisible, setOrderVisible] = useState(false)
  const [orderId, setOrderId] = useState()
  const [auditInfoVisible, setAuditInfoVisible] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [gradeChangeVisible, setGradeChangeVisible] = useState(false);
  const [attachmentImage, setAttachmentImage] = useState()
  const actionRef = useRef();
  const formRef = useRef();

  const handleMenuClick = ({ key }, data) => {
    if (key === '1') {
      setSelectItem({ ...data, type: 1 })
      setReturnVisible(true)
    }
    if (key === '2') {
      setSelectItem({ ...data, type: 2 })
      setReturnVisible(true)
    }

    if (key === '3') {
      setSelectItem({ ...data, toStatus: 3 })
      setFormVisible(true)
    }

    if (key === '4') {
      setSelectItem({ ...data, toStatus: 1 })
      setFormVisible(true)
    }

    if (key === '5') {
      setSelectItem({ ...data, toStatus: 2 })
      setFormVisible(true)
    }

    if (key === '6') {
      setSelectItem(data)
      setAuditInfoVisible(true)
    }

    if (key === '7') {
      setSelectItem(data)
      setGradeChangeVisible(true)
    }

  }

  const menu = (data) => {
    return (
      <Menu onClick={(e) => { handleMenuClick(e, data) }}>
        {data.status.code === 2 && <Menu.Item key="1">????????????????????????</Menu.Item>}
        {data.status.code === 2 && <Menu.Item key="2">???????????????????????????</Menu.Item>}
        {data.status.code === 1 && <Menu.Item key="3">??????</Menu.Item>}
        {data.status.code === 3 && <Menu.Item key="4">??????</Menu.Item>}
        {data.status.code === 3 && <Menu.Item key="5">??????</Menu.Item>}
        <Menu.Item key="6">????????????</Menu.Item>
        {getAuth('store/member_shop/grade') && <Menu.Item key="7">
          ??????????????????
        </Menu.Item>}
      </Menu>
    )
  }

  const columns = [
    {
      title: '??????ID',
      dataIndex: 'id',
      valueType: 'text',
      fieldProps: {
        placeholder: '???????????????ID'
      }
    },
    // {
    //   title: '????????????',
    //   dataIndex: 'storeLogo',
    //   valueType: 'text',
    //   hideInSearch: true,
    //   render: (_) => <img src={_} width="50" height="50" />
    // },
    {
      title: '??????????????????',
      dataIndex: 'shopMemberAccount',
      valueType: 'text',
      fieldProps: {
        placeholder: '???????????????????????????'
      },
      hideInTable: storeType == 'freshStores',
      hideInSearch: storeType == 'freshStores',
    },
    {
      title: '???????????????',
      dataIndex: 'memberPhone',
      valueType: 'text',
      fieldProps: {
        placeholder: '????????????????????????'
      },
      hideInTable: true,
    },
    {
      title: '??????',
      dataIndex: 'phone',
      valueType: 'text',
      hideInSearch: true,
      render: (_, data) => <div><div>{data.memberPhone}</div><div>{data.nickname === data.memberPhone ? '' : data.nickname}</div></div>
    },
    {
      title: '????????????',
      dataIndex: 'memberShopType',
      valueType: 'text',
      hideInSearch: true,
      render: (_, data) => {
        return <div>{_.desc}</div>
      },
      hideInTable: storeType == 'freshStores',
    },
    {
      title: '????????????',
      dataIndex: 'storeName',
      valueType: 'text',
      fieldProps: {
        placeholder: '?????????????????????'
      },
    },
    {
      title: '??????',
      dataIndex: ['level', 'levelName'],
      valueType: 'text',
      hideInSearch: true,
    },
    // {
    //   title: '??????',
    //   dataIndex: 'score',
    //   valueType: 'text',
    //   hideInSearch: true,
    // },
    {
      title: '?????????????????????',
      dataIndex: '',
      valueType: 'text',
      hideInSearch: true,
      render: (_, details) => {
        return (
          <>
            {details?.areaInfo?.[details?.provinceId]}{details?.areaInfo?.[details?.cityId]}{details?.areaInfo?.[details?.regionId]}
          </>)
      },
    },
    {
      title: '?????????????????????',
      dataIndex: 'address',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '?????????',
      dataIndex: 'isOrdered',
      valueType: 'select',
      hideInSearch: storeType != 'freshStores',
      hideInTable: true,
      valueEnum: {
        1: '?????????',
        0: '?????????'
      },
    },
    {
      title: '??????????????????',
      dataIndex: 'isOrdered',
      valueType: 'text',
      hideInSearch: true,
      render: (_, data) => {
        return <a onClick={() => { setOrderVisible(true); setOrderId(data?.freshOrder?.id) }}>{data?.freshOrder?.orderSn}</a>
      },
      hideInTable: storeType != 'freshStores',
    },
    {
      title: '??????????????????',
      dataIndex: 'isGiftOrdered',
      valueType: 'select',
      hideInSearch: storeType != 'freshStores',
      hideInTable: true,
      valueEnum: {
        1: '?????????',
        0: '?????????'
      },
    },
    {
      title: '???????????????????????????',
      dataIndex: 'isGiftOrdered',
      valueType: 'text',
      hideInSearch: true,
      render: (_, data) => {
        return <a onClick={() => { setOrderVisible(true); setOrderId(data?.giftOrder?.id) }}>{data?.giftOrder?.orderSn}</a>
      },
      hideInTable: storeType != 'freshStores',
    },
    {
      title: '??????????????????',
      dataIndex: 'memberShopType',
      valueType: 'select',
      hideInTable: true,
      hideInSearch: storeType == 'freshStores',
      valueEnum: {
        0: '??????',
        20: '????????????',
        10: '???????????????'
      },
    },
    {
      title: '??????????????????',
      dataIndex: 'verifyStatus',
      valueType: 'text',
      hideInSearch: true,
      hideInTable: storeType == 'freshStores',
      valueEnum: {
        "0": '???????????????',
        "1": '????????????',
        "2": '???????????????',
        "5": '????????????',
        "6": '?????????'
      },
    },
    {
      title: '??????????????????',
      dataIndex: 'operationCompanyName',
      valueType: 'text',
      hideInTable: true,
      hideInSearch: storeType == 'freshStores',
      fieldProps: {
        placeholder: '???????????????????????????'
      },
    },
    {
      title: '??????????????????ID',
      dataIndex: 'operationId',
      valueType: 'text',
      hideInSearch: true,
      hideInTable: storeType == 'freshStores',
      render: (_, data) => {
        return <div>{_ == 0 ? '-' : _}</div>
      }
    },
    {
      title: '????????????????????????',
      dataIndex: 'operationCompanyName',
      valueType: 'text',
      hideInSearch: true,
      hideInTable: storeType == 'freshStores',
    },
    {
      title: '????????????',
      dataIndex: 'applyType',
      valueType: 'select',
      valueEnum: {
        10: '????????????',
        20: '??????????????????',
      },
      hideInTable: true,
      hideInSearch: storeType == 'freshStores',
    },
    {
      title: '????????????',
      dataIndex: storeType === 'freshStores' ? 'applyType' : ['applyType', 'code'],
      valueType: 'text',
      render: (_) => _ === 10 ? '????????????' : '??????????????????',
      hideInSearch: true,
      hideInTable: storeType == 'freshStores',
    },
    {
      title: '???????????????',
      dataIndex: 'phone',
      fieldProps: {
        placeholder: '??????????????????????????????'
      },
      hideInTable: storeType == 'freshStores'
    },
    {
      title: '????????????',
      dataIndex: 'wholeTotal',
      valueType: 'text',
      hideInSearch: true,
      render: (_, data) => {
        return _ > 0
          ?
          <a
            onClick={() => {
              history.push({
                pathname: `/intensive-store-management/intensive-task/${data.storeNo}`,
                query: {
                  storeName: data.storeName,
                  phone: data.phone,
                  linkman: data.nickname === data.memberPhone ? '???????????????' : data.nickname,
                  memberId: data.memberId,
                }
              })
            }}>
            {_}
          </a>
          : _
      },
      hideInTable: storeType == 'freshStores'
    },
    {
      title: '????????????',
      dataIndex: 'saleOrderTotal',
      valueType: 'text',
      hideInSearch: true,
      render: (_, data) => {
        return _ > 0
          ?
          <a onClick={() => {
            history.push({
              pathname: `/intensive-store-management/shopkeeper-order/${data.storeNo}`,
              query: {
                storeName: data.storeName,
                phone: data.phone,
                linkman: data.nickname === data.memberPhone ? '???????????????' : data.nickname,
              }
            })
          }}>
            {_}
          </a>
          :
          _
      },
      hideInTable: storeType == 'freshStores'
    },
    {
      title: '??????',
      dataIndex: 'productTotal',
      valueType: 'text',
      hideInSearch: true,
      render: (_, data) => {
        return _ > 0
          ?
          <a onClick={() => {
            history.push({
              pathname: `/intensive-store-management/product-management/${data.storeNo}`,
              query: {
                storeName: data.storeName,
                phone: data.phone,
                linkman: data.nickname === data.memberPhone ? '???????????????' : data.nickname,
              }
            })
          }}>{_}</a>
          :
          _
      },
      hideInTable: storeType == 'freshStores'
    },
    {
      title: '????????????',
      dataIndex: 'userTotal',
      valueType: 'text',
      hideInSearch: true,
      render: (_, data) => {
        return _ > 0
          ?
          <a onClick={() => {
            history.push({
              pathname: `/intensive-store-management/shop-user/${data.storeNo}`,
              query: {
                storeName: data.storeName,
                phone: data.phone,
                linkman: data.nickname === data.memberPhone ? '???????????????' : data.nickname,
              }
            })
          }}>{_}</a>
          :
          _
      },
      hideInTable: storeType == 'freshStores'
    },
    {
      title: '????????????',
      dataIndex: 'shopkeeperInvitedTotal',
      valueType: 'text',
      hideInSearch: true,
      render: (_, data) => {
        return _ > 0
          ?
          <a onClick={() => {
            history.push({
              pathname: `/intensive-store-management/shopkeeper-user/${data.storeNo}`,
              query: {
                storeName: data.storeName,
                phone: data.phone,
                linkman: data.nickname === data.memberPhone ? '???????????????' : data.nickname,
                memberId: data.memberId,
              }
            })
          }}>{_}</a>
          :
          _
      },
      hideInTable: storeType == 'freshStores'
    },
    {
      title: '????????????',
      dataIndex: 'area',
      hideInTable: true,
      renderFormItem: () => (<AddressCascader changeOnSelect />)
    },
    {
      title: '????????????',
      dataIndex: 'address',
      valueType: 'text',
      fieldProps: {
        placeholder: '?????????????????????'
      },
      hideInTable: true,
    },
    {
      title: '???????????????',
      dataIndex: 'depositStatus',
      valueType: 'select',
      hideInSearch: storeType == 'cancelled',
      hideInTable: true,
      valueEnum: {
        "normal": '??????',
        "11": '??????-?????????????????????',
        "12": '??????-?????????????????????',
        "13": '??????-???????????????',
      },
    },
    {
      title: '???????????????',
      dataIndex: 'depositStatusDesc',
      valueType: 'text',
      hideInSearch: true,
      hideInTable: storeType == 'cancelled' || storeType == 'freshStores',
      render: (_, data) => {
        const { depositRefendList } = data;
        return (
          <>
            <div>{_}</div>
            {depositRefendList && depositRefendList.map(ele => {
              return <div>{amountTransform(Number(ele.refendAmount), '/')}??????{ele.optAdminName}/{ele.refendTime}???</div>
            })}
          </>
        )
      },
    },
    {
      title: '???????????????',
      dataIndex: 'depositStatus',
      valueType: 'select',
      hideInSearch: storeType == 'normal' || storeType == 'freshStores',
      hideInTable: true,
      valueEnum: {
        "cancelled": '??????',
        "20": '?????????-???????????????',
        "21": '?????????-?????????????????????',
        "22": '?????????-?????????????????????',
      },
    },
    {
      title: '???????????????',
      dataIndex: 'depositStatusDesc',
      valueType: 'text',
      hideInSearch: true,
      hideInTable: storeType == 'normal' || storeType == 'freshStores',
      render: (_, data) => {
        const { depositRefendList } = data;
        return (
          <>
            <div>{_}</div>
            {
              depositRefendList?.[0]?.attach?.moneyCertificates &&
              <div>
                <a style={{ color: 'red' }} onClick={() => { setPreviewVisible(true); }}>????????????????????????</a>
                <Image
                  width={200}
                  style={{ display: 'none' }}
                  src={depositRefendList?.[0]?.attach?.moneyCertificates}
                  preview={{
                    visible: previewVisible,
                    src: depositRefendList?.[0]?.attach?.moneyCertificates,
                    onVisibleChange: value => {
                      setPreviewVisible(value)
                    },
                  }}
                />
              </div>
            }
            {depositRefendList && depositRefendList.map(ele => {
              return <div>{{ 1: '?????????', 2: '?????????' }[ele.refendType]}{amountTransform(Number(ele.refendAmount), '/')}??????{ele.optAdminName}/{ele.refendTime}???</div>
            })}
          </>
        )
      }
    },
    {
      title: '????????????',
      dataIndex: 'status',
      valueType: 'select',
      hideInSearch: storeType == 'cancelled',
      hideInTable: true,
      valueEnum: {
        1: '?????????',
        3: '?????????'
      },
    },
    {
      title: '????????????',
      dataIndex: 'status',
      valueType: 'text',
      hideInSearch: true,
      hideInTable: storeType == 'cancelled',
      render: (_, data) => {
        return (
          <>
            {_.desc}
          </>
        )
      },
    },
    {
      title: '????????????',
      dataIndex: 'level',
      valueType: 'select',
      hideInTable: true,
      valueEnum: {
        1: '????????????',
        2: '????????????',
        3: '????????????',
        4: '????????????',
        5: '????????????',
      },
    },
    // {
    //   key: 'status',
    //   title: '????????????',
    //   dataIndex: 'asdas',
    //   width: 100,
    //   valueType: 'checkbox',
    //   valueEnum: {
    //     all: { text: '?????????????????????', status: 'Default' },

    //   },
    //   hideInTable: true,
    // },
    // {
    //   key: 'status',
    //   title: '????????????',
    //   dataIndex: 'asdas',
    //   width: 100,
    //   valueType: 'checkbox',
    //   valueEnum: {
    //     all: { text: '??????????????????', status: 'Default' }
    //   },
    //   hideInTable: true,
    // },
    {
      title: '????????????',
      dataIndex: 'remark',
      valueType: 'text',
      hideInSearch: true,
      hideInTable: storeType == 'normal' || storeType == 'freshStores',
      render: (_, data) => {
        if (data?.cancelInfo?.balance) {
          return (
            <>
              <p>???????????????</p>
              <a onClick={() => { setVisible(true); setAttachmentImage(data?.cancelInfo?.attachList) }}>????????????????????????</a>
              <p>????????????????????????{data?.cancelInfo?.balance}???</p>
              <pre className={styles.line_feed}>?????????{data?.cancelInfo?.reason}</pre>
              <p>???{data?.cancleTime}???</p>
            </>
          )
        } else {
          return (
            <>
              <p>{_}</p>
              <>
                {
                  data?.cancelInfo?.attachList?.length > 0 && <a onClick={() => { setVisible(true); setAttachmentImage(data?.cancelInfo?.attachList) }}>????????????????????????</a>
                }
              </>
              <p>???{data?.createTime}???</p>
            </>
          )
        }
      }
    },
    {
      title: '????????????',
      dataIndex: 'isChangePrice',
      valueType: 'select',
      valueEnum: {
        0: '??????????????????',
        1: '???????????????',
      },
      hideInTable: true,
      hideInSearch: storeType == 'freshStores',
    },
    {
      title: '??????????????????',
      dataIndex: 'provideTime',
      valueType: 'dateTimeRange',
      hideInTable: true,
      hideInSearch: storeType === 'freshStores'
    },
    {
      title: '??????????????????',
      dataIndex: 'provideTime',
      valueType: 'text',
      hideInSearch: true,
      hideInTable: storeType === 'freshStores'
    },
    {
      title: '????????????????????????',
      dataIndex: 'auditTime',
      valueType: 'dateTimeRange',
      hideInTable: true,
      hideInSearch: storeType === 'freshStores'
    },
    {
      title: '????????????????????????',
      dataIndex: 'auditTime',
      valueType: 'text',
      hideInSearch: true,
      hideInTable: storeType === 'freshStores'
    },
    {
      title: '????????????',
      dataIndex: 'cancleTime',
      valueType: 'dateTimeRange',
      hideInTable: true,
      hideInSearch: storeType !== 'cancelled'
    },
    {
      title: '??????',
      dataIndex: '',
      valueType: 'option',
      width: 100,
      fixed: 'right',
      render: (_, data) => (
        <Space>
          <Dropdown.Button onClick={() => { setSelectItem(data); setDetailVisible(true) }} overlay={() => { return menu(data) }}>??????</Dropdown.Button>
          {/* <a onClick={() => { setSelectItem(data); setDetailVisible(true) }}>??????</a> */}
          {/* {data.status.code === 2 && <a onClick={() => { setSelectItem({ ...data, type: 1 }); setReturnVisible(true) }}>????????????????????????</a>} */}
          {/* {data.status.code === 2 && <a onClick={() => { setSelectItem({ ...data, type: 2 }); setReturnVisible(true) }}>???????????????????????????</a>} */}
          {/* {data.status.code === 1 && <a onClick={() => { setSelectItem({ ...data, toStatus: 3 }); setFormVisible(true) }}>??????</a>} */}
          {/* {data.status.code === 3 && <a onClick={() => { setSelectItem({ ...data, toStatus: 1 }); setFormVisible(true) }}>??????</a>} */}
          {/* {data.status.code === 3 && <a onClick={() => { setSelectItem({ ...data, toStatus: 2 }); setFormVisible(true) }}>??????</a>} */}
          {/* <a onClick={() => { setSelectItem(data); setAuditInfoVisible(true) }}>????????????</a> */}
          {/* <Auth
            name="store/member_shop/grade"
          >
            <GradeChange
              callback={() => { actionRef.current.reload() }}
              storeNo={data.storeNo}
            />
          </Auth> */}

        </Space>
      ),
      hideInTable: storeType == 'freshStores',
    },
  ];

  const getFieldValue = () => {
    if (formRef?.current?.getFieldsValue) {
      const { current, pageSize, area = [], ...rest } = formRef?.current?.getFieldsValue?.();
      return {
        operation: storeType,
        provinceId: area[0]?.value,
        cityId: area[1]?.value,
        regionId: area[2]?.value,
        ...rest
      }
    }
    return {}
  }

  const postData = (data) => {
    return data.map(ele => ({ ...ele, verifyStatus: ele?.freshApplyRow?.verifyStatus?.code }))
  }

  return (
    <>
      <ProTable
        rowKey="id"
        options={false}
        actionRef={actionRef}
        formRef={formRef}
        params={{
          operation: storeType
        }}
        postData={postData}
        request={
          storeType == 'freshStores' ? applyConditionPage : getStoreList
        }
        scroll={{ x: 'max-content', scrollToFirstRowOnChange: true, }}
        search={{
          defaultCollapsed: true,
          optionRender: (searchConfig, formProps, dom) => [
            ...dom.reverse(),
            <div key="export">
              {
                storeType != 'freshStores' &&
                <>
                  <Button
                    key="new"
                    onClick={() => {
                      setCreateVisible(true);
                    }}
                  >
                    ??????
                  </Button>
                  &nbsp;&nbsp;
                  <Export
                    change={(e) => { setVisit(e) }}
                    key="export"
                    type={storeType == 'normal' ? "community-shopkeeper-export" : "community-shopkeeper-cancelled-export"}
                    conditions={() => { return getFieldValue(searchConfig) }}
                  />
                  &nbsp;&nbsp;
                  <ExportHistory key="exportHistory" show={visit} setShow={setVisit} type={storeType == 'normal' ? "community-shopkeeper-export" : "community-shopkeeper-cancelled-export"} />
                </>
              }
            </div>,

            // <Button
            //   key="new2"
            //   onClick={() => {
            //     setExcelVisible(true);
            //   }}
            // >
            //   ????????????
            // </Button>,
            // <Button key="out" onClick={() => { exportExcel(form) }}>??????</Button>,
          ],
        }}
        columns={columns}
        pagination={{
          pageSize: 10,
        }}
        className={styles.store_list}
      />
      {
        auditInfoVisible &&
        <AuditInfo
          storeNo={selectItem?.storeNo}
          visible={auditInfoVisible}
          setVisible={setAuditInfoVisible}
        />
      }
      {
        detailVisible &&
        <Detail
          storeNo={selectItem?.storeNo}
          visible={detailVisible}
          setVisible={setDetailVisible}
        />
      }
      {formVisible && <Form
        visible={formVisible}
        setVisible={setFormVisible}
        data={selectItem}
        callback={() => { actionRef.current.reload() }}
        onClose={() => { actionRef.current.reload(); setSelectItem(null) }}
      />}
      {returnVisible && <Return
        visible={returnVisible}
        setVisible={setReturnVisible}
        data={selectItem}
        callback={() => { actionRef.current.reload() }}
      />}
      {createVisible && <Create
        visible={createVisible}
        setVisible={setCreateVisible}
        callback={() => { actionRef.current.reload() }}
      />}
      {excelVisible && <ExcelModal
        visible={excelVisible}
        setVisible={setExcelVisible}
        callback={() => { actionRef.current.reload() }}
      />}
      {orderVisible && <OrderDetail
        id={orderId}
        visible={orderVisible}
        setVisible={setOrderVisible}
      />}
      {visible && <ContentModel
        setVisible={setVisible}
        visible={visible}
        attachList={attachmentImage}
        onClose={() => { actionRef.current.reload(); setAttachmentImage(null) }}
      />
      }
      {gradeChangeVisible &&
        <GradeChange
          callback={() => { actionRef.current.reload() }}
          storeNo={selectItem.storeNo}
          visible={gradeChangeVisible}
          setVisible={setGradeChangeVisible}
        />
      }
    </>
  );
};


const OverallStore = () => {
  const [activeKey, setActiveKey] = useState('normal')

  return (
    <PageContainer>
      <ProCard
        tabs={{
          type: 'card',
          activeKey,
          onChange: setActiveKey
        }}
      >
        <ProCard.TabPane key="normal" tab="????????????">
          {
            activeKey == 'normal' && <StoreList storeType={activeKey} />
          }
        </ProCard.TabPane>
        <ProCard.TabPane key="cancelled" tab="???????????????">
          {
            activeKey == 'cancelled' && <StoreList storeType={activeKey} />
          }
        </ProCard.TabPane>
        <ProCard.TabPane key="freshStores" tab="????????????????????????????????????">
          {
            activeKey == 'freshStores' && <StoreList storeType={activeKey} />
          }
        </ProCard.TabPane>
      </ProCard>
    </PageContainer>
  )
}

export default OverallStore;
