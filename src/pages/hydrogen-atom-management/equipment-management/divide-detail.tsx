import { useEffect, useState } from "react"
import { Space, Button } from "antd"
import { ModalForm } from '@ant-design/pro-form'
import ProTable, { ProColumnType } from "@ant-design/pro-table"
import { history } from "umi"

import type { FC } from "react"
import type { PropsDivide } from "./data"

import { divideCommissions } from '@/services/hydrogen-atom-management/equipment-management'
import styles from "./styles.less"
import { amountTransform } from "@/utils/utils"

const DivideDetail: FC<PropsDivide> = (props) => {
  const { visible, setVisible, id, imei, user, type } = props
  const [totalAmount, setTotalAmount] = useState()
  const [data, setData] = useState()

  useEffect(()=>{
    divideCommissions({
      memberDeviceId: id
    }).then(res => {
      setData(res.data?.items)
      setTotalAmount(res.data?.totalCommission)
    })  
  }, [])

  const columns: ProColumnType<PropsDivide>[] = [
    {
      title: '序号',
      valueType: 'indexBorder'
    },
    {
      title: '提成对象',
      dataIndex: 'objectName',
      align: 'center'
    },
    {
      title: '提成账号',
      dataIndex: 'accountName',
      align: 'center'
    },
    {
      title: '分成金额（元）',
      dataIndex: 'commission',
      align: 'center',
      render: (_) => amountTransform(_, '/')
    }
  ]

  return (
    <ModalForm
      visible={visible}
      onFinish={async ()=>{
        return true
      }}
      onVisibleChange={setVisible}
      title='分成明细'
      width={550}
      submitter={{
        render: (props) => {
          return [
            <div className={styles.btn}>
              <a
                key="1"
                onClick={() => {setVisible(false); history.push('/hydrogen-atom-management/hydrogen-atom-configuration')}}
              >
                查看分成配置
              </a>
              <Button
                key="2"
                type="primary"
                onClick={() => {
                  props.submit()
                }}
              >
                确定
              </Button>
            </div>
          ]
        }
      }}
    >
      <div className={styles.tableTitle}>
        <Space size={10}>
          <div>用户：{user}</div>
          <div>机器ID：{imei}</div>
        </Space>
        <div>{type === 1 ? '租金' : '购买'}款金额: {amountTransform(totalAmount, '/').toFixed(2)}元</div>
      </div>
      <ProTable<PropsDivide>
        rowKey="objectName"
        columns={columns}
        dataSource={data}
        pagination={false}
        search={false}
        options={false}
      />
    </ModalForm>
  )
}

export default DivideDetail