export type PropsDevices = {
  visible: boolean
  setVisible: React.Dispatch<React.SetStateAction<boolean>>
  type: number
  memberId?: string
  memberPhone?: string
  showTitle?: boolean
  imei?: string
}

export type PropsData = {
  id: string
  orderAmount: number
  imei: string
  createTime: number
  orderSn: string
  leaseTerm: string
  payTime: string
  payTypeStr: string
  deviceUseTime: string
  deviceImei: string
  payType: string
  payAmount: string
  amount: number,
  orderNo: string
  commissionType: number
  bindPhone: string
  opType: number
  createRole: string
  nickName: string
  remark: string
  extraRecord: string
  leaseDeadline: string
  leaseStatus: number
  amount: string
  deadlineDate: string
  nowUseTime: string
  updUseTime: string
}

export type PropsStatistics = {
  orderCount: string
  totalOrderAmount: string
  totalAmount: string
  dateDoc: string
  sumAmount: number
  totalDriverCount: number
}

export type StartUpTimeProps = {
  imei?: string
  pageTotal?: number
  memberId?: string
  memberPhone?: string
}

export type ExtraRecordsProps = {
  type: number
  item: PropsData
}


