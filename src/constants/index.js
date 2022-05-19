export const platformType = {
    0: "全平台",
    1: "iOS",
    2: "Android",
    3: "MiniProgram",
    4: "H5",
    5: "FlutterAndroid",
    6: "FultterIos",
}

// 全平台
export const platformTypeAll = [1,2,3,4,5,6]

export const platformTypeSearch = {
    0: {
      text: '全平台',
    },
    1: {
      text: 'iOS',
    },
    2: {
      text: 'Android',
    },
    3: {
      text: 'MiniProgram',
    },
    4: {
      text: 'H5',
    },
    5: {
      text: 'FlutterAndroid',
    },
    6: {
      text: 'FultterIos',
    },
}

export const attrType = {
    String: "String",
    Number: "Number",
    Boolean: "Boolean",
    Array: "Array",
    Object: "Object",
    Reference: "Reference",
}

export const defaultJson = '{"name":"值","number":123,"boolean":true,"key3":{"name":"名称"},"key4":[1,false]}    注：最多嵌套三层，Reference 关联子资源位需要手动更改类型';
