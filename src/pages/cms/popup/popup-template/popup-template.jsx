import React, { useState, useEffect } from 'react'
import { Button, Form, Space, Pagination, Spin } from 'antd'
import ProForm, { ProFormText } from '@ant-design/pro-form'
import { PageContainer } from '@/components/PageContainer';

import { popupList } from '@/services/message-management/message-template-config'
import styles from './style.less'
import Edit from './form'

const PopupTemplate = () => {
  const [form] = Form.useForm()
  const [data, setData] = useState([])
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(8)
  const [pageTotal, setPageTotal] = useState(0)
  const [formVisible, setFormVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [refresh, setRefresh] = useState(0)
  const [search, setSearch] = useState(0)
  const [title, setTitle] = useState('')
  const [selectItem, setSelectItem] = useState(null)

  const getDetail = (t, v) => {
    setSelectItem(v)
    setTitle(t)
    setFormVisible(true)
  }

  const pageChange = (a, b) => {
    setPage(a)
    setPageSize(b)
  }

  const getFieldValue = () => {
    const { ...rest } = form.getFieldsValue()
    return {
      ...rest
    }
  }

  useEffect(() => {
    setLoading(true)
    popupList({
      page,
      size: pageSize,
      ...getFieldValue()
    }).then(res => {
        if (res.success) {
          setData(res.data)
          setPageTotal(res.total)
        }
      }).finally(() => {
        setLoading(false)
      })
  }, [page, pageSize, form, refresh, search])

  return (
    <PageContainer title={false}>
      <ProForm
        form={form}
        style={{ backgroundColor: '#fff', padding: 20, paddingLeft: 42 }}
        layout="inline"
        onFinish={() => {
          setPage(1)
          setSearch(search + 1)
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
                    查询
                  </Button>
                  <Button
                    onClick={() => {
                      form?.resetFields()
                      form?.submit()
                    }}
                  >
                    重置
                  </Button>
                  {/* <Button
                    type="primary"
                    onClick={() => {
                      getDetail("新建")
                    }}
                  >
                    新建
                  </Button> */}
                </Space>
              </div>
            );
          },
        }}
      >
        <ProFormText
          name="name"
          label="模板名称"
        />
      </ProForm>
      <Spin spinning={loading}>
        <div className={styles.box}>
        {
          data&&data.map(
            (item) => (
              <span 
                className={styles.itembox}
                key={item.name}
              >
                {item.backgroundImageUrl&&<img className={styles.img} src={item.backgroundImageUrl} />}
                <p className={styles.title}>
                  <span>{item.name}</span>
                  <Button onClick={()=>{getDetail("编辑", item)}}>编辑</Button>
                </p>
              </span>
            )
          )
        }
        </div>
      </Spin>
      <Pagination
        className={styles.pagination}
        total={pageTotal}
        showTotal={() => `共 ${pageTotal} 个APP弹窗`}
        pageSize={pageSize}
        current={page}
        onChange={pageChange}
      />
      {
        formVisible &&
        <Edit
          visible={formVisible}
          setVisible={setFormVisible}
          title={title}
          data={selectItem}
          change={refresh}
          setChange={setRefresh}
          callback={() => { setSelectItem(null) }}
          onClose={() => { setSelectItem(null) }}
        />
      }
    </PageContainer>
  );
};

export default PopupTemplate