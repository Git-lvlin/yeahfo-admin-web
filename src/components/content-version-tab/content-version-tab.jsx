import React, { useState, useEffect } from 'react';
import { Button } from 'antd';
import ProCard from '@ant-design/pro-card';
import { contentVersionList } from '@/services/cms/member/member';
const ContentVersionTab = ({setVerifyVersionId}) => {
  const [data, setData] = useState([]);
  const [indexbtn, setIndexbtn] = useState(0);
  useEffect(() => {
    contentVersionList()
      .then(res => {
        setData(res.data)
      })
    return () => {
      setData([])
    }
  }, [])

  const setId = (id, index) => {
    setIndexbtn(index)
    return setVerifyVersionId(id)
  }

  return (
    data.length?<ProCard>
      {
        data.map((item, index) => {
          return <Button key={index} type={indexbtn==index?'primary':''} onClick={() => setId(item.id, index)}>{item.title}</Button>
        })
      }
    </ProCard>:''
  )
}

export default ContentVersionTab;