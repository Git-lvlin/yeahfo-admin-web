import { useEffect, useState } from "react"
import ProForm, { 
  ModalForm,
  ProFormTextArea
} from '@ant-design/pro-form'
import { ExclamationCircleOutlined } from "@ant-design/icons"
import moment from 'moment'

import type{ FC } from "react"
import type { ModalFormProps, OptProps, InfoProps } from "./data"

import styles from './styles.less'
import { opt, findStartPage } from '@/services/hydrogen-atom-management/equipment-management'

const BlockUp: FC<ModalFormProps> = (props) => {
  const { visible, setVisible, id, type, refs, user, phone, status, expire } = props
  const [info, setInfo] = useState<InfoProps>()

  useEffect(()=> {
    findStartPage({
      imei: id
    }).then(res => {
      setInfo(res.data)
    })
    return ()=> {
      setInfo({})
    }
  }, [])
  
  const submit = (v: OptProps) => {
    new Promise((resolve, reject) => {
      opt({
        imei: id,
        type,
        phone,
        remark: v.remark
      },
      {
        showSuccess: true,
        showError: true
      }
      ).then(res => {
        if(res.success) {
          refs.current?.reload()
          resolve('')
        }else {
          reject()
        }
      })
    })
  }

  const formItemLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 17 }
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
      title='确认提示'
      
      width={550}
      {...formItemLayout}
    >
      {
        (type === 1 || type === 2)?
        <>
          <div className={styles.tip}>
            <ExclamationCircleOutlined/>
            是否确定{type === 1 ? '停用' : '启用'}机器
          </div>
          {
            status !== 3 &&
            <div className={styles.text}>{type === 1 ? '停用' : '启用'}后机器{type === 1 ? '将无法运营' : '即可正常使用'}</div>
          }
          {
            (status === 3 && type === 2) &&
            <div className={styles.overdue}>此操作为逾期店主免费开启使用至月底，若要逾期店主缴费才能使用请开启缴费入口（当前操作后店主即可正常使用机器）</div>
          }
          <ProFormTextArea
            label={type === 1 ? '停用理由' : '启用说明'}
            name="remark"
            width='md'
            fieldProps={{
              showCount: true,
              maxLength: 50,
              placeholder: `请输入${type === 1 ? '停用' : '启用'}用户机器使用的理由，5-50个字符`
            }}
            validateFirst
            rules={[
              { 
                required: true
              },
              () => ({
                validator(_, value) {
                  if (value.length < 5) {
                    return Promise.reject(new Error(`请输入5-50个字符`))
                  }
                  return Promise.resolve()
                },
              })
            ]}
          />
          {
            (status === 2 && type === 2)&&
            <ProForm.Item
              label="租期状态"
            >
              租期中
            </ProForm.Item>
          }
          {
            (status === 3 && type === 2)&&
            <ProForm.Item
              label="租期状态"
            >
              已逾期（已逾期{moment(expire).fromNow().replace('前', '')}）
            </ProForm.Item>
          }
          {
            ((status === 2 || status === 3) && type === 2)&&
            <ProForm.Item
              label="租期截止日"
            >
              {expire}
            </ProForm.Item>
          }
          {
            (status === 3 && type === 2)&&
            <ProForm.Item 
              label='启用后租期截止日期'
              extra={<span>{info?.nowDate}——{info?.deadlineDate}共{info?.sumDay}天</span>}
            >
              {info?.deadlineDate}（即日起至月底 ）
            </ProForm.Item>
          }
        </>:
        <>
          <div className={styles.tip}>
            <ExclamationCircleOutlined/>
            是否确定解除绑定用户{user}机器ID({id})
          </div>
          <div className={styles.text}>解除绑定后将无法管理机器！！！</div>
          <ProFormTextArea
            label="解绑理由"
            name="remark"
            width='md'
            fieldProps={{
              showCount: true,
              maxLength: 50,
              placeholder: `请输入解绑用户机器使用的理由，5-50个字符`
            }}
            validateFirst
            rules={[
              { 
                required: true
              },
              () => ({
                validator(_, value) {
                  if (value.length < 5) {
                    return Promise.reject(new Error(`请输入5-50个字符`))
                  }
                  return Promise.resolve()
                },
              })
            ]}
          />
        </>
      }
    </ModalForm>
  )
}

export default BlockUp