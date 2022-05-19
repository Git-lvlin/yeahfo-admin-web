import React, { useState, useRef } from 'react';
import ProTable from '@ant-design/pro-table';
import { PageContainer } from '@/components/PageContainer';
import { Button, Space, Modal } from 'antd';
import { getCommonList, statusSwitch, detailExt, deloperation, resetPwd } from '@/services/operation-management/operation-list'
import { history } from 'umi';
import { ExclamationCircleOutlined } from '@ant-design/icons'
import Export from '@/pages/export-excel/export'
import ExportHistory from '@/pages/export-excel/export-history'
import BasicInfo from './basic-info';
import AccountInfo from './account-info';
import DisableModal from './disable-modal';
import BankCard from './bind-card';

const { confirm } = Modal;

const TableList = () => {
  const [basicInfoVisible, setBasicInfoVisible] = useState(false);
  const [accountInfoVisible, setAccountInfoVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [exportVisible, setExportVisible] = useState(false);
  const [bandCardVisible, setBandCardVisible] = useState(false);
  const [detailData, setDetailData] = useState(null);
  const [disableModalVisible, setDisableModalVisible] = useState(false);
  const [selectItem, setSelectItem] = useState(null);
  const actionRef = useRef();
  const formRef = useRef();

  const switchStatus = (reason) => {
    statusSwitch({
      operationId: selectItem.id,
      type: selectItem.status === 1 ? 2 : 1,
      reason,
    }, { showSuccess: true, }).then(res => {
      if (res.code === 0) {
        actionRef.current.reload();
      }
    })
  }

  const getDetail = (id, type) => {
    detailExt({
      operationId: id
    }).then(res => {
      if (res.code === 0) {
        setDetailData({
          ...res.data,
        })
        if (type === 1) {
          setBasicInfoVisible(true)
        } else if (type === 2) {
          setAccountInfoVisible(true)
        } else {
          setBandCardVisible(true)
        }
      }
    })
  }

  const deleteSup = (operationId) => {
    confirm({
      title: '确认要删除已创建的运营商么？',
      icon: <ExclamationCircleOutlined />,
      onOk() {
        deloperation({
          operationId
        }, { showSuccess: true, }).then(res => {
          if (res.code === 0) {
            actionRef.current.reload();
          }
        })
      }
    });
  }

  const pwdReset = () => {
    resetPwd({
      operationId: selectItem.id
    }, { showSuccess: true }).then(res => {
      if (res.code === 0) {
        setIsModalVisible(false);
        setSelectItem(null)
      }
    })
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '运营商名称',
      dataIndex: 'companyName',
      valueType: 'text',
      fieldProps: {
        placeholder: '请输入运营商名称'
      },
    },
    {
      title: '运营中心编号',
      dataIndex: 'opNo',
      hideInSearch: true,
    },
    {
      title: '企业名称',
      dataIndex: 'accountCompanyName',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '运营商ID',
      dataIndex: 'operationId',
      valueType: 'text',
      fieldProps: {
        placeholder: '请输入运营商ID'
      },
      hideInTable: true,
    },
    {
      title: '登录账号',
      dataIndex: 'accountName',
      valueType: 'text',
      fieldProps: {
        placeholder: '请输入登录账号'
      },
    },
    {
      title: '负责人',
      dataIndex: 'companyUserName',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueType: 'select',
      valueEnum: {
        0: '禁用',
        1: '启用'
      },
    },
    {
      title: '创建人',
      dataIndex: 'createUser',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '子账号',
      dataIndex: 'subAccountTotal',
      valueType: 'text',
      hideInSearch: true,
      render: (_, data) => {
        return <a onClick={() => { history.push(`/operation-management/operation-sub-account/${data.bindAccountId}`) }}>{_}</a>
      },
    },
    {
      title: '资金账户审核状态',
      dataIndex: 'auditStatus',
      valueType: 'text',
      hideInTable: true,
      valueEnum: {
        0: '待提交',
        1: '开户成功',
        2: '待审核',
        3: '开户失败',
        4: '待开户',
        5: '审核拒绝'
      },
      ellipsis: true,
    },
    {
      title: '审核开户状态',
      dataIndex: 'auditStatus',
      valueType: 'text',
      hideInSearch: true,
      render: (_, data) => {
        return (
          <>
            <div>
              {
                {
                  0: '待提交',
                  1: '开户成功',
                  2: '待审核',
                  3: '开户失败',
                  4: '待开户',
                  5: '审核拒绝'
                }[_]
              }
            </div>
            {!!data.auditReason && _ !== 2 && <div style={{ color: 'red' }}>{data.auditReason}</div>}
          </>
        )
      },
    },
    {
      title: '绑卡状态',
      dataIndex: 'bankStatus',
      valueType: 'text',
      hideInSearch: true,
      render: (_, data) => {

        if (data.auditStatus !== 1 && _ === 0) {
          return '-';
        }

        if (_ === 1) {
          return '已绑卡'
        }

        if (_ !== 1 && data.auditStatus === 1) {
          return <a onClick={() => { getDetail(data.id, 3) }}>未绑卡</a>
        }

      },
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      width: 400,
      render: (_, data) => (
        <Space>
          {data.status === 1 && <a onClick={() => { setSelectItem(data); setDisableModalVisible(true) }}>禁用</a>}
          {data.status === 0 && <a onClick={() => { setSelectItem(data); setDisableModalVisible(true) }}>启用</a>}
          {/* <a onClick={() => { history.push(`/operation-management/operation-detail/${data.id}`) }}>详情</a> */}
          <a onClick={() => { getDetail(data.id, 1) }}>基本信息</a>
          {data.accountSwitch === 1 && <a onClick={() => { getDetail(data.id, 2) }}>开户信息</a>}
          {data.isAllowDel === 1 && <a onClick={() => { deleteSup(data.id) }}>删除</a>}
          <a onClick={() => { history.push(`/operation-management/after-sale-address/${data.id}`) }}>售后地址</a>
          <a onClick={() => { setSelectItem(data); setIsModalVisible(true) }}>重置密码</a>
        </Space>
      ),
    },
  ];

  const getFieldValue = () => {
    if (formRef?.current?.getFieldsValue) {
      const { current, pageSize, ...rest } = formRef?.current?.getFieldsValue?.();
      return {
        ...rest
      }
    }
    return {}
  }

  return (
    <PageContainer>
      <ProTable
        rowKey="id"
        options={false}
        request={getCommonList}
        scroll={{ x: 'max-content', scrollToFirstRowOnChange: true, }}
        search={{
          defaultCollapsed: true,
          labelWidth: 130,
          optionRender: ({ searchText, resetText }, { form }) => [
            <Button
              key="search"
              type="primary"
              onClick={() => {
                form?.submit();
              }}
            >
              {searchText}
            </Button>,
            <Button
              key="rest"
              onClick={() => {
                form?.resetFields();
              }}
            >
              {resetText}
            </Button>,
            <Button key="out" type="primary" onClick={() => { setBasicInfoVisible(true) }}>新建</Button>,
            <Export
              key="3"
              change={(e) => { setExportVisible(e) }}
              type="admin-services-provider-export"
              conditions={getFieldValue}
            />,
            <ExportHistory key="4" show={exportVisible} setShow={setExportVisible} type="admin-services-provider-export" />,
          ],
        }}
        columns={columns}
        actionRef={actionRef}
        formRef={formRef}
        pagination={{
          pageSize: 10,
        }}
      />
      {basicInfoVisible && <BasicInfo
        visible={basicInfoVisible}
        setVisible={setBasicInfoVisible}
        detailData={detailData}
        callback={() => { actionRef.current.reload(); setDetailData(null) }}
        onClose={() => { setDetailData(null) }}
      />}
      {accountInfoVisible && <AccountInfo
        visible={accountInfoVisible}
        setVisible={setAccountInfoVisible}
        detailData={detailData}
        callback={() => { actionRef.current.reload(); setDetailData(null) }}
        onClose={() => { setDetailData(null) }}
      />}

      {disableModalVisible &&
        <DisableModal
          visible={disableModalVisible}
          setVisible={setDisableModalVisible}
          data={selectItem}
          callback={(v) => { switchStatus(v) }}
        />}

      {
        bandCardVisible
        &&
        <BankCard
          detailData={detailData}
          setVisible={setBandCardVisible}
          callback={() => { actionRef.current.reload(); setDetailData(null) }}
        />
      }

      <Modal
        title={`请确认要重置运营商：${selectItem?.companyName}（账号：${selectItem?.accountName}）的登录密码？`}
        visible={isModalVisible}
        onOk={() => { pwdReset() }}
        onCancel={() => { setIsModalVisible(false) }}
      >
        <p>注意：重置密码后，新密码将立即生效，原密码无法继续使用！</p>
        <p style={{ fontSize: 12 }}>重置密码将同步发送给运营商</p>
      </Modal>
    </PageContainer>

  );
};

export default TableList;
