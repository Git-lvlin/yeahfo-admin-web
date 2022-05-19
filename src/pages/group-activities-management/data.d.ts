import moment from "moment"

export type TableListItem = {
  id: number
  activityName: string
  activityStartTime: number
  activityEndTime: number
  activityStatus: number
  groupNum: number
  groupTime: number
  virtualType: number
  activityStatus: number
}

export type GroupDataItem = {
  acivtyId: number
  activityEndTime: number
  activityName: string
  activityStartTime: number
  failesGroupNums: number
  openGroupUsersNum: number
  successGroupNums: number
  togetherGroupOrderNums: number
  togetherGroupUsersNum: number
  payAmpout: number
  activityTime: string
}
