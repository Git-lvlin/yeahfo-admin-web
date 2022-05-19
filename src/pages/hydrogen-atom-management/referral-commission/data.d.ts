export type PropsExpandTable = {
  data: PropsExpand[]
}

export interface PropsExpand {
  amount: number;
  buyId: string;
  buyMobile: string;
  createTime: any;
  driverCount: number;
  memberShop: boolean;
  storeName: string;
  storeNo: string;
}

export type PropsTable = {
  address: string;
  createTime: number;
  pMemId: string;
  pMobile: string;
  pStoreId: string;
  storeName: string;
  storeStatus: string;
  subs: PropsExpand[];
  totalAccount: string;
  totalDriverCount: number;
  totalUser: number;
}


