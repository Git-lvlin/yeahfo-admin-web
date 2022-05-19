
import React, { useRef, useState, useEffect } from 'react';
import { Button, message, Spin } from 'antd';
import { PageContainer } from '@/components/PageContainer';
import ProCard from '@ant-design/pro-card';
import ProForm, {
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-form';
import { generateSubmit, generateIntData, generateUpdata, getGenerteUrl } from '@/services/cms/member/member';

const GenerateInvitationCode = () => {
  const [loading, setLoading] = useState(false);
  const [upDataIsOk, setUpDataIsOk] = useState(false);
  const [initialData, setInitialData] = useState(null);
  const [taskId, setTaskId] = useState(null);
  // const [fileUrl, setFileUrl] = useState(null);
  const actionRef = useRef();
  const formItemLayout = {
        labelCol: { span: 4 },
        wrapperCol: { span: 14 },
      };
  const waitTime = ({number, mobiles}) => {
    setLoading(true)
    const param = {
      number,
      mobiles
    }
    return new Promise((resolve, reject) => {
      generateSubmit(param).then((res) => {
        console.log('generateSubmit-res', res);
        if (res.code === 0) {
          setInitialData(res.data);
          resolve(true);
        } else {
          reject(false);
        }
      })
    });
  }

  useEffect(() => {
    if (initialData) {
      getInitData(initialData)
    }
  }, [initialData])

  const getInitData = (initialData) => {
    console.log('initialData', initialData)
    const initData = initialData.map(({batchId, mobile}) => {
      return {
        batchId,
        mobile
      }
    })
    const json = {
      batchs: initData
    }
    const batchs = JSON.stringify(json);
    console.log('batchs', batchs)
    const timestamp = new Date().getTime();
    const param = {
      code: 'invitation-code-export',
      fileName: 'invitationCode' + timestamp + '.xlsx',
      queryParamStr: batchs
    }
    generateUpdata(param).then((res) => {
      console.log('generateUpdata-res', res)
      if (res.code === 0) {
        setTaskId(res?.data?.taskId)
        setTimeout(() => {
          setLoading(false)
          setUpDataIsOk(true)
        }, 2000)
      } else {
        setLoading(false)
        message.error(res.msg)
      }
    })
  }

  const init = () => {
    setUpDataIsOk(false)
    setLoading(false)
    setTaskId(null)
    setInitialData(null)
  }

  const upData = () => {
    if (taskId) {
      getGenerteUrl({id: taskId}).then(({data}) => {
        switch(data.state) {
          case 0:
            message.error('未开始')
            break
          case 1:
            message.error('导出处理中')
            break
          case 2:
            message.success('导出成功,点击下载后将回到上一页')
            window.open(data.fileUrl, "_blank");
            setTimeout(() => {
              init()
            }, 3000);
            break
          case 3:
            message.error('导出失败')
            break
        }
      })
    } else {
      message.error('缺少参数taskId')
    }
  }

  return (
    <PageContainer>
      <ProCard>
        {!upDataIsOk&&<Spin spinning={loading}>
          <ProForm
            {...formItemLayout}
            layout={'horizontal'}
            onFinish={async (values) => {
              console.log(values);
              await waitTime(values);
              message.success('提交成功');
            }}
          >
              <ProFormText
                width="md"
                name="number"
                label="内测码个数"
                tooltip="每个号码生成内测码个数"
                placeholder="请输入每个号码生成内测码个数"
              />
              <ProFormTextArea
                name="mobiles"
                label="手机号"
                tooltip="多个号码以逗号隔开"
                placeholder="请输入手机号"
                // fieldProps={inputTextAreaProps}
              />
          </ProForm>
        </Spin>}
        {upDataIsOk&&<Button onClick={() => {
          upData()
        }}>下载</Button>}
      </ProCard>
    </PageContainer>
  );
};


export default GenerateInvitationCode