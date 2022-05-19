import request from '@/utils/request';

export const spaceInfoList = async (params = {}, options = {}) => {
  const { current, pageSize, status, ...rest } = params;

  const data = {
    page: current,
    size: pageSize,
    ...rest
  }
  if (status) {
    data.status = Number(status);
  }
  const res = await request('/auth/activity/Activity/spaceInfoList', {
    method: 'POST',
    data,
    ...options
  });

  return {
    data: res.data.records || [],
    success: true,
    total: res.data.total,
  }
}

export const crazyActivityAdd = (params = {}, options = {}) => {
  return request('/auth/activity/Cms/cmsSub', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const spaceAdd = (params = {}, options = {}) => {
  return request('/auth/activity/Activity/spaceAdd', {
    method: 'POST',
    data: params,
    ...options
  });
}
export const spaceEdit = (params = {}, options = {}) => {
  return request('/auth/activity/Activity/spaceEdit', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const homeActivityUpdata = (params = {}, options = {}) => {
  return request('/auth/java-admin/cms/activityIcon/saveOrUpdate', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const bannerAdd = (params = {}, options = {}) => {
  return request('/auth/java-admin/cms/banner/saveOrUpdate', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const verifyVersionEdit = (params = {}, options = {}) => {
  return request('/auth/activity/Cms/verifyVersionEdit', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const storyUpdata = (params = {}, options = {}) => {
  return request('/auth/java-admin/storeStory/storeStoryUpdate', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const posterUpdata = (params = {}, options = {}) => {
  return request('/auth/java-admin/cms/poster/saveOrUpdate', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const merketDetailUpdata = (params = {}, options = {}) => {
  return request('/auth/java-admin/activitySubject/itemSaveOrUpdate', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const marketUpdata = (params = {}, options = {}) => {
  return request('/auth/java-admin/activitySubject/saveOrUpdate', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const tagSortModify = (params = {}, options = {}) => {
  return request('/auth/activity/Goods/goodsTagSortSub', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const cmsImageInfo = (params = {}, options = {}) => {
  return request('/auth/activity/Cms/cmsImageInfo', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const cmsImageAdd = (params = {}, options = {}) => {
  return request('/auth/activity/Cms/cmsImageAdd', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const cmsImageEdit = (params = {}, options = {}) => {
  return request('/auth/activity/Cms/cmsImageEdit', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const saveSortModify = (params = {}, options = {}) => {
  return request('/auth/activity/Goods/wholesaleGoodsSortSub', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const kingKongAdd = (params = {}, options = {}) => {
  return request('/auth/java-admin/cms/goodsType/goodsTypeSave', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const kingKongModify = (params = {}, options = {}) => {
  return request('/auth/java-admin/cms/goodsType/goodsTypeUpdate', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const generateSubmit = (params = {}, options = {}) => {
  return request('/auth/java-admin/public/invationcode/internalTest/generator', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const generateIntData = (params = {}, options = {}) => {
  return request('/auth/java-admin/public/invationcode/internalTest/export', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const generateUpdata = (params = {}, options = {}) => {
  return request('/auth/java-admin/exportTask/createExportTask', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const getGenerteUrl = (params = {}, options = {}) => {
  return request('/auth/java-admin/exportTask/findById', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const expressNewsUpdate = (params = {}, options = {}) => {
  const { id, ...rest } = params

  const param = {
    ...rest
  }
  if (id) {
    param.id = id
  }
  const url = id?'/auth/java-admin/cms/notice/update':'/auth/java-admin/cms/notice/add';
  return request(url, {
    method: 'POST',
    data: param,
    ...options
  });
}

export const homeSuspensionAdd = (params = {}, options = {}) => {
  return request('/auth/java-admin/cms/bannerFloat/saveOrUpdate', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const saveMoneyList = async (params = {}, options = {}) => {
  const { current, pageSize, status, ...rest } = params;

  const data = {
    page: current,
    size: pageSize,
    ...rest
  }
  if (status) {
    data.status = Number(status);
  }
  const res = await request('/auth/activity/Goods/wholesaleGoodsList', {
    method: 'POST',
    data,
    ...options
  });

  return {
    data: res.data.records || [],
    success: true,
    total: res.data.total,
  }
}
export const hotGoosList = async (params = {}, options = {}) => {
  const { current, pageSize, status, goodsType, ...rest } = params;

  const data = {
    page: current,
    pageSize: pageSize,
    ...rest
  }
  if (goodsType) {
    data.goodsType = Number(goodsType)
  }
  if (status) {
    data.status = Number(status);
  }
  const res = await request('/auth/activity/Goods/goodsTagList', {
    method: 'POST',
    data,
    ...options
  });

  return {
    data: res.data.records || [],
    success: true,
    total: res.data.total,
  }
}

export const articleList = async (params = {}, options = {}) => {
  const { current, pageSize, ...rest } = params;

  const data = {
    page: current,
    pageSize: pageSize,
    ...rest
  }
  const res = await request('/auth/java-admin/articleInfo/findAdminArticleList', {
    method: 'POST',
    data,
    ...options
  });

  return {
    data: res.data.records || [],
    success: true,
    total: res.data.total,
  }
}

export const crazyDateList = async (params = {}, options = {}) => {
  const { current, pageSize, ...rest } = params;
  
  const data = {
    page: current,
    size: pageSize,
    ...rest
  }
  const res = await request('/auth/activity/Cms/cmsList', {
    method: 'POST',
    data,
    ...options
  });

  return {
    data: res.data.records || [],
    success: true,
    total: res.data.total,
  }
}

export const crazyGoodsList = async (params = {}, options = {}) => {
  const { current, pageSize, ...rest } = params;

  const data = {
    page: current,
    pageSize,
    ...rest
  }

  const res = await request('/auth/activity/Cms/cmsGoodsList', {
    method: 'POST',
    data,
    ...options
  });
  if (!res.data.records.length) {
    res.data = []
  }
  return {
    data: res.data.records || [],
    success: true,
    total: res.data.total,
  }
}

export const crazyActivityGoodsAdd = (params = {}, options = {}) => {
  return request('/auth/activity/Cms/cmsGoodsYlbbSub', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const crazyActivityGoodsAddPT = (params = {}, options = {}) => {
  return request('/auth/activity/Cms/cmsGoodsSub', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const hotGoosAdd = (params = {}, options = {}) => {
  return request('/auth/activity/Goods/goodsTagSub', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const couponAdd = (params = {}, options = {}) => {
  return request('/auth/activity/Coupon/couponCmsSub', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const hotGoosAddDF = (params = {}, options = {}) => {
  return request('/auth/activity/Goods/goodsTagYlbbSub', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const priceListAdd = (params = {}, options = {}) => {
  return request(`/auth/go-spider-api/contestprice/auth/contestprice/AddContestGoods?ids=${params.ids}`, {
    method: 'GET',
    data: params,
    ...options
  });
}

export const saveMoneyAdd = (params = {}, options = {}) => {
  return request('/auth/activity/Goods/wholesaleGoodsSub', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const hotGoosOperation = (params = {}, options = {}) => {
  return request('/auth/activity/Goods/goodsTagStatusSub', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const articleOperation = (params = {}, options = {}) => {
  return request('/auth/java-admin/articleType/saveOrUpdateArticleType', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const findAdminArticleTypeList = async (params = {}, options = {}) => {
  const { current, pageSize, ...rest } = params;
  const data = {
    // page: current,
    // size: pageSize,
    ...rest
  }
  const res = await request('/auth/java-admin/articleType/findAdminArticleTypeList', {
    method: 'POST',
    data,
    ...options
  });
  return {
    data: res.data || [],
    success: true,
    total: res.data.total,
  }
}

export const delContestGoods = (params = {}, options = {}) => {
  return request(`/auth/go-spider-api/contestprice/auth/contestprice/DelContestGoods?id=${params.id}`, {
    method: 'GET',
    data: params,
    ...options
  });
}

export const upDataPrice = (params = {}, options = {}) => {
  return request(`/auth/go-spider-api/contestprice/auth/contestprice/SetContestDefaultPrice`, {
    method: 'POST',
    data: params,
    ...options
  });
}

export const bindSkuId = (params = {}, options = {}) => {
  return request(`/auth/go-spider-api/spiderdbc/auth/spiderdbc/setContestBindSku?goodsSpuId=${params.goodsSpuId}&goodsSkuId=${params.goodsSkuId}&sourceType=${params.sourceType}&skuId=${params.skuId}`, {
    method: 'GET',
    data: params,
    ...options
  });
}

export const tagSortTop = (params = {}, options = {}) => {
  return request('/auth/activity/Goods/goodsTagSortTop', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const articleTop = (params = {}, options = {}) => {
  return request('/auth/java-admin/articleInfo/saveOrUpdateArticle', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const saveMoneySortTop = (params = {}, options = {}) => {
  return request('/auth/activity/Goods/wholesaleGoodsSortTop', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const bannerSortTop = (params = {}, options = {}) => {
  return request('/auth/java-admin/cms/banner/setTop', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const goodsSortTopOld = (params = {}, options = {}) => {
  return request('/auth/wholesale/skuConfig/modifySort', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const goodsClassAdd = (params = {}, options = {}) => {
  return request('/auth/wholesale/SkuCategory/categoryAdd', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const goodsSortTop = (params = {}, options = {}) => {
  return request('/auth/wholesale/skuConfig/toTop', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const goodsSortTopCancel = (params = {}, options = {}) => {
  return request('/auth/wholesale/skuConfig/cancelTop', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const goodsSortReset = (params = {}, options = {}) => {
  return request('/auth/wholesale/skuConfig/resetSort', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const goodsMoveSort = (params = {}, options = {}) => {
  return request('/auth/wholesale/skuConfig/moveSort', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const homeClassCategorySecondCategory = (params = {}, options = {}) => {
  return request('/auth/goods/product/categorySecondCategory', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const homeClassificationSetSort = (params = {}, options = {}) => {
  return request('/auth/goods/product/categorySetHomeSort', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const homeClassificationStatus = (params = {}, options = {}) => {
  return request('/auth/goods/product/categorySetHomeStatus', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const homeClassificationSortTop = (params = {}, options = {}) => {
  return request('/auth/goods/product/categorySetHomeStick', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const homeActivitySortTop = (params = {}, options = {}) => {
  return request('/auth/java-admin/cms/activityIcon/setTop', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const cententVersionStatus = (params = {}, options = {}) => {
  return request('/auth/activity/Cms/verifyVersionStatusSub', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const couponCmsSortTop = (params = {}, options = {}) => {
  return request('/auth/activity/Coupon/couponCmsSortTop', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const crazyActivityDel = (params = {}, options = {}) => {
  return request('/auth/activity/Cms/cmsStatusSub', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const crazyActivityGoodsDel = (params = {}, options = {}) => {
  return request('/auth/activity/Cms/cmsGoodsStatusSub', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const SetHotGoodsDel = (params = {}, options = {}) => {
  return request(`/auth/go-spider-api/contestprice/auth/contestprice/SetHotGoods?ids=${params.ids}&opt=${params.opt}`, {
    method: 'GET',
    data: params,
    ...options
  });
}

export const SetHomePageGoodsDel = (params = {}, options = {}) => {
  return request(`/auth/go-spider-api/contestprice/auth/contestprice/SetHomePageGoods?id=${params.id}&opt=${params.opt}`, {
    method: 'GET',
    data: params,
    ...options
  });

}
export const SetHomePageGoodsDelSort = (params = {}, options = {}) => {
  return request(`/auth/go-spider-api/contestprice/auth/contestprice/SetHomePageGoods?id=${params.id}&sort=${params.sort}&opt=${params.opt}`, {
    method: 'GET',
    data: params,
    ...options
  });
}
export const hotSearchEdit = (params = {}, options = {}) => {
  let url = `/auth/search/HotKeyword/updateHotKeyword`
  if (!params.id) {
    url = '/auth/search/HotKeyword/addHotKeyword'
  }
  return request(url, {
    method: 'POST',
    data: params,
    ...options
  });
}
export const hotSearchDel = (params = {}, options = {}) => {
  return request(`/auth/search/HotKeyword/updateHotKeyword/id/${params.id}`, {
    method: 'POST',
    data: {isDel: 1},
    ...options
  });
}
export const homeBannerDel = (params = {}, options = {}) => {
  return request('/auth/java-admin/cms/banner/delByIds', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const posterDel = (params = {}, options = {}) => {
  return request('/auth/java-admin/cms/poster/delById', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const marketDel = (params = {}, options = {}) => {
  return request('/auth/java-admin/activitySubject/delById', {
    method: 'POST',
    data: params,
    ...options
  });
}
export const marketItemDel = (params = {}, options = {}) => {
  return request('/auth/java-admin/activitySubject/delByItemId', {
    method: 'POST',
    data: params,
    ...options
  });
}
export const couponDel = (params = {}, options = {}) => {
  return request('/auth/activity/Coupon/couponCmsDel', {
    method: 'POST',
    data: params,
    ...options
  });
}
export const homeSuspensionDel = (params = {}, options = {}) => {
  return request('/auth/java-admin/cms/bannerFloat/delById', {
    method: 'POST',
    data: params,
    ...options
  });
}
export const expressNewsDel = (params = {}, options = {}) => {
  return request('/auth/java-admin/cms/notice/deleteById', {
    method: 'POST',
    data: params,
    ...options,
  });
}

export const expressNewsDown = (params = {}, options = {}) => {
  return request('/auth/java-admin/cms/notice/updateState',{
    method: 'POST',
    data: params,
    ...options,
  })
}

export const expressNewsTop = (params = {}, options = {}) => {
  return request('/auth/java-admin/cms/notice/updateTop',{
    method: 'POST',
    data: params,
    ...options,
  })
}

export const kingKongTop = (params = {}, options = {}) => {
  return request('/auth/java-admin/cms/goodsType/updateTop',{
    method: 'POST',
    data: params,
    ...options,
  })
}

export const kongKongDistrictDel = (params = {}, options = {}) => {
  return request('/auth/java-admin/cms/goodsType/goodsTypeDelById', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const kongKongModifyType = (params = {}, options = {}) => {
  return request('/auth/java-admin/cms/goodsType/goodsTypeUpdateMoreState', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const modifyTagSort = (params = {}, options = {}) => {
  return request('/auth/activity/Goods/goodsTagSortSub', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const crazyTagSort = (params = {}, options = {}) => {
  return request('/auth/activity/Cms/cmsGoodsSortSub', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const memberOperation = (params = {}, options = {}) => {
  return request('/auth/activity/Activity/spanceInfoStatusEdit', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const goodsAllList = async (params = {}, options = {}) => {
  const { current, pageSize, gcId, ...rest } = params;
  const data = {
    page: current,
    size: pageSize,
    ...rest
  }
  if (gcId) {
    data.gcId1 = gcId[0]
    data.gcId2 = gcId[1]
  }
  const res = await request('/auth/goods/product/skuList', {
    method: 'POST',
    data,
    ...options
  });

  return {
    data: res.data.records || [],
    success: true,
    total: res.data.total,
  }
}

export const goosReplaceList = async (params = {}, options = {}) => {
  const { current, pageSize, ...rest } = params;

  const data = {
    page: current,
    pageSize,
    ...rest
  }
  const res = await request('/auth/activity/Goods/ylbbGoodsList', {
    method: 'POST',
    data,
    ...options
  });

  return {
    data: res.data.records || [],
    success: true,
    total: res.data.total,
  }
}

export const saveMoneyOperation = (params = {}, options = {}) => {
  return request('/auth/activity/Goods/wholesaleGoodsStatusSub', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const getAppPopup = (params = {}, options = {}) => {
  return request('/auth/java-admin/public/adimg/activity/popup', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const getAppRedBoxPopup = (params = {}, options = {}) => {
  return request('/auth/java-admin/public/adimg/newuser/coupon', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const getStartUp = (params = {}, options = {}) => {
  return request('/auth/java-admin/public/adimg/boot', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const homePopupUpdate = (params = {}, options = {}) => {
  return request('/auth/java-admin/public/adimg/update', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const posterUpData = (params = {}, options = {}) => {
  return request('/auth/java-admin/cms/poster/saveOrUpdate', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const saveMoneyFormList = async (params = {}, options = {}) => {
  const { current, pageSize, status, ...rest } = params;

  const data = {
    page: current,
    pageSize: pageSize,
    ...rest
  }
  if (status) {
    data.status = Number(status);
  }
  const res = await request('/auth/activity/Goods/wholesaleTransGoodsList', {
    method: 'POST',
    data,
    ...options
  });

  return {
    data: res.data.records || [],
    success: true,
    total: res.data.total,
  }
}

export const saveMoneyFormLists = async (params = {}, options = {}) => {
  const { current, pageSize, status, ...rest } = params;

  const data = {
    page: current,
    pageSize: pageSize,
    ...rest
  }
  if (status) {
    data.status = Number(status);
  }
  const res = await request('/auth/activity/Goods/commonSpuList', {
    method: 'POST',
    data,
    ...options
  });

  return {
    data: res.data.records || [],
    success: true,
    total: res.data.total,
  }
}

export const homeActivityList = async (params = {}, options = {}) => {
  const { current, pageSize, ...rest } = params;

  const data = {
    page: current,
    size: pageSize,
    ...rest
  }
  const res = await request('/auth/java-admin/cms/activityIcon/page', {
    method: 'POST',
    data,
    ...options
  });

  return {
    data: res.data.records || [],
    success: true,
    total: res.data.total,
  }
}

export const homeBannerList = async (params = {}, options = {}) => {
  const { current, pageSize, status, ...rest } = params;

  const data = {
    page: current,
    size: pageSize,
    ...rest
  }
  if (status) {
    data.status = Number(status);
  }
  const res = await request('/auth/java-admin/cms/banner/page', {
    method: 'POST',
    data,
    ...options
  });

  return {
    data: res.data.records || [],
    success: true,
    total: res.data.total,
  }
}

export const openSwitch = (params = {}, options = {}) => {
  return request('/auth/wholesale/SkuCategory/categoryOpenSwitch', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const hideItem = (params = {}, options = {}) => {
  return request('/auth/wholesale/SkuCategory/categoryEdit', {
    method: 'POST',
    data: params,
    ...options
  });
}


export const pushClass = (params = {}, options = {}) => {
  return request('/auth/wholesale/SkuConfig/modifyProCategory', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const goodsClassList = async (params = {}, options = {}) => {
  const { current, pageSize, ...rest } = params;

  const data = {
    page: current,
    size: pageSize,
    ...rest
  }

  const res = await request('/auth/wholesale/SkuCategory/categoryAll', {
    method: 'POST',
    data,
    ...options
  });

  return {
    data: res.data.records || [],
    success: true,
    total: res.data.total,
  }
}

export const goodsSortList = async (params = {}, options = {}) => {
  const { current, pageSize, ...rest } = params;

  const data = {
    page: current,
    size: pageSize,
    ...rest
  }

  const res = await request('/auth/wholesale/skuConfig/getSortedList', {
    method: 'POST',
    data,
    ...options
  });

  return {
    data: res.data.records || [],
    success: true,
    total: res.data.total,
  }
}

export const homeClassificationList = async (params = {}, options = {}) => {
  const { current, pageSize, homeStatus, ...rest } = params;

  const data = {
    page: current,
    size: pageSize,
    ...rest
  }
  if (homeStatus) {
    data.homeStatus = Number(homeStatus);
  }
  const res = await request('/auth/goods/product/categorySearchHomeList', {
    method: 'POST',
    data,
    ...options
  });

  return {
    data: res.data.records || [],
    success: true,
    total: res.data.total,
  }
}

export const userRelationShip = async (params = {}, options = {}) => {
  const { current, pageSize, ...rest } = params;
  const data = {
    page: current,
    size: pageSize,
    ...rest
  }
  const res = await request('/auth/java-admin/memberInfo/getInviteList', {
    method: 'POST',
    data,
    ...options
  });

  return {
    data: res.data || [],
    success: true,
    total: res.data.list.total,
  }
}

export const contentVersionList = async (params = {}, options = {}) => {
  const { current, pageSize, ...rest } = params;

  const data = {
    page: current,
    size: pageSize,
    ...rest
  }
  const res = await request('/auth/activity/Cms/verifyVersionList', {
    method: 'POST',
    data,
    ...options
  });

  return {
    data: res.data || [],
    success: true,
    total: res.data.total,
  }
}

export const storyList = async (params = {}, options = {}) => {
  const { current, pageSize, ...rest } = params;

  const data = {
    page: current,
    size: pageSize,
    ...rest
  }
  const res = await request('/auth/java-admin/storeStory/storeStoryByWays', {
    method: 'POST',
    data,
    ...options
  });

  return {
    data: res.data.records || [],
    success: true,
    total: res.data.total,
  }
}

export const posterList = async (params = {}, options = {}) => {
  const { current, pageSize, ...rest } = params;

  const data = {
    page: current,
    size: pageSize,
    ...rest
  }
  const res = await request('/auth/java-admin/cms/poster/findPage', {
    method: 'POST',
    data,
    ...options
  });

  return {
    data: res.data.records || [],
    success: true,
    total: res.data.total,
  }
}

export const posterListNew = async (params = {}, options = {}) => {
  const { current, pageSize, ...rest } = params;

  const data = {
    page: current,
    size: pageSize,
    ...rest
  }
  const res = await request('/auth/java-admin/cms/poster/findPage', {
    method: 'POST',
    data,
    ...options
  });

  return res
}

export const marketList = async (params = {}, options = {}) => {
  const { current, pageSize, status, ...rest } = params;

  const data = {
    page: current,
    size: pageSize,
    ...rest
  }
  if (status) {
    data.status = Number(status);
  }
  const res = await request('/auth/java-admin/activitySubject/findPage', {
    method: 'POST',
    data,
    ...options
  });

  return {
    data: res.data.records || [],
    success: true,
    total: res.data.total,
  }
}

export const couponList = async (params = {}, options = {}) => {
  const { current, pageSize, freeAmount, ...rest } = params;
  const data = {
    page: current,
    size: pageSize,
    ...rest
  }
  if (freeAmount) {
    data.freeAmount = freeAmount*100
  }
  const res = await request('/auth/activity/Coupon/couponCmsList', {
    method: 'POST',
    data,
    ...options
  });

  return {
    data: res.data.records || [],
    success: true,
    total: res.data.total,
  }
}

export const hotSearchList = async (params = {}, options = {}) => {
  const { current, pageSize, status, ...rest } = params;

  const data = {
    page: current,
    size: pageSize,
    ...rest
  }
  if (status) {
    data.status = Number(status);
  }
  const res = await request('/auth/search/HotKeyword/getAllHotKeyword', {
    method: 'POST',
    data,
    ...options
  });

  return {
    data: res.data.records || [],
    success: true,
    total: res.data.total,
  }
}


export const homeSuspensionList = async (params = {}, options = {}) => {
  const { current, pageSize, status, ...rest } = params;

  const data = {
    page: current,
    pageSize: pageSize,
    ...rest
  }
  if (status) {
    data.status = Number(status);
  }
  const res = await request('/auth/java-admin/cms/bannerFloat/page', {
    method: 'POST',
    data,
    ...options
  });

  return {
    data: res.data.records || [],
    success: true,
    total: res.data.total,
  }
}
export const expressNewsList = async (params = {}, options = {}) => {
  const { current, pageSize, state, id, ...rest } = params;

  const data = {
    page: current,
    size: pageSize,
    ...rest
  }
  if (state) {
    data.state = Number(state);
  }
  
  const res = await request('/auth/java-admin/cms/notice/selectByWays', {
    method: 'POST',
    data,
    ...options
  });

  return {
    data: res.data.records || [],
    success: true,
    total: res.data.total,
  }
}

export const kingKongDistrictList = async (params = {}, options = {}) => {
  const { current, pageSize, status, ...rest } = params;

  const data = {
    page: current,
    size: pageSize,
    ...rest
  }
  if (status) {
    data.status = Number(status);
  }
  const res = await request('/auth/java-admin/cms/goodsType/goodsTypeByWays', {
    method: 'POST',
    data,
    ...options
  });

  return {
    data: res.data.records || [],
    success: true,
    total: res.data.total,
  }
}

export const couponAddList = async (params = {}, options = {}) => {
  const { current, pageSize, ...rest } = params;

  const data = {
    page: current,
    pageSize: pageSize,
    ...rest
  }
  const res = await request('/auth/activity/Coupon/couponList', {
    method: 'POST',
    data,
    ...options
  });

  return {
    data: res.data.records || [],
    success: true,
    total: res.data.total,
  }
}

export const todayAllGoodsList = async (params = {}, options = {}) => {
  const { current, pageSize, status, ...rest } = params;

  const data = {
    page: current,
    pageSize: pageSize,
    ...rest
  }
  if (status) {
    data.status = Number(status);
  }
  const res = await request('/auth/activity/Goods/commonSpuList', {
    method: 'POST',
    data,
    ...options
  });

  return {
    data: res.data.records || [],
    success: true,
    total: res.data.total,
  }
}

export const marketItemList = async (params = {}, options = {}) => {
  const { current, pageSize, ...rest } = params;

  const data = {
    page: current,
    pageSize: pageSize,
    ...rest
  }
  const res = await request('/auth/java-admin/activitySubject/findPage', {
    method: 'POST',
    data,
    ...options
  });
  return {
    data: res.data.records[0].itemList || [],
    success: true,
    total: res.data.total,
  }
}

export const memberSortTop = (params = {}, options = {}) => {
  return request('/auth/activity/Activity/spanceInfoSortTop', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const priceComparsionListAll = async (params = {}, options = {}) => {
  const { current, pageSize, ishot, ...rest } = params;
  const data = {
    page: current,
    size: pageSize,
    ...rest
  }
  const res = await request('/auth/go-spider-api/contestprice/auth/contestprice/GetContestGoodsList?isHot=0', {
    method: 'GET',
    data,
    ...options
  });
  const news = res.data?.records?.filter(item => {
    if (item.acquire === 1) {
      return item
    }
  })
  return {
    data: news || [],
    success: true,
    total: res.data.total,
  }
}

export const priceComparsionListAlls = async (params = {}, options = {}) => {
  const { current, pageSize, ishot, ...rest } = params;

  const data = {
    page: current,
    size: pageSize,
    ...rest
  }
  const res = await request('/auth/go-spider-api/contestprice/auth/contestprice/GetContestGoodsList', {
    method: 'POST',
    data,
    ...options
  });
  return {
    data: res.data.records || [],
    success: true,
    total: res.data.total,
  }
}

export const priceComparsionList = async (params = {}, options = {}) => {
  const { current, pageSize, ishot, ...rest } = params;
  const data = {
    page: current,
    size: pageSize,
    ...rest
  }
  const res = await request('/auth/go-spider-api/contestprice/auth/contestprice/GetContestGoodsList?isHot=1', {
    method: 'GET',
    data,
    ...options
  });

  return {
    data: res.data.records || [],
    success: true,
    total: res.data.total,
  }
}

export const savePriceList = async (params = {}, options = {}) => {
  const { current, pageSize, status, ...rest } = params;

  const data = {
    page: current,
    size: pageSize,
    ...rest
  }
  if (status) {
    data.status = Number(status);
  }
  // const res = await request('/auth/go-spider-api/contestprice/auth/contestprice/GetHotGoodsList?isPage=true', {
  const res = await request('/auth/go-spider-api/contestprice/auth/contestprice/GetHotGoodsListAdmin?isPage=true', {
    method: 'GET',
    data,
    ...options
  });

  return {
    data: res.data.records || [],
    success: true,
    total: res.data.total,
  }
}

export const priceComparsionHomeList = async (params = {}, options = {}) => {
  const { current, pageSize, status, ...rest } = params;

  const data = {
    page: current,
    size: pageSize,
    ...rest
  }
  if (status) {
    data.status = Number(status);
  }
  const res = await request('/auth/go-spider-api/contestprice/auth/contestprice/GetFaceGoodsList', {
    method: 'GET',
    data,
    ...options
  });

  if (!res.data.length) {
    res.data = []
  }

  return {
    data: res.data || [],
    success: true,
    total: res.data.total,
  }
}

export const createTaskSrc = (params = {}, options = {}) => {
  return request('/auth/go-spider-api/spiderdbc/auth/spiderdbc/CreateTask', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const sendTask = (params = {}, options = {}) => {
  return request('/auth/go-spider-api/spiderdbc/auth/spiderdbc/SendTask', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const getSpiderGoodsListByDate = (params = {}, options = {}) => {
  return request(`/auth/go-spider-api/spiderdbc/auth/spiderdbc/GetSpiderGoodsListByDate?sourceType=${params.sourceType}&goodsId=${params.goodsId}&goodsSkuId=${params.goodsSkuId}`, {
    method: 'GET',
    data: params,
    ...options
  });
}

export const getGoodsBindData = (params = {}, options = {}) => {
  return request(`/auth/go-spider-api/spiderdbc/auth/spiderdbc/GetSpiderPlatformList?goodsId=${params.goodsId}&goodsSkuId=${params.goodsSkuId}`, {
    method: 'GET',
    data: params,
    ...options
  });
}

// 标签-排序操作
export const tagSortSub = (params = {}, options = {}) => {
  return request(`/auth/activity/Goods/tagSortSub`, {
    method: 'POST',
    data: params,
    ...options
  })
}

// 标签-排序信息
export const tagSortInfo = (params = {}, options = {}) => {
  return request(`/auth/activity/Goods/tagSortInfo`, {
    method: 'POST',
    data: params,
    ...options
  })
}