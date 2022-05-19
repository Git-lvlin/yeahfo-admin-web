import React, { useState, useRef } from 'react'
import { PageContainer } from '@/components/PageContainer';
import { EditableProTable } from '@ant-design/pro-table';
import { levelPage, levelPageEdit } from '@/services/intensive-store-management/lvl-setup'
import { Button, DatePicker, Form, Space, message } from 'antd';
import { amountTransform } from '@/utils/utils'
import Upload from '@/components/upload';
import styles from './style.less';


const LvlRule = () => {
  const [dataSource, setDataSource] = useState([]);
  const [editableKeys, setEditableKeys] = useState([])
  const [date, setDate] = useState(null);
  const actionRef = useRef();

  const columns = [
    {
      title: '等级',
      editable: false,
      dataIndex: 'level',
    },
    {
      title: '等级徽章',
      dataIndex: 'icon',
      render: (_) => <img width="50" height="50" src={_} />,
      renderFormItem: () => <Upload maxCount={1} className={styles.upload} accept="image/png" />
    },
    {
      title: '等级名称',
      dataIndex: 'levelName',
    },
  ]

  const postData = (data) => {
    setDataSource(data)
  }

  const onChange = (e) => {
    setDate(e?.format?.('YYYY-MM-DD HH:mm:ss'))
  }

  const submit = () => {
    if (!date) {
      message.error('请选择新规则生效时间')
      return;
    }
    const arr = [];
    dataSource.forEach(item => {
      arr.push({
        id: item.id,
        level: item.level,
        icon: item.icon,
        level_name: item.levelName,
      })
    })
    levelPageEdit({
      save_time: date,
      save_data: arr,
    }, { showSuccess: true }).then(res => {
      if (res.code === 0) {
        actionRef.current.reload();
        setEditableKeys([])
      }
    });
  }

  return (
    <PageContainer>
      <div style={{ backgroundColor: '#fff', paddingTop: 30 }}>
        <EditableProTable
          columns={columns}
          rowKey="id"
          value={dataSource}
          request={levelPage}
          postData={postData}
          actionRef={actionRef}
          params={{
            pageSize: 99,
          }}
          editable={{
            editableKeys,
            actionRender: (row, config, defaultDoms) => {
              return [defaultDoms.delete];
            },
            onValuesChange: (record, recordList) => {
              setDataSource(recordList)
            }
          }}
          bordered
          recordCreatorProps={false}
          style={{ marginBottom: 20 }}
        />
        <div style={{ padding: 30 }}>
          {editableKeys.length !== 0 && <Form.Item
            label="新规则生效时间"
            required
          >
            <DatePicker
              showNow={false}
              showTime
              onChange={onChange}
              // disabledDate={(currentDate) => { return +currentDate < +new Date() || new Date(+currentDate).getDate() === new Date().getDate() }}
            />
          </Form.Item>}
          {editableKeys.length === 0 && <Button type="primary"
            onClick={() => {
              setEditableKeys(dataSource.map(item => item.id))
            }}
          >修改</Button>}
          {editableKeys.length !== 0 && <Space>
            <Button type="primary" onClick={() => { submit() }}>确认修改</Button>
            <Button onClick={() => {
              setEditableKeys([])
            }}>取消修改</Button>
          </Space>}
        </div>
      </div>
    </PageContainer>
  )
}


export default LvlRule;

