/* eslint-disable no-restricted-properties */
/* eslint-disable no-plusplus */
/* eslint-disable no-param-reassign */
import { parse } from 'querystring';
import Big from 'big.js';
import moment from 'moment';

export const getPageQuery = () => parse(window.location.href.split('?')[1]);

export const arrayToTree = (list, parId = 0) => {
  const len = list.length
  function loop(pid) {
    const res = [];
    for (let i = 0; i < len; i += 1) {
      const item = list[i]
      if (item&&item.pid === pid) {
        item.children = loop(item.id)
        res.push(item)
      }
    }
    return res.length ? res : null
  }
  return loop(parId)
}

export const uploadImageFormatConversion = (imgArr, urlKey) => {
  return imgArr.map(item => {
    return item[urlKey]
  })
}

export const amountTransform = (amount, type = '*') => {
  if (!amount || !/^[-]?[.\d]+$/.test(amount)) {
    return 0;
  }

  if (type === '*') {
    return +new Big(amount).times(100)
  }

  return +new Big(amount).div(100)
}

export const numFormat = (num) => {
  const c = (num.toString().indexOf('.') !== -1) ? num.toLocaleString() : num.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
  return c;
}

export const digitUppercase = (n) => {
  const fraction = ['角', '分'];
  const digit = [
    '零', '壹', '贰', '叁', '肆',
    '伍', '陆', '柒', '捌', '玖'
  ];
  const unit = [
    ['元', '万', '亿'],
    ['', '拾', '佰', '仟']
  ];
  const head = n < 0 ? '欠' : '';
  n = Math.abs(n);
  let s = '';
  for (let i = 0; i < fraction.length; i++) {
    s += (digit[Math.floor(n * 10 * Math.pow(10, i)) % 10] + fraction[i]).replace(/零./, '');
  }
  s = s || '整';
  n = Math.floor(n);
  for (let i = 0; i < unit[0].length && n > 0; i++) {
    let p = '';
    for (let j = 0; j < unit[1].length && n > 0; j++) {
      p = digit[n % 10] + unit[1][j] + p;
      n = Math.floor(n / 10);
    }
    s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
  }
  return head + s.replace(/(零.)*零元/, '元')
    .replace(/(零.)+/g, '零')
    .replace(/^整$/, '零元整');
}

export const typeTransform = (array) => {
  if (!Array.isArray(array)) {
    return {}
  }
  const obj = {};
  array.forEach(item => {
    obj[item.code] = {
      text: item.name,
    }
  })
  return obj;
}

export const paramsEmptyFilter = (params) => {
  const obj = {};
  // eslint-disable-next-line no-restricted-syntax
  for (const key in params) {
    if (params[key] !== '') {
      obj[key] = params[key]
    }
  }

  return obj;
}

export const paramsUndefinedToEmpty = (params) => {
  const obj = {};
  // eslint-disable-next-line no-restricted-syntax
  for (const key in params) {
    if (params[key] === undefined) {
      obj[key] = ''
    } else {
      obj[key] = params[key]
    }
  }

  return obj;
}

export const dateFormat = (date) => {
  if (!date) {
    return ''
  }
  return moment(date).format('YYYY-MM-DD HH:mm:ss')
}

export const getImageSize = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = (theFile) => {
      const image = new Image()
      image.src = theFile.target.result
      image.onload = function () {
        const { width, height } = this;
        resolve({ width, height })
      }
    }
  });
}

export const getAreaData = (v) => {
  const arr = [];
  v?.forEach?.(item => {
    let deep = 0;
    let node = window.yeahgo_area.find(it => it.id === item);
    const nodeIds = [node.id];
    const nodeNames = [node.name]
    while (node.pid) {
      deep += 1;
      node = window.yeahgo_area.find(it => it.id === node.pid);
      nodeIds.push(node.id);
      nodeNames.push(node.name);
    }
    arr.push({
      provinceId: nodeIds[deep],
      provinceName: nodeNames[deep],
      cityId: deep > 0 ? nodeIds[deep - 1] : 0,
      cityName: deep > 0 ? nodeNames[deep - 1] : '',
      regionId: deep > 1 ? nodeIds[deep - 2] : 0,
      regionName: deep > 1 ? nodeNames[deep - 2] : '',
    })
  })

  return arr;
}

