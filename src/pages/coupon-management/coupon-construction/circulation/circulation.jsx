import React, { useState,useEffect} from 'react';
import {FormattedMessage,connect} from 'umi';
import styles from '../style.less'
import { Space } from 'antd';
import ProForm,{ProFormText,ProFormRadio,ProFormDependency} from '@ant-design/pro-form';
import { amountTransform } from '@/utils/utils'

const circulation=props=>{
    const { DetailList,face1,face3,most,id,pcType}=props
    const [summoney,setSummoney] = useState(0);
    const sumMoney=e=>{
        setSummoney(e.target.value)
    }
    const checkConfirm=(rule, value, callback)=>{
        return new Promise(async (resolve, reject) => {
        if (value&&value.length>0&&!/^[0-9]*[1-9][0-9]*$/.test(value)&&value!=0) {
            await reject('不能输入小数')
        } else {
            await resolve()
        }
        })
    }
    const options=[
        {
            label:'按总数量发行',
            value: 2,
        },
        // {
        //     label:'不限制',
        //     value: -1,
        // }
    ]
    return(
        <>
         <ProFormRadio.Group
                name="issueQuantityType"
                label='发行量'
                options={options}
                rules={[{ required: true, message: '请选择发行量' }]}
            />
              <ProFormDependency name={['issueQuantityType']}>
              {({ issueQuantityType }) => {
                  if(issueQuantityType==1) return null 
                  if(issueQuantityType==2){
                    return <div className={styles.unfold}>
                            <Space>
                                <ProFormText 
                                    name="issueQuantity"
                                    fieldProps={{
                                        onChange: (e) => sumMoney(e),
                                        }}
                                    placeholder="请输入拟发行的总数量"
                                    rules={[
                                        {validator: checkConfirm}
                                    ]} 
                                />
                                <span>张</span>
                            </Space>
                            <p>
                                红包发行总金额为
                                <span className={styles.compute }>
                                    {
                                        pcType==1&&summoney*amountTransform(Number(face1),'*')/100||
                                        pcType==3&&summoney*amountTransform(Number(face3),'*')/100||
                                        pcType==2&&summoney*amountTransform(Number(most),'*')/100||
                                        (parseInt(id)==id)&&DetailList.data?.issueQuantity*amountTransform(Number(face1),'*')/100||
                                        (parseInt(id)==id)&&DetailList.data?.issueQuantity*amountTransform(Number(face3),'*')/100||
                                        (parseInt(id)==id)&&DetailList.data?.issueQuantity*amountTransform(Number(DetailList.data?.freeAmount),'*')/100||
                                        (parseInt(id)==id)&&DetailList.data?.issueQuantity*amountTransform(Number(most),'*')/100||
                                        (parseInt(id)==id)&&DetailList.data?.issueQuantity*amountTransform(Number(DetailList.data?.maxFreeAmount),'*')/100
                                    }
                                </span>
                                元
                            </p>
                        </div>
                  }
              }}
              </ProFormDependency>
        </>
    )
}

export default connect(({ DetailList}) => ({
    DetailList,
  }))(circulation);
  