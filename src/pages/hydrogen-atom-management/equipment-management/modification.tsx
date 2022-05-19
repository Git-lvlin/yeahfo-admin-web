import { useEffect, useState } from "react"
import ProForm, { 
  ModalForm, 
  ProFormDigit
} from '@ant-design/pro-form'
import { ExclamationCircleOutlined } from "@ant-design/icons"

import type{ FC } from "react"
import { ModificationProps, OptProps, InfoProps } from "./data"

import styles from "./styles.less"
import { updateUseTime, findUseTime } from '@/services/hydrogen-atom-management/equipment-management'

const Modification: FC<ModificationProps> = (props) => {
  const { visible, setVisible, imei, phone } = props
  const [info, setInfo] = useState<InfoProps>()

  useEffect(()=> {
    findUseTime({imei}).then(res => {
      setInfo(res.data)
    })
  }, [])

  const submit = (v: OptProps) => {
    new Promise((resolve, reject) => {
      updateUseTime({
        imei,
        useTime: v.useTime,
        nowUseTime: info?.useTime,
        phone
      },{
        showSuccess: true
      }).then(res => {
        if(res.success) {
          resolve('')
        } else {
          reject()
        }
      })
    })
  }

  const formItemLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 }
  }

  return (
    <ModalForm
      visible={visible}
      onFinish={async (values) => {
        submit(values)
        return true
      }}
      layout='horizontal'
      onVisibleChange={setVisible}
      title='修改提示'
      width={550}
      {...formItemLayout}
    >
      <div className={styles.tip}>
        <ExclamationCircleOutlined/>
        是否确定修改机器单次使用时长？
      </div>
      <div className={styles.text}>修改后机器再使用即按最新时长使用</div>
      <ProForm.Item label='当前单次使用时长'>{ info?.useTime }分钟</ProForm.Item>
      <ProFormDigit
        label='更新后单次使用时长'
        name='useTime'
        width='sm'
        rules={
          [{
            required: true,
            message: '请输入期望单次使用时长'
          }]
        }
        fieldProps={{
          placeholder: '请输入期望单次使用时长',
          step: 1,
          max: 600,
          min: 1,
          addonAfter: '分钟'
        }}
        
      />
    </ModalForm>
  )
}

export default Modification