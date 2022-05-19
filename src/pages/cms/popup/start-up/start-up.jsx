import React, { useRef, useEffect, useState } from 'react';
import { Button, Form, message } from 'antd';
import { PageContainer } from '@/components/PageContainer';
import ProCard from '@ant-design/pro-card';
import Upload from '@/components/upload';
import ProForm, { ProFormText, ProFormDigit, ProFormRadio } from '@ant-design/pro-form';
import { getStartUp, homePopupUpdate } from '@/services/cms/member/member';

const HomePopup = () => {
  const [form] = Form.useForm();
  const formRef = useRef();
  const [popupInfo, setPopupInfo] = useState(false);

  useEffect(() => {
    if (!popupInfo) {
      getStartUp().then((res) => {
        if (res.code === 0 && res.data) {
          const { img, link, status, stayTime, id } = res.data
          form.setFieldsValue({
            stayTime,
            img,
            link,
            status,
            id,
          })
        }
      })
    }
  }, [])

  const submit = (param) => {
    homePopupUpdate(param).then(res => {
      if (res.code === 0) {
        message.success('保存成功');
      }
    })
  }
  return (
    <PageContainer
      header={{
        title: null,
        ghost: true,
      }}
      footer={[
        <Button key="1" type="primary" onClick={form.submit}>
          保存
        </Button>,
      ]}
    >
      <ProForm
        formRef={formRef}
        form={form}
        onFinish={
          (res) => {
            console.log('submit', res)
            const { id, img, link, status, stayTime } = res
            const param = {
              id,
              img,
              link,
              status,
              stayTime
            }
            submit(param)
          }
        }
        submitter={{
          resetButtonProps: {
            style: {
              display: 'none',
            },
          },
          submitButtonProps: {
            style: {
              display: 'none',
            },
          },
        }}
      >
        <ProCard direction="column" ghost gutter={[0, 16]}>
          <ProCard style={{ marginTop: 8 }} gutter={8} title="">
            <ProCard
              colSpan={{
                xs: '50px',
                sm: '100px',
                md: '200px',
                lg: '300px',
                xl: '400px',
              }}
              layout="center"
              bordered
            >
              <Form.Item
                label="添加图片"
                name="img"
                required
                rules={
                  [{
                    required: true,
                    message: '请上传图片'
                  }]
                }
                tooltip={
                  <dl>
                    <dt>图片要求</dt>
                    <dd>尺寸-375*812</dd>
                    <dd>大小-5MB以内</dd>
                    <dd>格式-png/jpg/gif</dd>
                  </dl>
                }
              >
                <Upload multiple maxCount={1} size={5120} proportion={{ width: 375, height: 812, }} />
                {/* <Upload multiple maxCount={1} /> */}
              </Form.Item>
            </ProCard>

            <ProCard layout="" bordered>
              <ProForm.Group>
                <ProFormDigit
                  name="stayTime"
                  label="停留时间(秒)"
                  rules={[{ required: true, message: '请输入1-15之间的停留秒数 整数' }]}
                  placeholder="请输入1-15之间的停留秒数 整数"
                />
              </ProForm.Group>
              <ProForm.Group>
                <ProFormText
                  name="link"
                  label="跳转链接"
                  placeholder="请输入点击弹窗跳转的链接地址，不超过80个字符"
                  rules={[
                    () => ({
                      required: false,
                      validator(_, value) {
                        if (/\s/g.test(value)) {
                          return Promise.reject(new Error('链接不能包含空格'));
                        }
                        return Promise.resolve();
                      },
                    })
                  ]}
                />
              </ProForm.Group>
              <ProFormRadio.Group
                name="status"
                label="状态"
                initialValue={0}
                rules={[{ required: true, message: '请选择状态' }]}
                options={[
                  {
                    label: '开启',
                    value: 1,
                  },
                  {
                    label: '关闭',
                    value: 2,
                  },
                ]}
              />

              <ProForm.Group>
                开启后才会在用户端显示
              </ProForm.Group>
              <ProFormText
                name="id"
                label="id"
                hidden
              />
            </ProCard>
          </ProCard>
        </ProCard>
      </ProForm>

    </PageContainer>
  )
}

export default HomePopup
