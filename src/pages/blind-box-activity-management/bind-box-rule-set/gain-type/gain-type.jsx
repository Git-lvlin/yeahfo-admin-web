import React, { useState } from 'react';
import styles from '../style.less'
import { Button } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import ProForm, { ProFormText, ProFormSelect,ProFormRadio,ProFormDependency,ProFormDigit,ModalForm } from '@ant-design/pro-form';
import Big from 'big.js'

export default (props) => {
    const {id,falg}=props
    const [visible, setVisible] = useState(false);
    const checkConfirm=(rule, value, callback)=>{
        return new Promise(async (resolve, reject) => {
        if (value&&value.length>0&&!/^[0-9]*[1-9][0-9]*$/.test(value)&&value!=0) {
            await reject('只能输入整数')
        } else {
            await resolve()
        }
        })
    }
    return (
        <>
            <ProFormText
                width={120}
                label={<><span style={{color:'#FF7E7E',fontSize:'20px',marginTop:'5px'}}>*&nbsp;</span>开盲盒机会获取途径</>}
                readonly
                fieldProps={{
                    value:<a style={{color:'#000',fontWeight:'bolder'}} onClick={()=>setVisible(true)}><QuestionCircleOutlined /></a>
                 }}
            />
            <ProFormRadio.Group
                name="switch1"
                label='1、邀请好友'
                options={[
                    {
                        label:'开启',
                        value: 1,
                    },
                    {
                        label: '关闭',
                        value: 0,
                    }
                ]}
                readonly={id&&falg}
                rules={[{ required: true, message: '请设置邀请状态' }]}
            />
            <ProFormDependency name={['switch1']}>
                {({ switch1 }) => { 
                    return  <div className={styles.unfold}>
                                <ProFormSelect
                                    name="inviteNum"
                                    initialValue={1}
                                    options={[
                                        {
                                            value: 1,
                                            label: '每邀请1位新用户注册获得1次',
                                        },
                                        {
                                            value: 2,
                                            label: '每邀请2位新用户注册获得1次',
                                        },
                                        {
                                            value: 3,
                                            label: '每邀请3位新用户注册获得1次',
                                        },
                                        {
                                            value: 4,
                                            label: '每邀请4位新用户注册获得1次',
                                        },
                                        {
                                            value: 5,
                                            label: '每邀请5位新用户注册获得1次',
                                        },
                                        {
                                            value: 8,
                                            label: '每邀请8位新用户注册获得1次',
                                        },
                                        {
                                            value: 10,
                                            label: '每邀请10位新用户注册获得1次',
                                        }
                                    ]}
                                    readonly={id}
                                />
                                <ProForm.Group>
                                <span>此任务每天最高可获得</span>
                                <ProFormText
                                    name="dayGainMax"
                                    readonly={id}
                                    rules={[
                                        {validator: checkConfirm},
                                        { required: true, message: '请设置获得次数' }
                                    ]}
                                />
                                <span>次</span>
                                </ProForm.Group>
                                <ProForm.Group>
                                    <span>中奖概率</span>
                                    <ProFormDigit
                                        name="probability1"
                                        fieldProps={{
                                            formatter: value => value ? +new Big(value).toFixed(2) : value
                                        }}
                                        min={1}
                                        max={100}
                                        rules={[
                                            { required: true, message: '请设置中奖概率' }
                                        ]}
                                        readonly={id&&falg}
                                    />
                                    <span>%，大于等于0，小于100的最多两位小数，必填。</span>
                                </ProForm.Group>
                            </div>
              }}
            </ProFormDependency>
            <ProFormRadio.Group
                name="switch2"
                label='2、每日签到'
                options={[
                    {
                        label:'开启',
                        value: 1,
                    },
                    {
                        label: '关闭',
                        value: 0,
                    }
                ]}
                readonly={id&&falg}
                rules={[{ required: true, message: '请设置签到状态' }]}
            />
            <ProFormDependency name={['switch2']}>
                {({ switch2 }) => { 
                    return  <div className={styles.unfold}>
                                <ProFormSelect
                                    name="signInNum"
                                    initialValue={2}
                                    options={[
                                        {
                                            value: 2,
                                            label: '每连续签到2天获得1次',
                                        },
                                        {
                                            value: 3,
                                            label: '每连续签到3天获得1次',
                                        },
                                        {
                                            value: 4,
                                            label: '每连续签到4天获得1次',
                                        },
                                        {
                                            value: 5,
                                            label: '每连续签到5天获得1次',
                                        },
                                        {
                                            value: 7,
                                            label: '每连续签到7天获得1次',
                                        },
                                        {
                                            value: 15,
                                            label: '每连续签到15天获得1次',
                                        }
                                    ]}
                                    readonly={id}
                                />
                                <ProForm.Group>
                                    <span>中奖概率</span>
                                    <ProFormDigit
                                        name="probability2"
                                        min={1}
                                        max={100}
                                        rules={[
                                            { required: true, message: '请设置中奖概率' }
                                        ]}
                                        fieldProps={{
                                            formatter: value => value ? +new Big(value).toFixed(2) : value
                                        }}
                                        readonly={id&&falg}
                                    />
                                    <span>%，大于等于0，小于100的最多两位小数，必填。</span>
                                </ProForm.Group>
                            </div>
              }}
            </ProFormDependency>
            <ProFormRadio.Group
                name="switch3"
                label='3、订单消费'
                options={[
                    {
                        label:'开启',
                        value: 1,
                    },
                    {
                        label: '关闭',
                        value: 0,
                    }
                ]}
                readonly={id&&falg}
                rules={[{ required: true, message: '请设置订单消费状态' }]}
            />
            <ProFormDependency name={['switch3']}>
                {({ switch3 }) => { 
                    return  <div className={styles.unfold}>
                                <ProFormSelect
                                    name="consumeNum"
                                    initialValue={1}
                                    options={[
                                        {
                                            value: 1,
                                            label: '每日首次消费1笔获得1次',
                                        },
                                        {
                                            value: 2,
                                            label: '每日首次消费2笔获得1次',
                                        },
                                        {
                                            value: 3,
                                            label: '每日首次消费3笔获得1次',
                                        },
                                        {
                                            value: 4,
                                            label: '每日首次消费4笔获得1次',
                                        },
                                        {
                                            value: 5,
                                            label: '每日首次消费5笔获得1次',
                                        }
                                    ]}
                                    readonly={id}
                                />
                                <ProForm.Group>
                                    <span>中奖概率</span>
                                    <ProFormDigit
                                        name="probability3"
                                        min={1}
                                        max={100}
                                        rules={[
                                            { required: true, message: '请设置中奖概率' }
                                        ]}
                                        readonly={id&&falg}
                                        fieldProps={{
                                            formatter: value => value ? +new Big(value).toFixed(2) : value
                                        }}
                                    />
                                    <span>%，大于等于0，小于100的最多两位小数，必填。</span>
                                </ProForm.Group>
                            </div>
              }}
            </ProFormDependency>

            <ProFormRadio.Group
                name="switch4"
                label='4、社区店主消费'
                options={[
                    {
                        label:'开启',
                        value: 1,
                    },
                    {
                        label: '关闭',
                        value: 0,
                    }
                ]}
                readonly={id&&falg}
                rules={[{ required: true, message: '请设置社区店主消费状态' }]}
            />
            <ProFormDependency name={['switch4']}>
                {({ switch4 }) => { 
                    return  <div className={styles.unfold}>
                                <ProFormSelect
                                    name="consumeNum2"
                                    initialValue={30}
                                    options={[
                                        {
                                            value: 30,
                                            label: '每日采购1笔大于等于30元的订单，获得1次机会',
                                        },
                                        {
                                            value: 50,
                                            label: '每日采购1笔大于等于50元的订单，获得1次机会',
                                        },
                                        {
                                            value: 80,
                                            label: '每日采购1笔大于等于80元的订单，获得1次机会',
                                        },
                                        {
                                            value: 100,
                                            label: '每日采购1笔大于等于100元的订单，获得1次机会',
                                        },
                                        {
                                            value: 300,
                                            label: '每日采购1笔大于等于300元的订单，获得1次机会',
                                        },
                                        {
                                            value: 500,
                                            label: '每日采购1笔大于等于500元的订单，获得1次机会',
                                        }
                                    ]}
                                    readonly={id}
                                />
                                <ProForm.Group>
                                    <span>中奖概率</span>
                                    <ProFormDigit
                                        name="probability4"
                                        min={1}
                                        max={100}
                                        rules={[
                                            { required: true, message: '请设置中奖概率' }
                                        ]}
                                        fieldProps={{
                                            formatter: value => value ? +new Big(value).toFixed(2) : value
                                        }}
                                        readonly={id&&falg}
                                    />
                                    <span>%，大于等于0，小于100的最多两位小数，必填。</span>
                                </ProForm.Group>
                                <ProForm.Group>
                                    <span>此任务每天最高可获得</span>
                                    <ProFormText
                                        name="dayMaxNum"
                                        readonly={id}
                                        rules={[
                                            {validator: checkConfirm},
                                            { required: true, message: '请设置获得次数' }
                                        ]}
                                    />
                                    <span>次</span>
                                </ProForm.Group>
                            </div>
              }}
            </ProFormDependency>

            {
                visible&&<ModalForm
                    key="model2"
                    onVisibleChange={setVisible}
                    visible={visible}
                    submitter={{
                    render: (props, defaultDoms) => {
                        return [
                            <Button  type="primary" key="submit" onClick={() => {
                                props.form?.submit?.()
                            }}>
                                知道了
                            </Button>
                        ];
                    },
                    }}
                    onFinish={async (values) => {
                        setVisible(false)   
                        return true;
                    }}
                >
                <dl>
                    <dt>概率解释：</dt>
                    <dd>1、此概率为单用户当前途径获取的抽奖机会的抽奖概率，用来控制用户是否”中奖”，如果“未中奖”会直接提示用户”未中奖”，如果这里”已中奖”，则去判断每天中奖次数是否大于等于设置的最高次数，如果是则提示用户未中奖，如果小于最高次数，则从下方奖品库中根据填写的商品概率随机挑选商品。如果选中商品，则提示用户”中奖”，如果没有商品可挑，则提示用户”未中奖”。</dd>
                    <dd>2、下方奖品设置列表中的商品中奖概率总和加起来必须等于100，如果抽中奖品库存为0的商品也会提示用户未中奖。</dd>
                    <dd>3、示例：中奖概率设为20%;则抽奖盒子里有100个纸条，其中有20个写着中奖，80个写着未中奖，随机在这100个纸条里面抽取一个纸条，抽中 未中奖 的纸条则提示用户未中奖，抽中 中奖 的纸条且在今日总中奖次数没有超过设置的次数的情况下会去奖品库根据概率挑选奖品。</dd>
                </dl>
            </ModalForm>
            }
            
        </>
    )
}