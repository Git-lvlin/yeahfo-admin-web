import React, { useRef, useEffect } from 'react';
import { message, Form } from 'antd';
import ProForm, {
  ModalForm,
  ProFormText,
  ProFormRadio,
  ProFormDependency
} from '@ant-design/pro-form';
import Upload from '@/components/upload';
import { posterUpdata } from '@/services/cms/member/member';

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
  layout: {
    labelCol: {
      span: 4,
    },
    wrapperCol: {
      span: 14,
    },
  }
};

const FromWrap = ({ value, onChange, content, right }) => (
  <div style={{ display: 'flex' }}>
    <div>{content(value, onChange)}</div>
    {/* <div style={{ flex: 1, marginLeft: 10, minWidth: 180 }}>{right(value)}</div> */}
  </div>
)

export default (props) => {
  const { detailData, setVisible, onClose, visible, refresh, setRefresh, type } = props;
  const formRef = useRef();
  const [form] = Form.useForm();

  const waitTime = (values) => {
    const { image, ...rest } = values
    const param = {
      ...rest,
      image: image,
      type: type,
      version: 3,
      bgImage: {
        url: image,
        width: 375,
        height: 667,
        relativeX: 34,
        relativeY: 162,
      },
      compositeXY: {
        relativeX: 223,
        relativeY: 583,
        qrcodeWidth: 65,
        qrcodeHeight: 65,
      },
    }

    return new Promise((resolve, reject) => {
      posterUpdata(param).then((res) => {
        if (res.code === 0) {
          setRefresh(!refresh);
          resolve(true);
        } else {
          reject();
        }
      })

    });
  };

  useEffect(() => {
    if (detailData) {
      const { ...rest } = detailData;
      form.setFieldsValue({
        ...rest
      })
    }
  }, [form, detailData])

  return (
    <ModalForm
      title={'上传'}
      onVisibleChange={setVisible}
      formRef={formRef}
      visible={visible}
      form={form}
      modalProps={{
        forceRender: true,
        destroyOnClose: true,
        onClose: () => {
          onClose();
        }
      }}
      onFinish={async (values) => {
        await waitTime(values);
        message.success('提交成功');
        // 不返回不会关闭弹框
        return true;
      }}
      {...formItemLayout}
    >
      <ProFormText
        name="title"
        label="海报名称"
        placeholder={'请输入海报名称，长度3-8个汉字、字母或数字'}
        rules={[{ required: true, message: '请输入海报名称，长度3-8个汉字、字母或数字' }]}
        fieldProps={{
          maxLength: 8,
          minLength: 3,
        }}
      />
      <ProFormText
        name="sort"
        label="展示序号"
        placeholder={'请输入在用户端的展示序号，升序展示，正整数'}
        rules={[{ required: true, message: '请输入在用户端的展示序号，升序展示，正整数' }]}
      />
      {/* <ProFormText
        name="amount"
        label="赠送新人红包金额"
        placeholder={'请输入新人红包金额，0-999整数'}
        fieldProps={{
          maxLength: 3,
        }}
        rules={[
          () => ({
            validator(_, value) {
              if (!value) {
                return Promise.resolve();
              }

              if (!/^\d+$/g.test(value) || value > 999) {
                return Promise.reject(new Error(`请输入0-999之间的整数`));
              }
              return Promise.resolve();
            },
          })
        ]}
      /> */}
      <Form.Item
        label="上传海报"
        name="image"
        required
        rules={
          [{
            required: true,
            message: '请上传海报图片'
          }]
        }
      >
        <FromWrap
          content={(value, onChange) => {
            return <>
              <div style={{ display: 'flex' }}>
                <div style={{ width: 105 }}>
                  <Upload value={value} onChange={onChange} accept=".png, .jpg, .jpeg" proportion={{ width: 750, height: 1334 }} size={2 * 1024} />
                </div>
                <dl style={{ marginLeft: 10 }}>
                  <dd>图片要求</dd>
                  <dd>大小：不超过2MB</dd>
                  <dd>尺寸：750px*1334px</dd>
                  <dd>格式：png/jpg</dd>
                </dl>
              </div>
              <div style={{ display: 'flex' }}>
                <div>
                  <div>上传图片示例:</div>
                  <img src="http://dev-yeahgo.oss-cn-shenzhen.aliyuncs.com/goods/base/rc-upload-1639472285083-3-y_g-8172a6bc-c57a-40f1-acc2-302da71ff5e0.png?imgHeight=2001&imgWidth=1125" width={150} />
                </div>
                <ProFormDependency name={['image', 'amount']}>
                  {
                    ({ image, amount }) => {
                      return (
                        <>
                          {image && <div style={{ marginLeft: 30 }}>
                            <div>预览:</div>
                            <div style={{ position: 'relative' }}>
                              <div
                                // style={{
                                //   background: '#FFFFFF',
                                //   borderRadius: '0px 0px 16px 16px',
                                //   border: '1px solid #D04437',
                                //   position: 'absolute',
                                //   top: 0,
                                //   left: '50%',
                                //   transform: 'translateX(-50%) scale(0.2)',
                                //   width: 212,
                                //   height: 86,
                                //   display: 'flex',
                                //   justifyContent: 'center',
                                //   alignItems: 'center',
                                //   transformOrigin: 'center 0',
                                // }}
                              >
                                {/* <img width="146" src="https://dev-yeahgo.oss-cn-shenzhen.aliyuncs.com/admin/logo.png" /> */}
                              </div>
                              <img src={image} width={150} />
                              {/* <div style={{ width: 150, backgroundColor: '#fff', height: 42 }}>
                                <div
                                  style={{
                                    width: 750,
                                    backgroundColor: '#fff',
                                    height: 212,
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    transform: 'scale(0.2)',
                                    transformOrigin: '0 0',
                                  }}>
                                  <img style={{ marginRight: 26 }} width="330" src="https://dev-yeahgo.oss-cn-shenzhen.aliyuncs.com/admin/title.png" />
                                  <div style={{ width: 2, height: 96, background: '#D04437', marginRight: 26 }}></div>
                                  <img style={{ marginRight: 26 }} width="96" src="https://dev-yeahgo.oss-cn-shenzhen.aliyuncs.com/admin/code.png" />
                                  {amount > 0 && <div style={{ fontSize: 22, textAlign: 'right' }}>
                                    <div>注册即送</div>
                                    <div><span style={{ color: '#D04437' }}>{amount}</span> 元</div>
                                    <div>新人红包</div>
                                  </div>}
                                </div>
                              </div> */}
                            </div>
                          </div>}
                        </>
                      )
                    }
                  }
                </ProFormDependency>

              </div>
            </>
          }}
        />
      </Form.Item>
      <ProFormRadio.Group
        name="state"
        label="是否上架"
        initialValue={1}
        options={[
          {
            label: '立即上架',
            value: 1,
          },
          {
            label: '暂不上架',
            value: 0,
          },
        ]}
      />
    </ModalForm>
  );
};