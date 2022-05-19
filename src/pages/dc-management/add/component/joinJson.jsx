import React, { useState, useRef } from 'react';
import { Modal, Form, Input, message } from 'antd';
import { objToArr } from '@/utils/tojson'
import { defaultJson } from '@/constants/index'
const { TextArea } = Input;

const App = (props) => {
	const textRef = useRef();
	let jsonObj = {}; 
	
	// let str = '{"paytype":[{"name":"模拟支付","icon":"wechat","type":"1"},{"name":"微信支付","icon":"wechat","type":"2"},{"name":"支付宝","icon":"wechat","type":"3"},{"name":"银联","icon":"wechat","type":"4"}]}'
	// let value = '{"name":"值","number":123,"boolean":true,"key3":{"name":"名称","list":{"obj":{"name":4}}},"key4":[1,false]}';

	const isJsonString = (str) => {
		let isNum = /^[0-9.]+$/g.test(str);
		jsonObj = {}
		try {
			if(isNum) return false;
			jsonObj = JSON.parse(str);
			return true;
		} catch (err) {
			return false;
		}
	}

  const handleOk = () => {
		const value = textRef.current.resizableTextArea.props.value;
		const isJson = isJsonString(value);
		const list = [];
		let frist = true;
		let params = {};
		
    if(!isJson) {
			message.error("请确认输入JSON字符串是否正确！")
			return false;
		}
		
		for(let key in jsonObj) {
			params = {
				key,
				value: jsonObj[key],
				level: 1,
				frist,
			}
			list.push(objToArr(params));
			if(frist) frist = false;
		}
    props.onSetData(list);
		props.onCancel();
  };

  const handleCancel = () => {
    props.onCancel()
  };

  return (
    <>
			<Modal 
				title="导入JSON数据"
				width={600}
				visible
				allowClear
				onOk={handleOk}
				onCancel={handleCancel}
			>
				<TextArea style={{ height: "600px" }} ref={textRef} onPressEnter={handleOk} placeholder={defaultJson} />
      </Modal>
    </>
  );
};

export default App