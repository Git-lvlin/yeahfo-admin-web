/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { Table, Input, Popconfirm, Form, Typography, Select, Divider, message, Button } from 'antd';
import { history, useLocation } from 'umi';
import { PageContainer } from '@/components/PageContainer';
import { attrType, platformTypeAll } from '@/constants/index'
import { addRes, getResDetail, updateRes, getVersionAllList } from '@/services/resource'
import { objToArr, itemToJson } from '@/utils/tojson'
import JoinJson from './component/joinJson'
import ChooseResources from './component/chooseResources'

import css from './index.less'
const { Option } = Select
const originData = [];

originData.push({
  key: new Date().getTime(),
  name: "",
  attr: "Object",
  value: "",
  level: 1,
  type: "frist",
})

const EditableTable = () => {
  const searchParams = useLocation().query;
  const resId = !!searchParams.id ? searchParams.id : "";
  const [form] = Form.useForm();
  const [headForm] = Form.useForm();
  const [data, setData] = useState(originData);
  const [versionList, setVersionList] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [platformNotAll, setPlatformNotAll] = useState(false);
  const [platformIsAll, setPlatformIsAll] = useState(false);
  const [chooseMobalVisible, setChooseMobalVisible] = useState(false);
  const [editingKey, setEditingKey] = useState('');
  const [expandedKeys, setExpandedKeys] = useState([]);

  // 遍历数组 寻找空值
  const findArrEmpty = (arr) => {
    return arr.some(item => {
      if(!item.name) return true;
      if(!item.value.toString() && item.attr != "Object" && item.attr != "Array") return true;
      if(!!item.children && !!item.children.length) {
        return findArrEmpty(item.children);
      }
    })
  }

  // 遍历列表展开的Key
  const mapRowKeys = (list, oldKeys) => {
    let keys = !!oldKeys ? [...oldKeys] : [];
    list.forEach(item => {
      if(item.attr === "Object" || item.attr === "Array") keys.push(item.key);
      if(!!item.children && !!item.children.length && item.level === 1) {
        item.children.forEach(child => {
          if(item.attr === "Object" || item.attr === "Array") keys.push(child.key);
        })
      }
    })
    setExpandedKeys(keys);
  }

  // 监听点击展开关闭按钮
  const handleClickExpand = (expanded, record) => {
    let keys = [...expandedKeys];
    if(expanded) {
      keys.push(record.key);
    } else {
      let index = -10;
      index = keys.findIndex(item => item === record.key);
      keys.splice(index, 1)
    }
    setExpandedKeys(keys);
  }

  // 获取资源位详情
  useEffect(() => {
    if(!!resId) {
      getResDetail({
        id: resId
      }).then(res => {
        if(res.code === 200 || res.code === 0) {
          const data = res.data;
          const pList = data.platform || [];
          // 遍历平台选择
          let platform = pList.map(item => {
            let value = Number(item)
            if(value === 0) {
              setPlatformIsAll(true)
              setPlatformNotAll(false)
            } else if(platformIsAll === true || platformNotAll === false) {
              setPlatformIsAll(false)
              setPlatformNotAll(true)
            }
            return value
          });
          // 列表数据
          let list = [];
          let frist = true;
          let jsonObj = {};
          let define = {};
          try {
            jsonObj = data.data;
            define = !!data.define ? data.define : undefined;
            if(!!jsonObj && jsonObj !== {}) {
              for(let key in jsonObj) {
                list.push(objToArr({key, value: jsonObj[key], level: 1, frist, define: define[key] }));
                if(frist) frist = false;
              }
              setData(list);
              mapRowKeys(list);
            }
          } catch (error) {
            jsonObj = {
              key: new Date().getTime(),
              name: "",
              attr: "Object",
              value: "",
              level: 1,
              type: "frist",
            }
          }
          headForm.setFieldsValue({
            name: data.name,
            resourceKey: data.resourceKey,
            appVersion: data.appVersion,
            state: data.state,
            platform,
          })
        }
      })
    }
  }, [resId]);

  // 首次加载
  useEffect(() => {
    getVersionAllList().then(res => {
      if(res.code === 200 || res.code === 0) {
        setVersionList(res.data)
      } else {
        message.error(res.msg)
      }
    })
  }, [])


  // 编辑表格
  const isEditing = (record) => record.key === editingKey;
  const edit = (record) => {
    form.setFieldsValue({
      name: '',
      attr: '',
      value: '',
      ...record,
    });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey('');
  };

  //展开行
  const openExpande = record => {
    let keys = [...expandedKeys];
    // 展开表格数据
    if(!!record.preParent) {
      let preIndex = keys.findIndex(item => record.preParent === item.key);
      if(preIndex === -1) keys.push(record.preParent);
    }
    if(!!record.parent) {
      let pIndex = keys.findIndex(item => record.parent === item.key);
      if(pIndex === -1) keys.push(record.parent);
    }
    setExpandedKeys(keys);
  }


  // 添加列表子级字段
  const addRow = (record, index, type) => {
    const newData = [...data];
    const defaultItem = {
      key: new Date().getTime(),
      name: "",
      attr: "Object",
      value: "",
    };
    const haveEmpty = findArrEmpty(newData);
    if(haveEmpty) {
      message.warn('请确认所有值已输入');
      return;
    }
    // 添加一级
    if(type === "frist"){
      newData.push({
        ...defaultItem,
        level: 1,
      });
      setData(newData);
      edit(defaultItem);
      openExpande(defaultItem);
      return ;
    }
    // 添加子级
    if(record.level > 2) return;
    let rowData = {};
    if(record.level === 1) {
      rowData = newData[index];
      const secondData = {
        ...defaultItem,
        preParent: record.key,
        level: record.level + 1,
      };
      if(!!rowData.children && !!rowData.children.length){
        rowData.children.push(secondData)
      } else {
        rowData.children = [ secondData ]
      }
      newData[index] = {
        ...rowData
      }
      openExpande(secondData);
    }
    if(record.level === 2){
      const preIdx = newData.findIndex((item => item.key === record.preParent))
      rowData = newData[preIdx]
      let curData = rowData.children[index];
      const thirdData = {
        ...defaultItem,
        attr: "String",
        parent: curData.key,
        preParent: curData.preParent,
        level: curData.level + 1,
      }
      if(!!curData.children && !!curData.children.length){
        curData.children.push(thirdData)
      } else {
        curData.children = [ thirdData ]
      }
      rowData.children[index] = {
        ...curData
      }
      newData[preIdx] = {
        ...rowData
      }
      openExpande(thirdData);
    }
    setData(newData);
    edit(defaultItem);
  }

  // 保存行数据
  const save = async (record, index) => {
    try {
      const row = await form.validateFields();
      if(row.attr === "Number" && Number.isNaN(Number(row.value))) {
        message.error("属性值 请输入数字")
        return
      } else if(row.attr === "Number") {
        row.value = Number(row.value)
      }
      if(row.attr === "Boolean") {
        if(row.value !== "true" && row.value !== "false") {
          message.error("请输入true或false")
          return
        }
        //  else {
        //   row.value = row.value == "true" ? true : false;
        // }
      }
      if(row.attr === "Reference") {
        if(!row.value) {
          message.error("请点击选择资源位")
          return
        }
      }
      const newData = [...data];
      const isFrist = !record.preParent && !record.parent;
      const isSecond = !!record.preParent && !record.parent;
      const isThird = !!record.preParent && !!record.parent;
      const newRowData = {
        ...record,
        ...row
      };
      if(isFrist) {
        newData.splice(index, 1, newRowData);
      }
      if(isSecond) {
        let preIdx = newData.findIndex((item) => record.preParent === item.key);
        newData[preIdx].children.splice(index, 1, newRowData);
      }
      if(isThird) {
        let preIdx = newData.findIndex((item) => record.preParent === item.key);
        let pIdx = newData[preIdx].children.findIndex((item) => record.parent === item.key);
        newData[preIdx].children[pIdx].children.splice(index, 1, newRowData);
      }
      setData(newData);
      setEditingKey('');
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };
  
  // 删除行数据
  const deleteRow = (record, index) => {
    let newData = [...data];
    if(record.level === 1) {
      newData.splice(index, 1);
    }
    if(record.level === 2) {
      const preIdx = newData.findIndex(item => item.key === record.preParent)
      newData[preIdx].children.splice(index, 1);
    }
    if(record.level === 3) {
      const preIdx = newData.findIndex(item => item.key === record.preParent)
      const pIdx = newData[preIdx].children.findIndex(item => item.key === record.parent)
      newData[preIdx].children[pIdx].children.splice(index, 1);
    }
    setData(newData);
  }
  
  // 设置所属平台选项是否可选
  const setOptionState = (values) => {
    if(values.length > 0) {
      if(values.some(item => item === 0)) {
        setPlatformNotAll(false)
        setPlatformIsAll(true)
      } else {
        setPlatformNotAll(true)
        setPlatformIsAll(false)
      }
    } else {
      setPlatformNotAll(false)
      setPlatformIsAll(false)
    }
  }
  
  // 提交资源位数据
  const onFinish = async () => {
    if(editingKey) {
      message.error("请先保存编辑！");
      return ;
    }
    // 数据转JSON
    let obj = {};
    let define = {};
    let resultData = {};
    let isEmpty = false;
    const formData = await headForm.validateFields();
    if (formData.platform && formData.platform[0] == 0) {
      formData.platform = platformTypeAll
    }
    let platformData = '';
    data.forEach(item => {
      if(!!item.name){
        resultData = itemToJson(item);
        obj[item.name] = resultData.data;
        define[item.name] = resultData.define;
      } else {
        isEmpty = true
      }
    })
    if(isEmpty) {
      message.error("请确认字段是否已全部填写");
      return ;
    }
    for(let key in obj) {
      if(obj[key] && obj[key]?.indexOf?.('\\n') > -1) {
        obj[key] = obj[key].replaceAll('\\n', '\n');
      }
    }
    formData.data = obj;
    formData.define = define;
    // return
    const handleRessult = (res) => {
      if(res.code === 200 || res.code === 0){
        message.success(`${!!resId ? "保存" : "添加"}成功`);
        if(history.action == "PUSH"){
          window.history.back();
          setTimeout(() => { window.location.reload(); }, 200)
        } else {
          history.push("/dc-management/list");
        }
      } else {
        message.error(res.msg);
      }
    }
    if(!!resId) {
      updateRes({
        ...formData,
        id: resId,
      }).then(handleRessult);
      return
    }
    addRes({
      ...formData
    }).then(handleRessult)
  }

  // 显示JSON导入弹窗
  const showModal = () => {
    setIsModalVisible(true);
  };

  // 数据类型选择
  const EditSelect = (record) => {
    let option = [];
    let em = "";
    for(let key in attrType) {
      em = <Option value={ key }  key={ key }>{ attrType[key] }</Option>;
      // 如果是三级菜单 只可选择Object Array 以外的数据类型
      if(record.level === 3) {
        if(key !== "Object" && key !== "Array") {
          option.push(em);
        }
      }
      // 一级 二级菜单处理
      if(record.level < 3) {
        if(!!record.children && !!record.children.length){
          if(key === "Object" || key === "Array") {
            option.push(em);
          }
        } else {
          option.push(em);
        }
      }
    }
    return (
      <Select defaultValue={record.attr} onChange={() => {}} className="default-input-width">
        { option }
      </Select>
    )
  }

  // table input 获得焦点
  const handleOnfocus = async ({
    record,
    title,
    em,
  }) => {
    const row = await form.getFieldsValue();
    if((record.attr === "Reference" || row.attr === "Reference") && title === "属性值" ) {
      setChooseMobalVisible(true);
    }
  }
  
  // 这是关联资源位值
  const handleSetResourceKey = (key) => {
    form.setFieldsValue({
      value: key
    })
  }

  // 替换单元格编辑
  const EditableCell = ({
    value,
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
  }) => {
    let isNumValue = dataIndex === "value" && record.attr === "Number";
    let inputNode = <Input onFocus={(em) => { handleOnfocus({record, title, em}) }}/>;
    let pattern = "";
    let patternText = "";
    let inputRequired = true;
    if(dataIndex === "attr") inputNode = EditSelect(record);
    if(dataIndex === "name") {
      pattern = /^[A-Za-z]+$/i;
      patternText = "只能输入字母"
    } else if(isNumValue) {
      // inputNode = <InputNumber />
      // pattern = /^(\-|\+)?\d+(\.\d+)?$/i;
      // patternText = "只能输入数字"
    }
    if(dataIndex === "value" && (record.attr === "Object" || record.attr === "Array")) inputRequired = false;
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item
            name={dataIndex}
            style={{
              margin: 0,
            }}
            rules={[
              {
                required: inputRequired,
                message: `请${dataIndex == "attr" ? "选择" : "输入"}${title}`,
              },
              {
                pattern,
                message: patternText,
              }
            ]}
          >
            {inputNode}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };
  
  // 单元格
  const columns = [
    {
      title: '字段名称',
      width: '28%',
      dataIndex: 'name',
      editable: true,
    },
    {
      title: '字段属性',
      dataIndex: 'attr',
      width: '15%',
      editable: true,
      render: (text, record) => attrType[text]
    },
    {
      title: '属性值',
      dataIndex: 'value',
      editable: true,
    },
    {
      title: '操作',
      dataIndex: 'operation',
      width: '28%',
      render: (_, record, index) => {
        const editable = isEditing(record);
        // 不显示添加子级按钮
        const hiddenAddChild = record.level === 3 || (record.attr !== "Object" && record.attr !== "Array") ? true : false
        return editable ? (
          <span>
            <a
              href="javascript:;"
              onClick={() => save(record, index)}
              style={{
                marginRight: 8,
              }}
            >
              保存
            </a>
            <Popconfirm title="您确定要取消?" onConfirm={cancel}>
              <a>取消</a>
            </Popconfirm>
          </span>
        ) : (
          <>
            <Typography.Link hidden={!record.type} disabled={editingKey !== ''} onClick={() => addRow(record, index, "frist")}>添加同级</Typography.Link>
            <Divider hidden={!record.type} type="vertical" />
            <Typography.Link hidden={hiddenAddChild} disabled={editingKey !== ''} onClick={() => addRow(record, index)}>添加子级</Typography.Link>
            <Divider hidden={hiddenAddChild} type="vertical" />
            <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>编辑</Typography.Link>
            <Divider hidden={!!record.type} type="vertical" />
            <Popconfirm title="您确定要删除该行数据?" onConfirm={() => deleteRow(record, index)}>
              <Typography.Link type="danger" hidden={!!record.type} disabled={editingKey !== ''}>删除</Typography.Link>
            </Popconfirm>
          </>
        );
      },
    },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === 'attr' ? 'number' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });
  return (
    <PageContainer>
      <Form
        form={headForm}
        layout="inline"
        className={css.head_form}
        onFinish={onFinish}
      >
        <Form.Item 
          className={css.form_item}
          name="name"
          label="资源位名称"
          rules={[
            {
              required: true,
              message: '请填写资源位名称',
            },
          ]}
        >
          <Input className="default-input-width" placeholder="请输入资源位名称" />
        </Form.Item>
        <Form.Item 
          className={css.form_item}
          name="resourceKey"
          label="资源位编号"
          rules={[
            {
              required: true,
              message: '请填写资源位编号',
            },
            {
              pattern: /^[A-Z]+$/,
              message: '只能输入大写字母',
            },
          ]}
        >
          <Input className="default-input-width" placeholder="请输入资源位编号" />
        </Form.Item>
        <Form.Item
          className={css.form_item}
          name="appVersion"
          label="版本号"
          rules={[
            {
              required: true,
              message: '请选择资源位所属版本',
            },
          ]}
        >
          <Select
            placeholder="请选择资源位所属版本"
            className={"default-input-width"}
          >
            {
              versionList.map(item => <Option value={item.name} key={item.name}>{item.name}</Option>)
            }
          </Select>
        </Form.Item>
        <Form.Item
          className={css.form_item}
          name="platform"
          label="所属平台"
          rules={[
            {
              required: true,
              message: '请选择资源位所属平台',
            },
          ]}
        >
          <Select
            mode="multiple"
            placeholder="请选择资源位所属平台"
            className={css.platform_select}
            onChange={setOptionState}
          >
            <Option disabled={platformNotAll} value={0}>全平台</Option>
            <Option disabled={platformIsAll} value={1}>iOS</Option>
            <Option disabled={platformIsAll} value={2}>Android</Option>
            <Option disabled={platformIsAll} value={3}>Miniprogram</Option>
            <Option disabled={platformIsAll} value={4}>H5</Option>
            <Option disabled={platformIsAll} value={5}>FlutterAndroid</Option>
            <Option disabled={platformIsAll} value={6}>FlutterIos</Option>
          </Select>
        </Form.Item>
        <Form.Item
          className={css.form_item}
          name="state"
          label="状态"
          rules={[
            {
              required: true,
              message: '请选择状态',
            },
          ]}
        >
          <Select
            className={"default-input-width"}
            placeholder="请选择状态"
          >
            <Option value="启用">启用</Option>
            <Option value="禁用">禁用</Option>
          </Select>
        </Form.Item>
        <Form.Item className={css.save_item}>
          <Button type="primary" htmlType="submit" className={css.sub_btn}>保存资源位</Button>
          <Button type="default" onClick={showModal}>导入JSON数据</Button>
        </Form.Item>
      </Form>
      <Form form={form} component={false}>
        <Table
          rowKey="key"
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          bordered
          dataSource={data}
          columns={mergedColumns}
          expandable={{
            defaultExpandAllRows: true,
            expandedRowKeys: expandedKeys,
            onExpand: handleClickExpand
          }}
          rowClassName="editable-row"
          pagination={false}
        />
      </Form>
      { isModalVisible ? 
        <JoinJson 
          onCancel={() => { setIsModalVisible(false) }}
          onSetData={(data) => { setData(data);console.log(data) }}
        /> 
        : 
        ""
      }
      { chooseMobalVisible ? 
        <ChooseResources 
          onCancel={() => { setChooseMobalVisible(false) }}
          handleSetKey={(key) => { handleSetResourceKey(key) }}
        /> 
        : 
        ""
      }
    </PageContainer>
  );
};

export default (mountNode) => <EditableTable />;