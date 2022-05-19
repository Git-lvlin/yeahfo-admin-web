import React, { useState } from 'react'
import { PageContainer } from '@/components/PageContainer';
import ProForm, {
  ProFormDateTimeRangePicker 
} from '@ant-design/pro-form'
import { Form, message } from 'antd'

import Export from './export'
import ExportHistory from '@/pages/export-excel/export-history'

// const Export = ({ type, change, conditions, title }) => {
//   const downExcel = () => {
//     let str;
//     if (typeof conditions === 'function') {
//       str = JSON.stringify(conditions())
//     } else {
//       str = JSON.stringify(conditions)
//     }

//     createExportTask({
//       code: type,
//       fileName: type + +new Date() + '.xlsx',
//       queryParamStr: str
//     }).then(res => {
//       if (res?.success) {
//         message.success('导出任务创建成功')
//         change(true)
//       }
//     })
//   }

//   return (
//     <ModalForm
//       title={'导出规则'}
//       trigger={
//         <Button type="primary">{title}</Button>
//       }
//       width={500}
//       submitter={{
//         searchConfig: {
//           submitText: '创建导出任务',
//           resetText: '取消'
//         }
//       }}
//       modalProps={{
//         destroyOnClose: true
//       }}
//       onFinish={async () => {
//         await downExcel()
//         return true
//       }}
//     >
//       <ol>
//         <li>1、数据中的图片、附件只能以链接的形式导出</li>
//         <li>2、每个sheet表导出的数据不超过5万条。超过5万条将分成多个sheet表</li>
//         <li>3、导出后保留30天，30天后将自动删除，请及时下载。</li>
//       </ol>
//     </ModalForm>
//   )
// }

const IntensiveDataExport = () => {
  const [storeVisit, setStoreVisit] = useState(false)
  const [provincesVisit, setProvincesVisit] = useState(false)
  const [totalVisit, setTotalVisit] = useState(false)
  const [form] = Form.useForm()
  const getFieldValue = () => {
    const { time, ...rest } = form.getFieldsValue()
    console.log(time);
    return {
      beginTime: time?.[0]?.format('YYYY-MM-DD HH:mm:ss'),
      endTime: time?.[1]?.format('YYYY-MM-DD HH:mm:ss'),
      ...rest
    }
  }

  return (
    <PageContainer title={false}>
      <ProForm
        layout='horizontal'
        form={form}
        submitter={{
          render: () => {
            return [
              <Export
                key='store'
                change={(e) => { setStoreVisit(e) }}
                type='exportStoreWholeSale'
                conditions={()=>getFieldValue()}
                title='按店铺导出'
              />,
              <ExportHistory
                key='storeHistory'
                show={storeVisit}
                setShow={setStoreVisit}
                type='exportStoreWholeSale'
              />,
              <Export
                key='provinces'
                change={(e) => { setProvincesVisit(e) }}
                type='exportProvinceWholeSale'
                conditions={()=>getFieldValue()}
                title='按省份导出'
              />,
              <ExportHistory
                key='provincesHistory'
                show={provincesVisit}
                setShow={setProvincesVisit}
                type='exportProvinceWholeSale'
              />,
              <Export
                key='total'
                change={(e) => { setTotalVisit(e) }}
                type='exportAllWholeSale'
                conditions={()=>getFieldValue()}
                title='汇总导出'
              />,
              <ExportHistory
                key='totalHistory'
                show={totalVisit}
                setShow={setTotalVisit}
                type='exportAllWholeSale'
              />
            ]
          }
        }}
      >
        <ProFormDateTimeRangePicker
          width="md"
          name="time"
          label="选择日期" 
        />

      </ProForm>
    </PageContainer>
  )
}

export default IntensiveDataExport
