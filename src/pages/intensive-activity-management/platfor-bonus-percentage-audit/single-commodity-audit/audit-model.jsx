import React, { useEffect } from 'react';
import { Form } from 'antd';
import ProForm, {
  ProFormTextArea,
  ProFormRadio,
  ProFormText,
  ProFormDependency,
  ModalForm
} from '@ant-design/pro-form';
import { skuPercentAudit } from '@/services/intensive-activity-management/platfor-bonus-percentage-audit'
import styles from './style.less'
import { amountTransform } from '@/utils/utils'

const formItemLayout = {
    labelCol: { span:5 },
    wrapperCol: { span: 14 },
    layout: {
      labelCol: {
        span: 10,
      },
      wrapperCol: {
        span: 14,
      },
    }
  };

export default (props) => {
  const { visible, setVisible, callback,formDetail,onClose} = props;
  const checkConfirm = (rule, value, callback) => {
    return new Promise(async (resolve, reject) => {
      if (value && value.length < 5) {
        await reject('最小长度为5')
      } else if (value&&/[%&'=?$\x22]/.test(value)) {
        await reject('不可以含')
      } else {
        await resolve()
      }
    })
  }
  return (
    <ModalForm
      title={`请确认审核平台额外奖励占比设置  （商品名称：${formDetail?.goodsName}；商品分类：${formDetail?.gcName}）`}
      onVisibleChange={setVisible}
      visible={visible}
      width={1000}
      modalProps={{
        forceRender: true,
        destroyOnClose: true,
        onCancel: () => {
          onClose();
        }
      }}
      submitter={{
        render: (props, defaultDoms) => {
            return [
            ...defaultDoms
            ];
        },
        }}
        onFinish={async (values) => {
          const params={
            id:formDetail?.id,
            storeAuditPercent:formDetail?.storeAuditPercent,
            ladderSubsidyModify:values.type==1&&formDetail?.ladderSubsidyModify,
            ...values
          }
          skuPercentAudit(params).then(res=>{
            if(res.code==0){
              setVisible(false)
              callback(true)
            }
          })
        }}
      className={styles.audit_model}
      {...formItemLayout}
    >
      {
        formDetail?.ladderSubsidyModify.map(ele=>{
          return <ProFormText
                    width={250}
                    label={<p>最低量 <span style={{color:'#2744FD'}}>{ele?.wsStart}{formDetail?.unit}</span> 时设置商品的<br/>店主额外奖励占比</p>}
                    name="name"
                    readonly={true}
                    // labelCol={6}
                    fieldProps={{
                        value:<>
                              <p className={styles.percent}>{amountTransform(parseFloat(ele?.storePercent), '*')}%</p>
                              <p>运营中心占平台额外奖励<span className={styles.percent}>{amountTransform(parseFloat(ele?.operationPercent), '*')}%</span></p>
                              </>
                    }}
                />
        })
      }
        <ProFormText
            width={250}
            label={<p>商品现有所属分类的<br/>店主额外奖励占比</p>}
            name="name"
            readonly={true}
            // labelCol={5}
            fieldProps={{
                value:<>
                       <p className={styles.award}>{amountTransform(parseFloat(formDetail?.storePercent), '*')}%</p>
                       <p>运营中心占平台额外奖励<span className={styles.award}>{amountTransform(parseFloat(formDetail?.operationPercent), '*')}%</span></p>
                      </>
            }}
        />
         <ProFormRadio.Group
                name="type"
                label='审核结果'
                rules={[{ required: true, message: '请审核' }]}
                options={[
                    {
                        label:'通过',
                        value: 1,
                    },
                    {
                        label: '拒绝',
                        value: 2,
                    },
                ]}
            />
         <ProFormDependency name={['type']}>
                {({ type }) => { 
                if(type==1) return null
                if(type==2){
                    return   <ProFormTextArea
                                label='拒绝理由'
                                name="rejectionReason"
                                style={{ minHeight: 32, marginTop: 15 }}
                                placeholder='请输入拒绝理由 5-200个字以内 汉字、大小字母和常见标点符号'
                                rules={[
                                  { required: true, message: '请输入拒绝理由' },
                                  { validator: checkConfirm }
                                ]}
                                rows={4}
                                fieldProps={{
                                    maxLength:200
                                }}
                            />
                }
              }}
            </ProFormDependency>
    </ModalForm >
  );
};