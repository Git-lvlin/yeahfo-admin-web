import React, { useState, useRef } from 'react';
import { Button, Radio, Space, Modal, Image } from 'antd';
import ProTable from '@ant-design/pro-table';
import { PageContainer } from '@/components/PageContainer';
import { bindingOperationApply, approve, refuse } from '@/services/operation-management/bind-audit-list';
import { ExclamationCircleOutlined } from '@ant-design/icons'
import {
  ModalForm,
  ProFormTextArea,
} from '@ant-design/pro-form';

const { confirm } = Modal;

const BindAuditList = () => {
  const [detailVisible, setDetailVisible] = useState(false);
  const [selectItem, setSelectItem] = useState({});
  const [params, setParams] = useState({ auditStatus: 3 });
  const actionRef = useRef();
  const formRef = useRef();
  const userInfo = JSON.parse(window.localStorage.getItem('user'));

  const columns = [
    {
      title: '社区店名称',
      dataIndex: 'storeName',
    },
    {
      title: '绑定运营商',
      dataIndex: 'operationName',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '申请类别',
      dataIndex: ['applyType', 'desc'],
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '申请时间',
      dataIndex: 'createTime',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '申请类别',
      dataIndex: 'applyType',
      valueEnum: {
        1: '申请解绑',
        2: '申请绑定',
      },
      hideInTable: true,
    },
    {
      title: '申请人员',
      dataIndex: 'applyFromName',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '审批文件',
      dataIndex: 'applyAttach',
      valueType: 'text',
      hideInSearch: true,
      render: (text) => {
        return text.map(item => (<div key={item} style={{ marginRight: 10, display: 'inline-block' }}><Image style={{ width: 50, height: 50 }} src={item} /></div>))
      },
    },
    {
      title: '原因备注',
      dataIndex: 'applyRemark',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '审核时间',
      dataIndex: 'auditTime',
      valueType: 'text',
      hideInSearch: true,
      hideInTable: params.auditStatus === 3,
    },
    {
      title: '审核人员',
      dataIndex: 'auditorName',
      valueType: 'text',
      hideInSearch: true,
      hideInTable: params.auditStatus === 3,
    },
    {
      title: '审核意见',
      dataIndex: 'auditRemark',
      valueType: 'text',
      hideInSearch: true,
      hideInTable: params.auditStatus === 3,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      hideInTable: params.auditStatus !== 3,
      render: (_, record) => {
        return (
          params.auditStatus === 3 && <Space>
            <a onClick={() => {
              confirm({
                title: '审核通过',
                icon: <ExclamationCircleOutlined />,
                content: '确认审核通过吗？',
                onOk() {
                  approve({
                    applyId: record.applyId,
                    auditorId: userInfo.id,
                    auditorName: userInfo.username,
                  }, { showSuccess: true })
                    .then(res => {
                      if (res.code === 0) {
                        actionRef.current.reload();
                      }
                    })
                },
              });
            }}>通过</a>
            <ModalForm
              title="审核驳回"
              width={500}
              trigger={
                <a>
                  拒绝
                </a>
              }
              modalProps={{
                onCancel: () => console.log('run'),
                destroyOnClose: true,
              }}
              onFinish={async (values) => {
                return refuse({
                  applyId: record.applyId,
                  auditorId: userInfo.id,
                  auditorName: userInfo.username,
                  auditRemark: values.auditRemark,
                }, { showSuccess: true })
                  .then(res => {
                    if (res.code === 0) {
                      actionRef.current.reload();
                      return true;
                    }
                  })
              }}
            >
              <ProFormTextArea
                label="驳回原因"
                rules={[{ required: true, message: '请输入驳回原因' }]}
                name="auditRemark"
                placeholder="请输入驳回原因，50字以内"
                fieldProps={{
                  maxLength: 50
                }}
              />
            </ModalForm>
          </Space>
        )
      },
    },
  ];

  return (
    <PageContainer>
      <ProTable
        rowKey="poNo"
        options={{
          density: false,
          reload: true,
          fullScreen: false,
          setting: false,
        }}
        scroll={{ x: 'max-content', scrollToFirstRowOnChange: true, }}
        actionRef={actionRef}
        formRef={formRef}
        params={params}
        request={bindingOperationApply}
        search={{
          defaultCollapsed: true,
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
          ],
        }}
        toolbar={{
          multipleLine: true,
          filter: (
            <Radio.Group
              optionType="button"
              buttonStyle="solid"
              defaultValue={3}
              options={[
                {
                  label: '待审核',
                  value: 3,
                },
                {
                  label: '审核通过',
                  value: 1,
                },
                {
                  label: '审核驳回',
                  value: 2,
                },
              ]}
              onChange={(e) => {
                setParams({
                  auditStatus: e.target.value
                })
                actionRef.current.reload();
              }}
            />
          )
        }}
        columns={columns}
        pagination={{
          pageSize: 10,
          showQuickJumper: true,
        }}
      />
      {
        detailVisible &&
        <Detail
          id={selectItem?.poNo}
          visible={detailVisible}
          setVisible={setDetailVisible}
          callback={() => {
            setDetailVisible(false);
            setSelectItem(null);
            actionRef.current.reload();
          }}
        />
      }
    </PageContainer>
  );
};

export default BindAuditList;
