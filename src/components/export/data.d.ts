export type ExprotProps = {
  type: string
  change?: React.Dispatch<React.SetStateAction<boolean>>
  conditions?: object | [ () => void ]
  text?: string
  slot?: React.ReactChild
  slotHistory?: (v: React.DOMAttributes)=> React.ReactChild
  fileName?: string
}

export type ExportHistoryProps = {
  show: boolean
  setShow: React.Dispatch<React.SetStateAction<boolean>>
  type: string,
  slot?: (v: React.DOMAttributes)=> React.ReactChild
}

export type ExprotStateProps = {
  state: number
  desc: string
}

export type dataProps = {
  code: string
  createId: string
  createName: string
  createTime: string
  exceptionDes: string
  exportConfigId: string
  exportType: number
  fileType: number
  fileUrl: string
  id: string
  process: number
  state: number
}