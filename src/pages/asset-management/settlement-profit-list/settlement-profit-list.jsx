import React, { useEffect, useState } from 'react'
import { Spin, Empty } from 'antd'
import { PageContainer } from '@/components/PageContainer';
import * as api from '@/services/product-management/product-category'
import Form from './form';
import styles from './style.less'

const List = (props) => {
  const { parentId = 0, onClick = () => { }, edit } = props;
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [selectId, setSelectId] = useState(null);

  const getData = () => {
    setLoading(true);
    api.category({ gcParentId: parentId })
      .then(res => {
        if (res.code === 0) {
          setData(res.data.records)
        }
      })
      .finally(() => {
        setLoading(false);
      })
  }

  useEffect(() => {
    getData();
  }, [parentId])

  return (
    <Spin
      spinning={loading}
    >
      <div style={{ marginRight: 50 }}>
        <div className={styles.header}>
          <a>
            {parentId === 0 ? '一' : '二'}级分类
          </a>
        </div>
        {
          data.length ?
            <ul className={styles.ul}>
              {
                data.map((item) =>
                  <li
                    key={item.id}
                    className={styles.li}
                    onClick={() => { setSelectId(item.id); onClick(item.id) }}
                    style={{ backgroundColor: (parentId === 0 && selectId === item.id) ? '#f0f0f0' : '#fff' }}
                  >
                    <img src={item.gcIcon} />
                    <span>{item.gcName}</span>
                    <div className={styles.actions}>
                      <a onClick={(e) => { e.stopPropagation(); edit(item) }}>添加结算模式</a>
                    </div>
                  </li>
                )
              }
            </ul>
            :
            <Empty />
        }
      </div>
    </Spin >
  )
}

const SettlementProfitList = () => {
  const [visible, setVisible] = useState(false);
  const [selectId, setSelectId] = useState(null);
  const [formParams, setFormParams] = useState({})

  const edit = (params) => {
    setFormParams(params)
    // setVisible(true)
  }

  return (
    <PageContainer>
      <Form
        visible={visible}
        setVisible={setVisible}
        {...formParams}
      />
      <div style={{ display: 'flex', width: '100%', justifyContent: 'center' }}>
        <List onClick={(id) => { setSelectId(id) }} edit={edit} />
        {selectId && <List parentId={selectId} edit={edit} />}
      </div>
    </PageContainer>
  )
}

export default SettlementProfitList;
