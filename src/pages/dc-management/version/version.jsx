import React, { useState, useEffect, useRef } from 'react';
import { Drawer, Form, Input, Button, message, Typography } from 'antd';
import ProTable from '@ant-design/pro-table';
import { PageContainer } from '@/components/PageContainer';
import { addVersion, getVersionList, getVersion, updateVersion } from '@/services/resource'
import css from './index.less'

let page = 1;
let size = 10;

const TableList = () => {
  const [visible, setVisible] = useState(false);
  const [versionId, setVersionId] = useState("");
  const [drawerTitle, setDrawerTitle] = useState(""); 
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: size,
    total: 0
  });
  const formRef = useRef();
  const [formAdd] = Form.useForm();
  const layout = {
    labelCol: {
      span: 6,
    },
    wrapperCol: {
      span: 16,
    },
  };
  const tailLayout = {
    wrapperCol: {
      offset: 8,
      span: 16,
    },
  };

  // 获取列表数据
  const getList = () => {
    let param = {
      page,
      size,
    }
    getVersionList(param).then(res => {
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

  // 获取版本号详情
  useEffect(() => {
    if(visible && !!versionId){
      getVersion({
        id: versionId,
      }).then(res => {
        if(res.code === 0 || res.code === 200){
          formAdd.setFieldsValue({
            name: res.data.name,
            remark: res.data.remark,
          })
        } else {
          message.error(res.msg);
        }
      });
    }
  }, [visible])

  // 初次加载列表
  useEffect(() => {
    getList();
  }, [])

  // 关闭抽屉
  const onClose = () => {
    setVisible(false);
    setDrawerTitle("");
  };

  // 点击添加
  const onToAdd = (id) => {
    setVisible(true);
    if(!!id) {
      setDrawerTitle("编辑");
      setVersionId(id);
    } else {
      setDrawerTitle("新建");
    }
  }
  
  // 提交数据
  const onFinish = (values) => {
    if(!!versionId) {
      updateVersion({ ...values, id: versionId}).then(res => {
        if(res.code === 0 || res.code === 200){
          message.success("修改成功！");
          onReset();
          setVisible(false);
          getList();
        } else {
          message.error(res.msg);
        }
      })
      return 
    }
    addVersion({ ...values }).then(res => {
      if(res.code === 0 || res.code === 200){
        message.success("添加成功！");
        onReset();
        setVisible(false);
        page = 1;
        getList();
      } else {
        message.error(res.msg);
      }
    })
  };

  // 重置表单
  const onReset = () => {
    formAdd.resetFields();
    setVersionId("");
  };
  
  // 监听分页
  const handleTableChange = (pagination) => {
    page = pagination.current;
    size = pagination.pageSize;
    getList();
  }

  const columns = [
    {
      title: '版本号',
      dataIndex: 'name',
      width: '20%',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '备注',
      dataIndex: 'remark',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      width: '15%',
      render: (_, record) => (
        <>
          <Typography.Link onClick={() => { onToAdd(record.id) }}>编辑</Typography.Link>
        </>
      ),
    },
  ];

  return (
    <PageContainer>
      <Drawer
        title={`${drawerTitle}版本号`}
        width="500"
        placement="right"
        onClose={onClose}
        visible={visible}
      >
        <Form
          {...layout}
          form={formAdd}
          onFinish={onFinish}
        >
          <Form.Item
            name="name"
            label="版本号"
            rules={[
              {
                required: true,
              },
              // {
              //   pattern: /^[\d.]+$/,
              //   message: "请输入正确格式如：1.0.0"
              // }
            ]}
          >
            <Input placeholder="请输入版本号" />
          </Form.Item>
          <Form.Item
            name="remark"
            label="备注"
            rules={[
              // {
              //   required: true,
              // },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 8}}>
            <Button type="primary" htmlType="submit" className={css.sub_btn}>
              提交
            </Button>
            <Button htmlType="button" onClick={onReset}>
              重置
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
      <ProTable
        formRef={formRef}
        rowKey="id"
        options={false}
        dataSource={data}
        search={{
          defaultCollapsed: true,
          optionRender: ({ searchText, resetText }, { form }) => [
            <Button key="out" type="primary" onClick={() => onToAdd() }>新建版本号</Button>,
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