export const fixedZero = (val) => {
  return val * 1 < 10 ? `0${val}` : val;
}

export const getTimeDistance = (type) => {
  const oneDay = 1000 * 60 * 60 * 24;
  const now = new Date();

  // 昨天
  if (type === 'yesterday') {
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);
    return [moment(now).subtract(1, 'day'), moment(now.getTime() + (oneDay - 1000)).subtract(1, 'day')];
  }

  // 本星期
  if (type === 'week') {
    let day = now.getDay();
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);

    if (day === 0) {
      day = 6;
    } else {
      day -= 1;
    }

    const beginTime = now.getTime() - day * oneDay;
    return [moment(beginTime), moment(beginTime + (7 * oneDay - 1000))];
  }

  // 上个星期
  if (type === 'last-week') {
    let day = now.getDay();
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);

    if (day === 0) {
      day = 6;
    } else {
      day -= 1;
    }
    const beginTime = now.getTime() - day * oneDay;
    return [moment(beginTime).subtract(7, 'day'), moment(beginTime + (7 * oneDay - 1000)).subtract(7, 'day')];
  }

  let year = now.getFullYear();

  // 本月
  if (type === 'month') {
    const month = now.getMonth();
    const nextDate = moment(now).add(1, 'months');
    const nextYear = nextDate.year();
    const nextMonth = nextDate.month();
    return [
      moment(`${year}-${fixedZero(month + 1)}-01 00:00:00`),
      moment(moment(`${nextYear}-${fixedZero(nextMonth + 1)}-01 00:00:00`).valueOf() - 1000),
    ];
  }

  // 上个月
  if (type === 'last-month') {
    const month = now.getMonth();
    const nextDate = moment(now).add(1, 'months');
    const nextYear = month === 11 ?  now.getFullYear() : nextDate.year()
    const lastMonthYear = month === 0 ?  now.getFullYear() - 1 : now.getFullYear()
    return [
      moment(`${lastMonthYear}-${fixedZero(month ? month : 12)}-01 00:00:00`),
      moment(moment(`${nextYear}-${month === 0 ? 1 : month + 1}-01 00:00:00`).valueOf() - 1000),
    ];  
  }

  // 近7天
  if (type === 'nearly-7-days') {
    let day = now.getDay();
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);

    if (day === 0) {
      day = 6;
    } else {
      day -= 1;
    }

    const beginTime = now.getTime();
    return [moment(beginTime - (7 * oneDay - 1000)), moment(beginTime)];
  }

   // 近15天
   if (type === 'nearly-15-days') {
    let day = now.getDay();
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);

    if (day === 0) {
      day = 6;
    } else {
      day -= 1;
    }

    const beginTime = now.getTime();
    return [moment(beginTime - (15 * oneDay - 1000)), moment(beginTime)];
  }

    // 近30天
    if (type === 'nearly-a-month') {
      let day = now.getDay();
      now.setHours(0);
      now.setMinutes(0);
      now.setSeconds(0);
  
      if (day === 0) {
        day = 6;
      } else {
        day -= 1;
      }
  
      const beginTime = now.getTime();
      return [moment(beginTime - (30 * oneDay - 1000)), moment(beginTime)];
    }

    // 近3个月
    if (type === 'nearly-3-month') {
      let day = now.getDay();
      now.setHours(0);
      now.setMinutes(0);
      now.setSeconds(0);
  
      if (day === 0) {
        day = 6;
      } else {
        day -= 1;
      }
  
      const beginTime = now.getTime();
      return [moment(beginTime - (90 * oneDay - 1000)), moment(beginTime)];
    }

     // 近6个月
     if (type === 'nearly-6-month') {
      let day = now.getDay();
      now.setHours(0);
      now.setMinutes(0);
      now.setSeconds(0);
  
      if (day === 0) {
        day = 6;
      } else {
        day -= 1;
      }
  
      const beginTime = now.getTime();
      return [moment(beginTime - (180 * oneDay - 1000)), moment(beginTime)];
    }

  // 本年
  return [moment(`${year}-01-01 00:00:00`), moment(`${year}-12-31 23:59:59`)];
}
