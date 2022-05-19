import { couponDetail } from '@/services/coupon-management/coupon-detail';

const DetailModel = {
  namespace: 'DetailList',
  state: {
    DetailObje:{}
  },
  effects: {
    *fetchLookDetail({ payload}, { call, put}) {
      const data = yield call(couponDetail,payload);
      yield put({
        type: 'lookDetail',
        payload: data.data,
      });
    },

  },
  reducers: {
    lookDetail(state = { DetailObje:{}},{ payload }){
      state.data=payload
      return { ...state};
    },
  },
};
export default DetailModel;
