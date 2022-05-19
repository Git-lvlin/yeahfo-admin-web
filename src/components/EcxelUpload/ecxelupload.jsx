import React, { useState, useEffect, useRef } from 'react';
import { Upload as AntUpload, message } from 'antd';
import { UploadOutlined, LoadingOutlined } from '@ant-design/icons';
import upload from '@/utils/upload'

const EcxelUpload = (props) => {
  const { value, onChange, code= 206, maxCount = 1, size, dimension, proportion, disabled = false, calback } = props;
  const [fileList, setFileList] = useState([])
  const [loading, setLoading] = useState(false)
  const fileData = useRef([]);


  const onRemove = (file) => {
    fileData.current = fileList.filter(item => item.url !== file.url)
    setFileList(fileData.current);
    return true;
  }

  const customRequest = ({ file }) => {
    setLoading(true);
    upload(file, code)
      .then(res => {
        calback(res)
        const arr = [...fileData.current];
        arr.push({
          ...file,
          url: res,
        })
        fileData.current = arr;
        setFileList(fileData.current);
      })
      .finally(() => {
        setLoading(false);
      })
  }

  useEffect(() => {
    if (!fileList.length) {
      if (Array.isArray(value) && value?.length) {
        fileData.current = value.map((item, index) => {
          return {
            url: item,
            uid: index
          }
        })
        setFileList(fileData.current)
      } else if (value && typeof value === 'string') {
        fileData.current = [{
          url: value,
          uid: 0
        }]
        setFileList(fileData.current)
        onChange(value)
      }
    }
  }, [value])

  return (
    <AntUpload
      listType="picture-card"
      fileList={fileList}
      customRequest={customRequest}
      onRemove={onRemove}
      disabled={disabled}
    >
      {
        (fileList.length < maxCount && !disabled)
        &&
        <div>
          {loading ? <LoadingOutlined /> : <UploadOutlined />}
          <p>导入</p>
        </div>
      }
    </AntUpload>
  )
}

export default EcxelUpload;
