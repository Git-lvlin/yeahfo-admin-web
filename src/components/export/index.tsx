import { useEffect, useRef, useState } from 'react'
import { ModalForm } from '@ant-design/pro-form'
import { createExportTask } from '@/services/export-excel/export-template'
import { 
  Button, 
  Tooltip, 
  Form, 
  Space, 
  Pagination, 
  Spin, 
  Empty,
  Progress,
  Drawer,
  message
} from 'antd'
import ProForm, { ProFormDateTimeRangePicker } from '@ant-design/pro-form'
import ProCard from '@ant-design/pro-card'

import type { FC } from "react"
import type { ExprotProps, ExportHistoryProps, ExprotStateProps } from "./data"

import { findByWays, cancelTask } from '@/services/export-excel/export-template'
import moment from 'moment'
import styles from './styles.less'
import { paramsEmptyFilter } from '@/utils/utils'

const ExportHistory: FC<ExportHistoryProps> = ({ show, setShow, type, slot }) => {
  const [form] = Form.useForm()
  const [load, setLoad] = useState(false)
  const [pageTotal, setPageTotal] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [page, setPage] = useState(1)
  const [data, setData] = useState([])
  const [query, setQuery] = useState(0)
  const timer = useRef()
  const timeOut = useRef()
  const awaitTime = 3 * 60 * 1000   //TimeOut await times

  const pageChange = (a: number, b: number) => {
    clearInterval(timer.current)
    setPage(a)
    setPageSize(b)
  }
  const getData = ()=> {
    const { time, ...rest } = form.getFieldsValue()
    const user = localStorage.getItem("user")
    const rule = user&&JSON.parse(user).id === 1
    setLoad(true)
    findByWays({
      page,
      code: type && type,
      size: pageSize,
      searchByUser: rule ? 2 : 1,
      createStartTime: time&&moment(time[0]).format('YYYY-MM-DD HH:mm:ss'),
      createEndTime: time&&moment(time[1]).format('YYYY-MM-DD HH:mm:ss'),
      ...rest
    }).then(res => {
      if (res.success) {
        setData(res.data)
        setPageTotal(res.total)
      }
    }).finally(()=>{
      setLoad(false)
    })
  }

  useEffect(() => {
    if(show) {
      getData()
    }
  }, [show, page, pageSize, form, query])

  useEffect(()=> {
    clearInterval(timer.current)
    if(show) {
      timer.current = setInterval(()=>{
        getData()
      }, 3000)
      return ()=> {
        clearInterval(timer.current)
        setData([])
      }
    }
  }, [page, show])
  useEffect(()=> {
    timeOut.current = setTimeout(()=> {
      clearInterval(timer.current)
    }, awaitTime)
    return ()=> {
      clearTimeout(timeOut.current)
    }
  }, [show])

  const ExprotState: FC<ExprotStateProps> = ({state, desc}) => {
    if(state === 1) {
      return (
        <div>?????????...</div>
      )
    } else if(state === 2) {
      return (
        <div>????????????</div>
      )
    } else if(state === 3) {
      return (
        <Tooltip key="history" title={desc}>
          <div className={styles.fail} onMouseEnter={()=>clearInterval(timer.current)}>
            ????????????
          </div>
        </Tooltip>
      )
    } else if(state === 4) {
      return (
        <div className={styles.fail}>????????????</div>
      )
    } else {
      return ''
    }
  }
const cancelTaskCanbak=(id: number)=>{
  cancelTask({id:id}).then(res=>{
    if(res.code==0){
      message.success('????????????')
      getData()
    }
  })
}
  return (
    <>
      <Tooltip key="history" title="????????????????????????">
        {
          slot ?
          slot(()=>{setShow(true)}):
          <Button
            type='primary'
            onClick={() => {
              setShow(true)
            }}
          >
            ??????
          </Button>
        }
      </Tooltip>
      <Drawer
        title="??????????????????"
        onClose={() => {
          setShow(false)
        }}
        width={1000}
        visible={show}
        forceRender={true}
        destroyOnClose={true}
        zIndex={99999}
      >
        <ProForm
          layout="inline"
          form={form}
          onFinish={() => {
            setPage(1)
            setQuery(query + 1)
          }}
          submitter={{
            render: ({ form }) => {
              return (
                <div>
                  <Space>
                    <Button
                      type="primary"
                      onClick={() => {
                        form?.submit()
                      }}
                    >
                      ??????
                    </Button>
                    <Button
                      onClick={() => {
                        form?.resetFields()
                      }}
                    >
                      ??????
                    </Button>
                    <Button
                      onClick={() => {
                        setQuery(query + 1)
                      }}
                    >
                      ??????
                    </Button>
                  </Space>
                </div>
              )
            }
          }}
        >
          <ProFormDateTimeRangePicker
            name="time"
            label="????????????"
          />
        </ProForm>
        <Spin delay={500} spinning={load}>
          {
            data.length === 0 &&
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          }
          {
            data.map(item => (
              <ProCard
                key={item.id}
                bordered
                className={styles.card}
              >
                <div className={styles.content}>
                  <div className={styles.tag}>???????????????<span className={styles.no}>{item.id}</span></div>
                  <ExprotState state={item?.state} desc={item.exceptionDes}/>
                </div>
                <div className={styles.footer}>
                  <div className={styles.exportTime}>???????????????{item.createTime}</div>
                  <div className={styles.exportName}>????????????{item.createName}</div>
                  {
                    item?.state===2?
                    <a href={item.fileUrl}>??????</a> :
                    <div className={styles.progress}>
                      {
                        item?.state===1&&<a className={styles.cancel_task} onClick={()=>{cancelTaskCanbak(item.id)}}>????????????</a>
                      }
                      {
                        item.process!==100&&<Progress percent={item.process} size="small" />
                      }
                    </div>
                  }
                </div>
              </ProCard>
            ))
          }
        </Spin>
        <div className={styles.pagination}>
          <Pagination
            total={pageTotal}
            showTotal={(total, range) => `??? ${range[0]}-${range[1]} ???/?????? ${total} ???`}
            pageSize={pageSize}
            current={page}
            onChange={pageChange}
          />
        </div>
      </Drawer>
    </>
  )
}

