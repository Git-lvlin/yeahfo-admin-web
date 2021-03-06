import React,{ useEffect, useRef, useState } from 'react'
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

import { findByWays,cancelTask } from '@/services/export-excel/export-template'
import moment from 'moment'
import styles from './styles.less'

const ExportHistory = ({ show, setShow, type }) => {
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
  const pageChange = (a, b) => {
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
    return ()=> {
      setData([])
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
  const ExprotState = ({state, desc})=> {
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
const cancelTaskCanbak=(id)=>{
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
        <Button
          type='primary'
          onClick={() => {
            setShow(true)
          }}
        >
          ??????
        </Button>
      </Tooltip>
      <Drawer
        title="??????????????????"
        layout="inline"
        onClose={() => {
          setShow(false)
        }}
        form={form}
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

export default ExportHistory