import React, { useState} from 'react';
import { ModalForm} from '@ant-design/pro-form';
import ProTable from '@ant-design/pro-table';
import { couponVerifyList } from '@/services/coupon-management/coupon-audit';
import styles from './style.less'

export default props=>{
    const {id,turnVisible,setTurnVisible}=props
    const columns3= [
        {
          title: '审核时间',
          dataIndex: 'createTime',
          valueType: 'text',
        },
        {
          title: '审核人员',
          dataIndex: 'adminName',
          valueType: 'text',
        },
        {
          title: '审核结果',
          dataIndex: 'status',
          valueType: 'select',
          valueEnum: {
            3: '审核驳回',
            4: '审核通过',
          },
        },
        {
          title: '审核意见',
          dataIndex: 'content',
          valueType: 'text',
          render:(_,data)=>{
            return <pre className={styles.line_feed}>{_}</pre>
          }
        },
      ];
     
    return (
        <ModalForm
            title="审核详情"
            key={id}
            onVisibleChange={setTurnVisible}
            visible={turnVisible}
            submitter={{
            render: (props, defaultDoms) => {
                return [
                ...defaultDoms
                ];
            },
            }}
            onFinish={async (values) => {
              setTurnVisible(false)
            }}
        >
          <ProTable
            rowKey="id"
            options={false}
            params={{
              id:id
            }}
            request={couponVerifyList}
            search={false}
            columns={columns3}
          />
      </ModalForm>
    )
}

