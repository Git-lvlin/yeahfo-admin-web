export type DescriptionsProps = {
  doneLeaseImeiSum?: number;
  leaseAmountSum?: number;
  leaseDaySum?: number;
  leaseImeiScale?: string;
  leaseImeiSum?: number;
  leaseImeiUserScale?: string;
  leaseImeiUserSum?: number;
  leaseOrderAmount?: string;
  leasePaySum?: number;
  payImeiSum?: number;
  payImeiUserSum?: number;
  payOrderAmount?: string;
  scanAmountSum?: string;
  scanTimeSum?: string;
  startImeiSum?: number;
  startSum?: number;
}

export type TableProps = {
  icon: string;
  imei: string;
  leaseImeiSum: number;
  leasePaySum: number;
  memberId: string;
  memberPhone: string;
  nickName: string;
  payImeiSum: number;
  size: string;
  startSum: number;
  storeName: string;
  storeNo: string;
  userType: number;
}
