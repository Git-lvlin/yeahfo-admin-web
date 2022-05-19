import React, { useState} from 'react';
import { ModalForm} from '@ant-design/pro-form';
import { couponEnd } from '@/services/coupon-management/coupon-end';

export default props=>{
    const {data,boxref,type}=props
    const [endid,setEndid]=useState()
    const [visible, setVisible] = useState(false);
    //终止
    const Termination=(data)=>{
        setEndid(data.id)
        setVisible(true)
    }
    return (
        <ModalForm
          title="操作提示"
          key={data.id}
          onVisibleChange={setVisible}
          visible={visible}
          trigger={data.couponStatus==3||data.couponStatus==4?null:<a onClick={()=>Termination(data)}>{type==4?'终止':null}</a>}
          submitter={{
          render: (props, defaultDoms) => {
              return [
              ...defaultDoms
              ];
          },
          }}
          onFinish={async (values) => {
          couponEnd({id:endid}).then(res=>{
            if(res.code==0){
              boxref.current.reload();
              setVisible(false)
              return true;
            }
          })
        
          }}
      >
        <p>确定要终止所选红包活动吗？</p>
      </ModalForm>
    )
}

