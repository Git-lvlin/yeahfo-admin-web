import request from '@/utils/request';

export const saveAdsense= async (params, options = {}) => {
  const {images,order,linkType,linkId,...rest}=params
  const res = await request('/auth/java-admin/adsense/saveAdsense', {
    method: 'POST',
    data: {
      linkId:`${linkId}`,
      images:[images],
      linkType:`${linkType}`,
      order:parseInt(order),
      ...rest
    },
    ...options
  });
  return {
    code: res.code,
    data: res.data,
    success: res.success,
  }
}