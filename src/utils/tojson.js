
// 生成随机字符串
const randomString = (len) => {
  len = len || 32;
  var t = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz",
  // var t = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz12345678",
  a = t.length,
  n = "";
  for (let i = 0; i < len; i++) n += t.charAt(Math.floor(Math.random() * a));
  return n
}

// 返回数据类型
export const getTypeOf = (value) => {
  let type = Object.prototype.toString.call(value);
  if(!type) return "String";
  type = type.split(" ")[1].split("]")[0];
  return type;
}

// 判断是不是JSON字符串
export const isJsonString = (str) => {
  let isNum = /^[0-9.]+$/g.test(str);
  try {
    if(isNum) return false;
    return JSON.parse(str);
  } catch (err) {
    return false;
  }
}

// JSON对象转数组
export const objToArr = ({
  key: objKey, 
  value, 
  level, 
  frist,
  parent,
  preParent,
  define
}) => {
  let child = {};
  let params = {};
  child.key = randomString();
  child.attr = (!!define && define === "Reference") ? "Reference" : getTypeOf(value);
  child.name = objKey;
  child.value = (child.attr === "Object" || child.attr === "Array") ? "" : value;
  child.value = child.attr === "Boolean" ? child.value.toString() : child.value;
  child.level = level;
  if(preParent) child.preParent = preParent;
  if(parent) child.parent = parent;
  if(frist) {
    child.type = "frist";
  }
  if((child.attr === "Object" || child.attr === "Array") && level === 3) {
    child.attr = "String";
    child.value = JSON.stringify(value)
    return child;
  }
  if(child.attr === "Object" && level < 3) {
    if(value != {}) {
      child.children = [];
      for(let childKey in value) {
        params = { 
          key: childKey,
          value: value[childKey],
          level: level + 1,
        }
        if(!!define) params.define = define[childKey];
        if(level === 1) params.preParent = child.key;
        if(level === 2) {
          params.preParent = preParent;
          params.parent = child.key;
        }
        child.children.push(objToArr(params))
      }
    }
  } else if(child.attr === "Array" && level < 3) {
    if(value != []) {
      child.children = [];
      value.forEach((item, index) => {
        params = { 
          // key: index + 1,
          key: randomString(8),
          value: item,
          level: level + 1,
        }
        if(!!define) params.define = define[index];
        if(level === 1) params.preParent = child.key;
        if(level === 2) {
          params.preParent = preParent;
          params.parent = child.key;
        }
        child.children.push(objToArr(params))
      })
    }
  }
  return child;
}


// 单个列表数据转json 一级遍历到所有子级
export const itemToJson = (item) => {
  let data = {};
  let define = {};
  let resultData = {};
  if(item.attr === "Object" && !!item.name){
    data = {};
    define = {};
    if(!!item.children && !!item.children.length){
      item.children.forEach(child => {
        resultData = itemToJson(child);
        let value = resultData.data;
        data = {
          ...data,
          [child.name]: value,
        }
        define = {
          ...define,
          [child.name]: resultData.define,
        }
      })
    }
  } else if(item.attr == "Array" && !!item.name) {
    data = [];
    define = [];
    if(!!item.children && !!item.children.length){
      item.children.forEach(child => {
        resultData = itemToJson(child);
        data.push(resultData.data)
        define.push(resultData.define)
      })
    }
  } else if(!!item.name) {
    if(item.attr === "Boolean") {
      data = item.value === "true" ? true : false;
      define = item.attr
    } else {
      data = item.value;
      define = item.attr
    }
  }
  return {
    data,
    define,
  };
}

