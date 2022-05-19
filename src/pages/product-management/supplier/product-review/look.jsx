import React, { useEffect } from 'react';
import { Form } from 'antd';
import {
  ModalForm,
} from '@ant-design/pro-form';
import style from './look.less';

export default (props) => {
  const { visible, setVisible, dataList } = props;
  const [form] = Form.useForm();

  useEffect(() => {
    console.log('dataList', dataList)
  }, [dataList])

  return (
    <ModalForm
      title={`${dataList.goods.salePrice?'底价模式单规格':'其它'}`}
      onVisibleChange={setVisible}
      visible={visible}
      width={400}
      form={form}
      submitter={{
        resetButtonProps: {
          style: {
            display: 'none',
          },
        },
        submitButtonProps: {
          style: {
            display: 'none',
          },
        },
      }}
    >
      <div className={style.box}>
        <div className={style.boxs}>
          <div className={style.head}>
            <div className={style.headbox}>
              {
                dataList.primaryImages.map((item) => {
                  return <img className={style.img} className={style.img} src={item.imageUrl} />
                })
              }
            </div>
          </div>
          <div className={style.text}>
            <div className={style.name}>{dataList.goods.goodsName}</div>
            {dataList.goods.salePrice&&<div className={style.price}>{'￥'+dataList.goods.salePrice/100}</div>}
          </div>
          <div>
            {
              dataList.detailImages.map((item) => {
                return <img className={style.img} src={item.imageUrl} />
              })
            }
          </div>
        </div>
      </div>
    </ModalForm >
  );
};