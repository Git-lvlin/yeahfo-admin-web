import React, { useState, useEffect, useRef } from 'react';
import { history } from 'umi';
import { Divider, Button, message, Typography, Table, Space, Modal, Input, Popconfirm } from 'antd';
import ProTable from '@ant-design/pro-table';
import { PageContainer } from '@/components/PageContainer';
import { getResList, getDeleteRes, getVersionAllList, inputVersionList } from '@/services/resource'
import { platformType, platformTypeSearch } from '@/constants/index'
import { isJsonString } from '@/utils/tojson'

const TableList = () => {
  const page = 1;
  const size = 10;
  const [data, setData] = useState([]);
  const [selectedRows, setSelectedRows] = useState();
  const [mobalVisible, setMobalVisible] = useState(false);
  const [mobalTitle, setMobalTitle] = useState("导入数据");
  const [mobalFooter, setMobalFooter] = useState({
    okButtonProps: {
      disabled: false,
    },
    cancelButtonProps: {
      disabled: false
    }
  });
  const [versionOption, setVersionOption] = useState([]);
  const [searchData, setSearchData] = useState({
    size,
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: size,
    total: 0
  });
  const mobalText = useRef();
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
        console.log("🚀 ~ file: resource-list.jsx ~ line 50 ~ getResList ~ resData", resData)
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
    if(row.platform !== undefined) {
      if(row.platform != 0) {
        row.platform = [ row.platform ];
      } else {
        row.platform = [];
        for(let index in platformType) {
          if(index != 0) {
            row.platform.push(index);
          }
        }
      }
    }
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

  // 删除列表数据
  const onDeleteItem = record => {
    if(record.state == "启用") {
      message.warning("当前资源位正在启用，请禁用后再删除")
      return;
    }
    getDeleteRes({
      id: record.id,
      resourceKey: record.resourceKey,
      platform: record.platform,
      appVersion: record.appVersion,
    }).then(res => {
      if(res.code === 200 || res.code === 0) {
        message.success("删除成功！")
        getList(searchData);
      } else {
        message.error(res.message);
      }
    })
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

  // 点击添加
  const onToAdd = (record) => {
    history.push(`/dc-management/add${!!record.id ? '?id=' + record.id : ''}`)
  }

  // 打开导出弹窗
  const onOutData = (rows) =>{
    let platform = "";
    if(rows.length > 0) {
      rows.forEach(item => {
        platform = item.platform || "";
        item.platform = platform ? `${platform}`.split("&") : [];
      });
    }
    setSelectedRows(JSON.stringify(rows))
    setMobalVisible(true)
    setMobalTitle("导出JSON数据")
    setMobalFooter({
      okButtonProps: {
        disabled: true,
      },
      cancelButtonProps: {
        disabled: true
      } 
    })
  }

  // 打开导入数据弹窗
  const openMobalInset = () => {
    setSelectedRows("")
    setMobalTitle("导入数据")
    setMobalVisible(true);
    setMobalFooter({
      okButtonProps: {
        disabled: false,
      },
      cancelButtonProps: {
        disabled: false
      }
    })
  }
  
  // 设置导入弹窗确认按钮加载状态
  const mobalOkBtnLoading = (type) => {
    setMobalFooter({
      okButtonProps: {
        loading: type,
      },
    })
  }

  // 提交导入JSON数据
  const addJsonData = () => {
    const inputlist = mobalText.current.resizableTextArea.props.value;
    if(!inputlist) {
      message.error("请粘贴或输入资源位数据")
      return;
    }
    let jsonStr = isJsonString(inputlist);
    if(!jsonStr) {
      message.error("请输入正确格式JSON数据")
      return;
    }
    let data = {
      inputlist: jsonStr
    }
    data = JSON.stringify(data);
    mobalOkBtnLoading(true);
    inputVersionList(data).then(res => {
      if(res.code === 0 || res.code === 200) {
        closeMobal();
        onSubmit();
        message.success("批量导入成功");
      } else {
        message.error(res.msg);
      }
      mobalOkBtnLoading(false);
    }).catch(err => {
      mobalOkBtnLoading(false);
    });
  }

  // 点击关闭弹窗
  const closeMobal = () => {
    setSelectedRows("")
    setMobalVisible(false)
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
      valueEnum: platformTypeSearch,
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
      title: '状态',
      dataIndex: 'state',
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
          <Typography.Link onClick={() => { onToAdd(record) }}>编辑</Typography.Link>
          <Divider type="vertical" />
          <Popconfirm title="您确定要删除该行数据?" onConfirm={() => onDeleteItem(record)}>
            <Typography.Link type="danger">删除</Typography.Link>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <PageContainer>
      <Modal 
				title={mobalTitle}
				width={600}
				visible={mobalVisible}
				onOk={addJsonData}
        onCancel={closeMobal}
        okButtonProps={mobalFooter.okButtonProps}
        cancelButtonProps={mobalFooter.cancelButtonProps}
			>
        {
          !mobalFooter.okButtonProps.disabled
          ?
          <Input.TextArea autoSize={{ minRows: 28, maxRows: 28 }} ref={mobalText} />
          :
          <div style={{ maxHeight: "600px", overflow: "auto" }} >{selectedRows}</div>
        }
      </Modal>
      <ProTable
        formRef={formRef}
        rowKey="id"
        options={false}
        dataSource={data}
        headerTitle="批量操作"
        rowSelection={{
          selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT],
        }}
        tableAlertRender={({ selectedRowKeys , onCleanSelected }) => (
          <Space size={24}>
            <span>
              已选 {selectedRowKeys.length} 项
              <a style={{ marginLeft: 8 }} onClick={onCleanSelected}>
                取消选择
              </a>
            </span>
          </Space>
        )}
        tableAlertOptionRender={({ selectedRows }) => (
           <a onClick={() => { onOutData(selectedRows) }}>导出数据</a>
        )}
        search={{
          defaultCollapsed: true,
          optionRender: ({ searchText, resetText }, { form }) => [
            <Button key="out" type="primary" onClick={onToAdd}>新建资源位</Button>,
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
            <Button key="inset" onClick={openMobalInset}>导入数据</Button>,
          ],
        }}
        columns={columns}
        pagination={pagination}
        onChange={handleTableChange}
      />
    </PageContainer>

  );
};

export default TableList;
