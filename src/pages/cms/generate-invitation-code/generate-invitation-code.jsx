
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
            message.error('?????????')
            break
          case 1:
            message.error('???????????????')
            break
          case 2:
            message.success('????????????,?????????????????????????????????')
            window.open(data.fileUrl, "_blank");
            setTimeout(() => {
              init()
            }, 3000);
            break
          case 3:
            message.error('????????????')
            break
        }
      })
    } else {
      message.error('????????????taskId')
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
              message.success('????????????');
            }}
          >
              <ProFormText
                width="md"
                name="number"
                label="???????????????"
                tooltip="?????????????????????????????????"
                placeholder="??????????????????????????????????????????"
              />
              <ProFormTextArea
                name="mobiles"
                label="?????????"
                tooltip="???????????????????????????"
                placeholder="??????????????????"
                // fieldProps={inputTextAreaProps}
              />
          </ProForm>
        </Spin>}
        {upDataIsOk&&<Button onClick={() => {
          upData()
        }}>??????</Button>}
      </ProCard>
    </PageContainer>
  );
};


export default GenerateInvitationCode