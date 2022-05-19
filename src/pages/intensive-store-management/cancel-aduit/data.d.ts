import React from "react"

export type TableListItem = {
  applyId?: number
  shopMemberAccount?: string
  storeId?: number
  storeNo?: string | undefined
  memberPhone?: string
  memberShopType?: {
    code?: number
  }
  storeName?: string
  provinceName?: string
  cityName?: string
  regionName?: string
  address?: string
  freshVerifyStatus?: {
    code?: number
  }
  operationName?: string
  shopMemberStatus?: {
    code: number
  }
  depositStatus?: {
    code?: string
  }
  details?: {
    reason: string
  }
  auditMsg?: string
  verifyStatus?: {
    code?: number
  }
  createTime?: string
  memberId?: string
}

export type aduitProps = {
  visible: boolean,
  setVisible: React.Dispatch<React.SetStateAction<boolean>>
  data: TableListItem
  callback: () => void
}

export type formWrapData = {
  value?: string
  onChange?: ()=> void
  content?: (value?: string, onChange?: ()=> void)=> React.ReactNode
  right?: (value?: string)=> React.ReactNode
}