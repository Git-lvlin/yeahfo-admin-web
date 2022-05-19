import React, { useState, useEffect, useRef } from 'react';
import { Button, message, Table, Space, Modal, Typography } from 'antd';
import ProTable from '@ant-design/pro-table';
import { getResList, getVersionAllList, inputVersionList } from '@/services/resource'
import { platformType } from '@/constants/index'

const TableList = (props) => {
  const page = 1;
  const size = 10;
  const [data, setData] = useState([]);
  const [versionOption, setVersionOption] = useState([]);
  const [searchData, setSearchData] = useState({
    size,
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: size,
    total: 0
  });
  const formRef = useRef();

  // 获取列表数据
  const getList = data => {
    let param = {
      page,
      size,
      ...data
    }
    getResList(param).then(res => {
      if(res.code === 200 || res.code === 0){
        const resData = res.data;
        setData(res.data.records)
        setPagination({
          current: resData.page,
          total: resData.total,
        })
      } else {
        message.error(res.msg);
      }
    })
  }

  useEffect(() => {
    getList();
    getVersionAllList().then(res => {
      if(res.code === 200 || res.code === 0) {
        let data = {};
        res.data.forEach(item => {
          data[item.name] = item.name;
        })
        setVersionOption(data)
      } else {
        message.error(res.msg)
      }
    })
  }, [])

  // 提交搜索
  const onSubmit = async () => {
    const row = formRef.current.getFieldsValue();
    let searchData = {
      page: 1,
      size,
    }
    for(let key in row) {
      if(!!row[key]) {
        searchData[key] = row[key]
        if(key === "createTime") searchData[key] = searchData[key].format("YYYY-MM-DD");
      }
    }
    setSearchData(searchData);
    getList(searchData);
  }
  
  // 监听分页
  const handleTableChange = (pagination) => {
    let sData = {
      ...searchData,
      page: pagination.current,
      size: pagination.pageSize,
    }
    getList(sData);
  }

  // 点击选择资源位
  const onChooseRecord = (record) => {
    props.handleSetKey(record.resourceKey);
    props.onCancel();
  }

  const columns = [
    {
      title: '资源位编号',
      dataIndex: 'resourceKey',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '资源位名称',
      dataIndex: 'name',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: "名称或编号",
      key: 'numberOrName',
      hideInTable: true,
      fieldProps: {
        placeholder: "请输入资源位名称或编号"
      }
    },
    {
      title: '所属平台',
      dataIndex: 'platform',
      onFilter: true,
      hideInTable: true,
      valueType: 'select',
      valueEnum: {
        0: {
          text: '全平台',
        },
        1: {
          text: 'iOS',
        },
        2: {
          text: 'Android',
        },
        3: {
          text: 'MiniProgram',
        },
      },
    },
    {
      title: '所属平台',
      dataIndex: 'platform',
      onFilter: true,
      hideInSearch: true,
      render: (_, record) => {
        let str = "";
        let typeList = record.platform.split("&");
        typeList.forEach((item, index) => {
          str += `${platformType[item]}${index !== typeList.length - 1 ? "&" : ""}`
        })
        return str;
      }
    },
    {
      title: '所属版本',
      dataIndex: 'appVersion',
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
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'date',
      hideInTable: true,
    },
    {
      title: '版本号',
      dataIndex: 'appVersion',
      hideInTable: true,
      valueType: 'select',
      valueEnum: versionOption
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <>
          <Typography.Link onClick={() => { onChooseRecord(record) }}>选择</Typography.Link>
        </>
      ),
    },
  ];

  return (
    <Modal
      width="80%"
      title="选择关联资源位"
      visible
      okButtonProps={{ hidden: true }}
      cancelButtonProps={{ hidden: true }}
      onCancel={props.onCancel}
    >
      <ProTable
        formRef={formRef}
        rowKey="id"
        options={false}
        dataSource={data}
        rowSelection={false}
        search={{
          defaultCollapsed: true,
          optionRender: ({ searchText, resetText }, { form }) => [
            <Button
              key="search"
              type="primary"
              onClick={() => {
                // form?.submit();
                onSubmit();
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
        columns={columns}
        pagination={pagination}
        onChange={handleTableChange}
      />
    </Modal>
  );
};

export default TableList;
