import React, { useState, useRef } from 'react'
import { PageContainer } from '@/components/PageContainer';
import { EditableProTable } from '@ant-design/pro-table';
import { brokerPage } from '@/services/intensive-store-management/lvl-commission'
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
    {
      title: '采购订单返佣比例（%）',
      dataIndex: ['brokerageConf', 'storeCustomPoint'],
    },
    {
      title: '直推普通会员购买秒约订单交易总额返佣比例（%）',
      dataIndex: ['brokerageConf', 'normalUserPoint'],
    },
    {
      title: '直推店主会员购买采购订单交易总额返佣比例（%）',
      dataIndex: ['brokerageConf', 'storeUserPoint'],
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
          request={brokerPage}
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
      </div>
    </PageContainer>
  )
}


export default LvlRule;

