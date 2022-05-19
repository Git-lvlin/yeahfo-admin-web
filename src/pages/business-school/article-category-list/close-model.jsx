import React, { useState, useEffect,useRef } from 'react';
import { Input, Form, Divider, message, Button,List, Space,Avatar } from 'antd';
import { ModalForm} from '@ant-design/pro-form';
import { saveOrUpdateArticleType,articleTypeAdd } from '@/services/business-school/save-or-update-article-type';
import { articleTop } from '@/services/cms/member/member';

export default props=>{
    const {formControl,boxref,visible,setVisible}=props
    return (
        <ModalForm
            title={
                formControl.top?formControl.isTop?
                '确认要取消置顶么？'
                :'确认置顶么？'
                :formControl.isShow?
                '确认关闭么？'
                :'确认开启么？'
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

                if(formControl.hide){
                    saveOrUpdateArticleType({id: formControl.id, isShow: !formControl.isShow}).then((res) => {
                        if (res.code === 0) {
                          message.success(`操作成功`);
                          boxref.current.reset();
                          setVisible(false)
                        }
                      })
                }else{
                  articleTypeAdd({ id: formControl.id,isTop: !formControl.isTop}).then((res) => {
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
                 formControl.top?formControl.isTop?
                 <p><span style={{color:'red'}}>取消后无法优先排序展示</span>，你还要继续吗？</p>
                 :<p><span style={{color:'red'}}>置顶后将优先排序展示</span>，你还要继续吗？</p>
                 :formControl.isShow?
                 <p><span style={{color:'red'}}>关闭后用户端不再展示此分类及其下文章</span>，你还要继续吗？</p>
                 :<p><span style={{color:'red'}}>开启后分类及其下文章都会在用户端展示</span>，你还要继续吗？</p>
            }
    </ModalForm>
    )
}


