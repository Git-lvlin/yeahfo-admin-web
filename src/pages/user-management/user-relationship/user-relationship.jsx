
import React, { useRef, useState, useEffect } from 'react';
import { Button, message, Input } from 'antd';
import ProTable from '@ant-design/pro-table';
import ProForm from '@ant-design/pro-form';
import ProCard from '@ant-design/pro-card';
import { PageContainer } from '@/components/PageContainer';
import { userRelationShip, generateUpdata, getGenerteUrl } from '@/services/cms/member/member';
import Export from './export'
import ExportHistory from '@/pages/export-excel/export-history'
const { Search } = Input;
const UserRelationship = () => {
  const actionRef = useRef();
  const [phoneNumber, setPhoneNumber] = useState();
  const [indexData, setIndexData] = useState(false);

  const [loading, setLoading] = useState(false);
  const [upDataIsOk, setUpDataIsOk] = useState(false);
  const [initialData, setInitialData] = useState(null);
  const [taskId, setTaskId] = useState(null);
  const [totalVisit, setTotalVisit] = useState(false)
  // useEffect(() => {
  //   if (phoneNumber) {
  //     getInitData()
  //   }
  // }, [phoneNumber])

  const getInitData = () => {
    console.log('initialData', phoneNumber)
    const json = {
      phoneNumber: phoneNumber
    }
    const batchs = JSON.stringify(json);
    console.log('batchs', batchs)
    const timestamp = new Date().getTime();
    const param = {
      code: 'member-relation-export',
      fileName: 'userRelationship' + timestamp + '.xlsx',
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

  const getFieldValue = () => {
    return {
      phoneNumber: phoneNumber
    }
  }

  // const getEXT = () => {
  //   if (taskId) {
  //     getGenerteUrl({id: taskId}).then(({data}) => {
  //       switch(data.state) {
  //         case 0:
  //           message.error('未开始')
  //           break
  //         case 1:
  //           message.error('导出处理中')
  //           break
  //         case 2:
  //           message.success('导出成功')
  //           // message.success('导出成功,点击下载后将回到上一页')
  //           window.open(data.fileUrl, "_blank");
  //           // setTimeout(() => {
  //           //   init()
  //           // }, 3000);
  //           break
  //         case 3:
  //           message.error('导出失败')
  //           break
  //       }
  //     })
  //   } else {
  //     message.error('缺少参数taskId')
  //   }
  // }

  const columns = [
    {
      title: '用户手机号',
      dataIndex: 'phoneNumber',
      valueType: 'text',
      search: false,
    },
    {
      title: '用户手机号',
      dataIndex: 'subPhoneNumber',
      valueType: 'digit',
      hideInTable: true,
      fieldProps: {
        controls: false,
      },
      render:(_,data)=>{
        return <p>{_}</p>
      }
    },
    {
      title: '用户昵称',
      dataIndex: 'nickName',
      search: false,
    },
    {
      title: '秒约订单数（单）',
      dataIndex: 'secondOrderNum',
      search: false,
      render: (_, records) => {
        return <a href={`/order-management/normal-order?buyerId=${records?.id}&orderType=2`} target='_blank'>{_}</a>
      }
    },
    {
      title: '1688订单数（单）',
      dataIndex: 's1688OrderNum',
      search: false,
      render: (_, records) => {
        return <a href={`/order-management/normal-order?buyerId=${records?.id}&orderType=11`} target='_blank'>{_}</a>
      }
    },
    {
      title: 'c端集约数（单）',
      dataIndex: 'togetherOrderNum',
      search: false,
      render: (_, records) => {
        return <a href={`/order-management/intensive-order/shopkeeper-order?buyerId=${records?.id}`} target='_blank'>{_}</a>
      }
    },
    {
      title: '店主采购订单数（单）',
      dataIndex: 'purchaseOrderNum',
      search: false,
      render: (_, records) => {
        return <a href={`/order-management/intensive-order/supplier-order?memberId=${records?.id}`} target='_blank'>{_}</a>
      }
    },
    {
      title: '渠道',
      dataIndex: 'sourceType',
      search: false,
      valueEnum: {
        0: '-',
        1: '商品分享',
        2: '邀请新人(好友)活动',
        3: '盲盒活动',
        4: '签到活动',
        5: '五星店主活动',
        6: '周末大狂欢活动',
        7: '新人专享活动',
        8: '每日红包活动',
        9: '秒杀活动',
        10: '推荐有礼',
      }
    },
    {
      title: '是否签到',
      dataIndex: 'inviteStatus',
      search: false,
      valueEnum: {
        0: '未签到',
        1: '未签到',
        2: '已签到',
      }
    },
    {
      title: '是否为社区店主',
      dataIndex: 'userType',
      valueType: 'text',
      search: false,
      valueEnum: {
        0: '不是',
        1: '是',
      }
    },
    {
      title: '店铺状态',
      dataIndex: 'storeStatus',
      search: false,
      valueEnum: {
        0: '-/不是店主/无状态',
        1: '启用',
        2: '注销未退保证金',
        3: '关闭',
        4: '待开户',
        5: '注销已退保证金',
      }
    },
    {
      title: '是否为生鲜店主',
      dataIndex: 'memberShopType',
      valueType: 'text',
      search: false,
      valueEnum: {
        0: '不是',
        1: '是',
      }
    },
    {
      title: '成为生鲜店主时间',
      dataIndex: 'beFrTime',
      valueType: 'text',
      search: false,
    },
    {
      title: '注册时间',
      dataIndex: 'regTime',
      valueType: 'text',
      search: false,
    },
    {
      title: '最近访问时间',
      dataIndex: 'regTime',
      valueType: 'text',
      search: false,
    },
  ];

  return (
    <PageContainer>
      <ProCard>
        <ProForm.Group>
          <Search
            style={
              {
                width: 300,
                marginLeft: 24,
                marginTop: 20,
                marginBottom: 20,
              }
            }
            placeholder="请输入用户手机号码"
            onSearch={(value) => {
              setPhoneNumber(Number(value))
              setIndexData('');
            }}
            enterButton={'查询'} />
        </ProForm.Group>
        <ProForm.Group>
          &nbsp;&nbsp;手机号码：{indexData?.phoneNumber}&nbsp;&nbsp;&nbsp;&nbsp;Ta的邀请人手机号：{indexData?.invitePhoneNumber}&nbsp;&nbsp;&nbsp;&nbsp;是否为生鲜店主：{indexData?.memberShopType ? '是' : '不是'}&nbsp;&nbsp;&nbsp;&nbsp;是否为社区店主：{indexData?.userType ? '是' : '不是'}
        </ProForm.Group>
        <ProForm.Group>
          &nbsp;&nbsp;用户昵称：{indexData?.nickName}&nbsp;&nbsp;&nbsp;&nbsp;Ta的邀请人昵称：{indexData?.inviteNickName}&nbsp;&nbsp;&nbsp;&nbsp;邀请成功的好友数量（位）：{indexData?.inviteCount}
        </ProForm.Group>
      </ProCard>

      {!!phoneNumber && <ProTable
        rowKey="id"
        columns={columns}
        actionRef={actionRef}
        params={phoneNumber && { phoneNumber: phoneNumber }}
        request={userRelationShip}
        postData={(data) => {
          setIndexData(data.memberInviteInfoDTO)
          setInitialData(data.list.records)
          return data.list.records
        }}
        search={{
          labelWidth: 'auto',
        }}
        pagination={{
          pageSize: 5,
        }}
        toolBarRender={(_, record) => [
          // <Button key="button" type="primary" onClick={() => { getEXT() }}>
          //   导出
          // </Button>,
          <Export
            key='total'
            change={(e) => { setTotalVisit(e) }}
            type='member-relation-export'
            conditions={() => getFieldValue()}
            title='导出'
            phoneNumber={phoneNumber}
          />,
          <ExportHistory
            key='totalHistory'
            show={totalVisit}
            setShow={setTotalVisit}
            type='member-relation-export'
          />
        ]}
        dateFormatter="string"
      />}
    </PageContainer>
  );
};


export default UserRelationship;