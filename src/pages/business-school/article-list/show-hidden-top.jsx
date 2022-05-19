import React, { useState, useEffect,useRef } from 'react';
import { Input, Form, Divider, message, Button,List, Space,Avatar } from 'antd';
import { ModalForm} from '@ant-design/pro-form';
import { findAdminArticleTypeList,articleTop,articleOperation } from '@/services/cms/member/member';

export default props=>{
    const {showHideTop,boxref,visible,setVisible}=props
    return (
        <ModalForm
            title={
                showHideTop.top?showHideTop.isTop?
                '确认要取消置顶么？'
                :'确认置顶么？'
                :showHideTop.isShow?
                '确认隐藏么？'
                :'确认显示么？'
            }
            key="model2"
            onVisibleChange={setVisible}
            visible={visible}
            submitter={{
            render: (props, defaultDoms) => {
                return [
                ...defaultDoms
                ];
            },
            }}
            onFinish={async (values) => {
                if(showHideTop.hide){
                      articleTop({id: showHideTop.id,isShow: !showHideTop.isShow}).then((res) => {
                        if (res.code === 0) {
                          message.success(`操作成功`);
                          boxref.current.reset();
                          setVisible(false)
                        }
                      })
                }else{
                      articleTop({ id: showHideTop.id,isTop: !showHideTop.isTop}).then((res) => {
                        if (res.code === 0) {
                          message.success(`操作成功`);
                          boxref.current.reset();
                          setVisible(false)
                        }
                      })
                }
                }
               
            }
        >
            {
                 showHideTop.top?showHideTop.isTop?
                 <p><span style={{color:'red'}}>取消后无法优先排序展示</span>，你还要继续吗？</p>
                 :<p><span style={{color:'red'}}>置顶后将优先排序展示</span>，你还要继续吗？</p>
                 :showHideTop.isShow?
                 <p><span style={{color:'red'}}>关闭后店主无法查看</span>，你还要继续吗？</p>
                 :<p><span style={{color:'red'}}>开启后店主即可查看</span>，你还要继续吗？</p>
            }
    </ModalForm>
    )
}

