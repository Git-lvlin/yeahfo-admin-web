import React, { useState, useRef } from 'react'
import { PageContainer } from '@/components/PageContainer';
import { EditableProTable } from '@ant-design/pro-table';
import { upgradePage, upgradePageEdit } from '@/services/intensive-store-management/lvl-rule'
import { InfoCircleOutlined } from '@ant-design/icons'
import { Button, DatePicker, Form, Space, message } from 'antd';
import { amountTransform } from '@/utils/utils'


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
      render: (value, row, index) => {
        const obj = {
          children: value,
          props: {
            rowSpan: 0,
          },
        };
        if (index % 2 === 0) {
          obj.props.rowSpan = 2;
        }
        return obj;
      }
    },
    {
      title: '等级名称',
      editable: false,
      dataIndex: 'levelName',
      render: (value, row, index) => {
        const obj = {
          children: value,
          props: {
            rowSpan: 0,
          },
        };
        if (index % 2 === 0) {
          obj.props.rowSpan = 2;
        }
        return obj;
      }
    },
    {
      title: '',
      editable: false,
      dataIndex: 'test',
    },
    {
      title: '店内下单人数(位)',
      dataIndex: 'orderUser',
      render: (value, row, index) => {
        const obj = {
          children: value,
          props: {},
        };

        if (index === 0) {
          obj.children = '申请通过即可'
          obj.props.colSpan = 4;
          obj.props.style = {
            textAlign: 'center'
          }
        }
        if (index === 1) {
          obj.children = '持续2个月未升级关闭店铺'
          obj.props.colSpan = 4;
          obj.props.style = {
            textAlign: 'center'
          }
        }

        return obj;
      },
      editable: (text, record, index) => index !== 0 && index !== 1
    },
    {
      title: '店内销售金额(元)',
      dataIndex: 'orderAmount',
      render: (value, row, index) => {
        const obj = {
          children: value,
          props: {},
        };

        if (index === 0 || index === 1) {
          obj.props.colSpan = 0;
        }

        return obj;
      },
      editable: (text, record, index) => index !== 0 && index !== 1
    },
    {
      title: '直推成功店主人数(位)',
      dataIndex: 'storeNum',
      render: (value, row, index) => {
        const obj = {
          children: value,
          props: {},
        };

        if (index === 0 || index === 1) {
          obj.props.colSpan = 0;
        }

        return obj;
      },
      editable: (text, record, index) => index !== 0 && index !== 1
    },
    {
      title: '直推成功会员人数(位)',
      dataIndex: 'storeUser',
      render: (value, row, index) => {
        const obj = {
          children: value,
          props: {},
        };

        if (index === 0 || index === 1) {
          obj.props.colSpan = 0;
        }

        return obj;
      },
      editable: (text, record, index) => index !== 0 && index !== 1
    },
  ]

  const postData = (data) => {
    const arr = [];
    data.forEach((item, index) => {
      arr.push({
        ...item,
        key: arr.length,
        test: '升到此级条件',
        orderUser: item.upgradeConf.upgradeStoreOrderUser,
        orderAmount: amountTransform(item.upgradeConf.upgradeStoreOrderAmount, '/'),
        storeNum: item.upgradeConf.upgradeStoreNum,
        storeUser: item.upgradeConf.upgradeStoreUser,
      })
      arr.push({
        ...item,
        key: arr.length,
        test: '维持此级条件',
        orderUser: item.demotionConf.demotionStoreOrderUser,
        orderAmount: amountTransform(item.demotionConf.demotionStoreOrderAmount, '/'),
        storeNum: item.demotionConf.demotionStoreNum,
        storeUser: item.demotionConf.demotionStoreUser,
      })
    })
    setDataSource(arr)
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
    dataSource.forEach((item, index) => {
      if ((index + 1) % 2 !== 0) {
        arr.push({
          id: item.id,
          level: item.level,
          upgrade_store_order_user: item.orderUser,
          upgrade_store_order_amount: amountTransform(item.orderAmount),
          upgrade_store_num: item.storeNum,
          upgrade_store_user: item.storeUser,
        })
      } else {
        arr[arr.length - 1].demotion_store_order_user = item.orderUser;
        arr[arr.length - 1].demotion_store_order_amount = amountTransform(item.orderAmount);
        arr[arr.length - 1].demotion_store_num = item.storeNum;
        arr[arr.length - 1].demotion_store_user = item.storeUser;
      }

    })
    upgradePageEdit({
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
          rowKey="key"
          value={dataSource}
          request={upgradePage}
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
              setEditableKeys(dataSource.map(item => item.key))
            }}
          >修改规则</Button>}
          {editableKeys.length !== 0 && <Space>
            <Button type="primary" onClick={() => { submit() }}>确认修改</Button>
            <Button onClick={() => {
              setEditableKeys([])
            }}>取消修改</Button>
          </Space>}
        </div>
        <div style={{ padding: 30, display: 'flex' }}>
          <InfoCircleOutlined style={{ fontSize: 30, color: '#40a9ff' }} />
          <dl style={{ marginLeft: 20 }}>
            <dt style={{ fontSize: 20, marginBottom: 10 }}>店铺规则说明</dt>
            <dd>1.升维级考核时间：满足条件实时升级，升级后实时生效；每月1日0点按当前等级进行维级考核上月运营数据；新店在第3个月初进行首次考核；</dd>
            <dd>2.对每项考核条件：1.低等级的升级条件和维级条件数据必须小于对应高等级数据；2.每一个等级的维级条件必须小于升级条件；</dd>
          </dl>
        </div>
      </div>
    </PageContainer>
  )
}


export default LvlRule;