const Export: FC<ExprotProps> = ({ type, conditions, text='??????', slot, slotHistory, fileName }) => {
  const [visible, setVisible] = useState(false)

  const downExcel = () => {
    let data
    const down = window.localStorage.getItem('user') as string
    const user = JSON.parse(down)
    let str = {
      operatorId: user.id,
      operatorType: 2
    };
    if (typeof conditions === 'function') {
      data = JSON.stringify(paramsEmptyFilter({
        ...conditions(),
        ...str,
      }))
    } else {
      data = JSON.stringify(paramsEmptyFilter({
        ...conditions,
        ...str,
      }))
    }

    createExportTask({
      code: type,
      fileName: fileName + '.xlsx' || type + +new Date() + '.xlsx',
      queryParamStr: data
    }).then(res => {
      if (res?.success) {
        message.success('????????????????????????')
        setVisible(true)
      }
    })
  }

  return (
    <Space size='small'>
      <ModalForm
        title={'????????????'}
        trigger={
          !slot?
          <Button type="primary">{text}</Button>:
          slot
        }
        width={500}
        submitter={{
          searchConfig: {
            submitText: '??????????????????',
            resetText: '??????'
          }
        }}
        modalProps={{
          destroyOnClose: true,
          zIndex: 99999
        }}
        onFinish={async () => {
          await downExcel()
          return true
        }}
      >
        <ol>
          <li>1????????????????????????????????????????????????????????????</li>
          <li>2?????????sheet???????????????????????????5???????????????5?????????????????????sheet???</li>
          <li>3??????????????????30??????30??????????????????????????????????????????</li>
        </ol>
      </ModalForm>
      <ExportHistory 
        show={visible}
        setShow={setVisible}
        type={type}
        slot={slotHistory}
      />
    </Space>
  )
}

export default Export
