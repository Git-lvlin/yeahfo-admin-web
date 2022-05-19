const UseScopeModel = {
  namespace: 'UseScopeList',
  state: {
    UseScopeObje:{}
  },
  effects: {
    *fetchUseScopeList({ payload}, { call, put}) {
      yield put({
        type: 'onUseScopeList',
        payload
      });
    },
    *fetchLookSpuIds({ payload}, { call, put}) {
        yield put({
          type: 'onSpuIds',
          payload
        });
    },
    *fetchLookSpuIdsArr({ payload}, { call, put}) {
        yield put({
          type: 'onSpuIdsArr',
          payload
        });
    },
    *fetchLookUnit({ payload }, { call, put}) {
        yield put({
          type: 'onUnit',
          payload
        });
      },
    *fetchLookUnitArr({ payload }, { call, put}) {
      yield put({
        type: 'onUnitArr',
        payload
      });
    },
    *fetchWholesaleIds({ payload }, { call, put}) {
        yield put({
            type: 'onWholesaleIds',
            payload
        });
    },
    *fetchWholesaleArr({ payload }, { call, put}) {
      yield put({
          type: 'onWholesaleArr',
          payload
      });
  },
    *fetchCrowdIdsArr({ payload}, { call, put}) {
      yield put({
          type: 'onCrowdIdsArr',
          payload
      });
  },
    *fetchCrowdIds({ payload}, { call, put}) {
      yield put({
          type: 'onCrowdIds',
          payload
      });
  }

  },
  reducers: {
    onSpuIds(state = { UseScopeObje:{}},{ payload }){
        state.UseScopeObje.spuIds=payload.spuIds
      return { ...state };
    },
    onSpuIdsArr(state = { UseScopeObje:{}},{ payload }){
        state.UseScopeObje.spuIdsArr=payload.spuIdsArr
      return { ...state };
    },
    onUnit(state = { UseScopeObje:{}},{ payload }){
        state.UseScopeObje.unit=payload.unit
        return { ...state };
    },
    onUnitArr(state = { UseScopeObje:{}},{ payload }){
        state.UseScopeObje.unitArr=payload.unitArr
        return { ...state };
    },
    onWholesaleIds(state = { UseScopeObje:{}},{ payload }){
        state.UseScopeObje.wholesaleIds=payload.wholesaleIds
        return { ...state };
    },
    onWholesaleArr(state = { UseScopeObje:{}},{ payload }){
      state.UseScopeObje.wholesaleArr=payload.wholesaleArr
      return { ...state };
  },
    onCrowdIdsArr(state = { UseScopeObje:{}},{ payload }){
      state.UseScopeObje.CrowdIdsArr=payload.CrowdIdsArr
    return { ...state };
    },
    onCrowdIds(state = { UseScopeObje:{}},{ payload }){
      state.UseScopeObje.CrowdIds=payload.CrowdIds
      return { ...state };
    },
    onUseScopeList(state = { UseScopeObje:{}},{ payload }){
      state.UseScopeObje=payload.UseScopeObje
      return { ...state };
    },
   
  },
};
export default UseScopeModel;
