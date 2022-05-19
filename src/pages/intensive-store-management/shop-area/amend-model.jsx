import React, { useState, useEffect,useRef } from 'react';
import { message } from 'antd';
import { ModalForm} from '@ant-design/pro-form';
import { editApplicableAreaDeposit } from '@/services/intensive-store-management/shop-area'
import { ExclamationCircleFilled } from '@ant-design/icons';

export default props=>{
    const {earnestMoney,visible,setVisible,callback,onClose}=props
    return (
        <ModalForm
            title={
                <>
                <ExclamationCircleFilled style={{color:'#FBB936'}}/>
                <span> 确认要将{earnestMoney.data?.provinceName}{earnestMoney.data?.cityName}{earnestMoney.data?.regionName}社区店的入驻保证金调整为{earnestMoney.deposit||earnestMoney.data?.deposit}元么？</span>
                </>
            }
            key="model2"
            onVisibleChange={setVisible}
            visible={visible}
            modalProps={{
              forceRender: true,
              destroyOnClose: true,
              onCancel: () => {
                onClose();
              }
            }}
            submitter={{
              searchConfig: {
                submitText: '继续',
                resetText: '取消',
              },
            }}
            onFinish={async (values) => {
              const params={
                deposit_list:[
                  {
                    provinceId:earnestMoney.data?.provinceId,
                    cityId:earnestMoney.data?.cityId,
                    regionId:earnestMoney.data?.regionId,
                    deposit:earnestMoney.deposit||earnestMoney.data?.deposit
                  }
                ]
              }
              editApplicableAreaDeposit(params).then((res) => {
                        if (res.code === 0) {
                          message.success(`设置保证金成功！`);
                          setVisible(false)
                          callback(true)
                        }
                      })
            }
               
            }
        >
          <p><span style={{color:'red'}}>修改后入驻店铺需缴纳{earnestMoney.deposit||earnestMoney.data?.deposit}元</span>，你还要继续吗？</p>
    </ModalForm>
    )
}


