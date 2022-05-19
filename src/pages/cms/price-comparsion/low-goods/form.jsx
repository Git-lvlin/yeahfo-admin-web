import React, { useRef, useState, useEffect  } from 'react';
import { message, Space } from 'antd';
import ProTable from '@ant-design/pro-table';
import { ModalForm } from '@ant-design/pro-form';
import { priceComparsionListAll, SetHotGoodsDel } from '@/services/cms/member/member';

export default (props) => {
  const { setVisible, setFlag, visible } = props;
  const [arr, setArr] = useState(null)
  const formRef = useRef();
  const columns = [
    {
      title: 'skuid',
      dataIndex: 'goodsSkuId',
      valueType: 'text',
    },
    {
      title: '商品名称',
      dataIndex: 'goodsName',
      valueType: 'text',
    },
    {
      title: '约购',
      dataIndex: 'goodsPrice',
      valueType: 'number',
    },
    {
      title: '淘宝',
      dataIndex: 'tbPrice',
      valueType: 'number',
    },
    {
      title: '京东',
      dataIndex: 'jdPrice',
      valueType: 'number',
    },
    {
      title: '拼多多',
      dataIndex: 'pddPrice',
      valueType: 'number',
    },
    {
      title: '天猫',
      dataIndex: 'tmallPrice',
      valueType: 'number',
    },
  ];

  const waitTime = () => {
    const param = {
      ids: arr,
      opt: 'add'
    }
    return new Promise((resolve, reject) => {
      SetHotGoodsDel(param).then((res) => {
        if (res.code === 0) {
          setFlag(true)
          resolve(true)
        } else {
          reject(false)
        }
      })
    });
  };

  return (
    <ModalForm
      title={`选择比较商品`}
      onVisibleChange={setVisible}
      formRef={formRef}
      visible={visible}
      submitter={{
        searchConfig: {
          submitText: '确认',
          resetText: '取消',
        },
      }}
      onFinish={async (values) => {
        await waitTime(values);
        message.success('提交成功');
        // 不返回不会关闭弹框
        return true;
      }}
    >
<ProTable
      rowKey="id"
      options={false}
      columns={columns}
      request={priceComparsionListAll}
      rowSelection={{
        // 自定义选择项参考: https://ant.design/components/table-cn/#components-table-demo-row-selection-custom
        // 注释该行则默认不显示下拉选项
        // selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT],
      }}
      tableAlertRender={({ selectedRowKeys, selectedRows, onCleanSelected }) => (
        <Space size={24}>
          <span>
            已选 {selectedRowKeys.length} 项
            <a style={{ marginLeft: 8 }} onClick={onCleanSelected}>
              取消选择
            </a>
          </span>
        </Space>
      )}
      tableAlertOptionRender={(a) => {
        setArr(a.selectedRowKeys.toString())
      }}
      // search={false}
      pagination={{
        pageSize: 10,
      }}
      dateFormatter="string"
    />
    </ModalForm>
  );
};