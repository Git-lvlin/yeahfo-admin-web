import React, { useEffect, useState } from 'react'
import { Spin, Empty, Switch, Modal } from 'antd'
import { PageContainer } from '@/components/PageContainer';
import * as api from '@/services/product-management/product-category'
import { sortableContainer, sortableElement } from 'react-sortable-hoc';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import Form from './form';
import styles from './style.less'

const { confirm } = Modal


const SortableItem = sortableElement(({ children }) => children);

const SortableContainer = sortableContainer(({ children }) => {
  return <ul className={styles.ul}>{children}</ul>;
});

const List = (props) => {
  const { parentId = 0, onClick = () => { }, edit, selectItem, } = props;
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

  const checkGcIdData = (id, gcName, cb) => {
    api.checkGcIdData({
      id
    }).then(res => {
      if (res.code === 0) {
        confirm({
          icon: <ExclamationCircleOutlined />,
          title: `确定要关闭一级分类：${gcName} 么？`,
          content: <><span style={{ color: 'red' }}>关闭后用户和商家都无法查看其下{res.data.childCount}个子分类和{res.data.spuCount}款商品信息</span>,你还要继续吗？</>,
          okText: '继续',
          onOk() {
            cb && cb()
          }
        });
      }
    })
  }

  const categorySwitch = (status, id) => {
    setLoading(true);
    api.categorySwitch({
      gcShow: status ? 1 : 0,
      id,
    }).then(res => {
      if (res.code === 0) {
        setData(data.map(item => {
          if (item.id === id) {
            return {
              ...item,
              gcShow: status ? 1 : 0,
            }
          }
          return item;
        }))
      }

    }).finally(() => {
      setLoading(false);
    })
  }

  const toggleShow = (status, id, gcName) => {
    if (parentId === 0 && !status) {
      checkGcIdData(id, gcName, () => {
        categorySwitch(status, id)
      });
    } else {
      categorySwitch(status, id)
    }
  }


  const onSortEnd = ({ oldIndex, newIndex }) => {
    if (oldIndex === newIndex) {
      return;
    }
    setLoading(true);
    api.categorySorts({
      moveId: data[oldIndex].id,
      // eslint-disable-next-line no-nested-ternary
      afterId: newIndex === 0 ? 0 : (newIndex > oldIndex ? data[newIndex].id : data[newIndex - 1].id)
    }).then(res => {
      if (res.code === 0) {
        getData();
      }
    }).catch(() => {
      setLoading(false);
    })
  };

  useEffect(() => {
    getData();
  }, [parentId])

  return (
    <Spin
      spinning={loading}
    >
      <div style={{ marginRight: 50 }}>
        <div className={styles.header}>
          <a
            onClick={() => { edit({ selectItem, parentId, id: parentId, type: 'add', callback: () => { getData(); } }); }}
          >
            添加{parentId === 0 ? '一' : '二'}级分类
          </a>
        </div>
        <div className={styles.th}>
          <span>分类名称</span>
          {parentId === 0 && <span className={styles.fresh}>生鲜类型</span>}
          <span className={styles.state}>状态</span>
          <span className={styles.action}>操作</span>
        </div>
        {
          data.length ?
            <SortableContainer lockAxis="y" onSortEnd={onSortEnd} distance={1}>
              {
                data.map((item, index) =>
                  <SortableItem key={item.id} index={index} >
                    <li
                      className={styles.li}
                      onClick={() => { setSelectId(item.id); onClick(item) }}
                      style={{ backgroundColor: (parentId === 0 && selectId === item.id) ? '#f0f0f0' : '#fff' }}
                    >
                      <img src={item.gcIcon} />
                      <div className={styles.gcName}>{item.gcName}</div>
                      {parentId === 0 && <div className={styles.info}>
                        {{ 0: '非生鲜类目', 1: '精装生鲜类目', 2: '散装生鲜类目' }[item.fresh]}
                      </div>}
                      <div
                        className={styles.state}
                      >
                        <Switch
                          onClick={(checked, e) => { toggleShow(checked, item.id, item.gcName); e.stopPropagation(); }}
                          checked={item.gcShow === 1}
                          checkedChildren="开"
                          unCheckedChildren="关"
                          style={{ marginRight: 10 }}
                        />
                      </div>
                      <div className={styles.action}>
                        <a onClick={(e) => { edit({ selectItem, id: item.id, parentId, type: 'edit', data: item, callback: () => { getData(); } }); e.stopPropagation() }}>编辑</a>
                      </div>
                    </li>
                  </SortableItem>
                )
              }
            </SortableContainer>
            :
            <Empty />
        }
      </div>
    </Spin>
  )
}

const ProductCategory = () => {
  const [visible, setVisible] = useState(false);
  const [selectItem, setSelectItem] = useState(null);
  const [formParams, setFormParams] = useState({})

  const edit = (params) => {
    setFormParams(params)
    setVisible(true)
  }

  const remove = (id, cb) => {
    api.categoryDel({
      id
    }, { showSuccess: true }).then(res => {
      if (res.code === 0) {
        if (cb) {
          cb();
        }
      }
    })
  }

  return (
    <PageContainer>
      {visible && <Form
        visible={visible}
        setVisible={setVisible}
        {...formParams}
      />}
      <div style={{ display: 'flex', width: '100%', justifyContent: 'center', paddingTop: 30 }}>
        <List onClick={(item) => { setSelectItem(item) }} edit={edit} remove={remove} />
        {selectItem && <List selectItem={selectItem} parentId={selectItem.id} edit={edit} remove={remove} />}
      </div>
    </PageContainer>
  )
}

export default ProductCategory;

