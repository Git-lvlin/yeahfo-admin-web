import React, { useState} from 'react';
import ProForm,{ ModalForm} from '@ant-design/pro-form';
import { Input,Form,message } from 'antd';
import { couponAddQuantity } from '@/services/coupon-management/coupon-add-quantity';
import styles from './style.less'

export default props=>{
    const {data,boxref}=props
    const [byid,setByid]=useState()
    const [visible, setVisible] = useState(false);
    const [discounts,setDiscounts]=useState('');
    const [records,setRecords]=useState(0)
    //增发
    const Additional=(data)=>{
        setByid(data.id)
        setRecords(data.issueQuantity)
        setVisible(true)
    }
    const onDiscounts=e=>{
        setDiscounts(e.target.value)
    }

    return (
        <ModalForm
            title="增发红包"
            key={data.id}
            onVisibleChange={setVisible}
            visible={visible}
            trigger={data.couponStatus==3||data.couponStatus==4?null:<a onClick={()=>Additional(data)}>增发</a>}
            submitter={{
            render: (props, defaultDoms) => {
                return [
                ...defaultDoms
                ];
            },
            }}
            onFinish={async (values) => { 
            couponAddQuantity({id:byid,issueQuantity:values.issueQuantity}).then(res=>{
            if(res.code==0){
                setVisible(false)
                boxref.current.reload();
                message.success('增加成功');
                return true;
            }
            })
            }}
        >
        <p>当前总发行量：<span>{records}</span> 张</p>
        <ProForm.Group>
            <Form.Item  name="issueQuantity" label="新增发行量">
                <Input  onChange={onDiscounts} value={discounts} className={styles.circulation}/>    
            </Form.Item>
            <span>张</span>
            </ProForm.Group>
        <p>更新后总发行量:<span className={styles.upCirculation}>{discounts&&parseInt(discounts)+records}</span>张</p>
    </ModalForm>
    )
}

