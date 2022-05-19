import type { ActionType } from "@ant-design/pro-table"

export type ConsumerOrderPage={
	storeNo: string;
	storeMobile: string;
	storeName: string;
	totalShareCommission: number;
	totalShareOrderAmount: number;
	sumOrderCount: number;
	lastCommissionTime: string;
	district: string;
	buyerCount: number;
}


export type SubsidyOrderItem = {
	orderNo: string;
	goodsName: string;
	skuId: string;
	quantity: number;
	orderAmount: string;
	buyerMobile: string;
	orderTime: string;
	statusDesc: string;
	commission: string;
	payTime: string;
	status: string;
	refundedAmount: string;
}

export type ModalFormProps = {
	visible: boolean
	setVisible: React.Dispatch<React.SetStateAction<boolean>>
	onclose?: function
	storeNo?:string
}
