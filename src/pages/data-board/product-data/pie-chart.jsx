import React from 'react'
import {
	Chart,
	Interval,
	Tooltip,
	Axis,
	Coordinate,
	getTheme,
  Legend
} from "bizcharts"
import { Radio } from 'antd'

import styles from './styles.less'
import { amountTransform } from '@/utils/utils'
import { Empty } from 'antd'

const PieChart = ({
  data,
  value,
  onChange
}) => {
 
  const colors = data?.reduce((pre, cur, idx) => {
    pre[cur.item] = getTheme().colors10[idx]
    return pre
  }, {})

  const cols = {
    rate: {
      formatter: (val) => {
        val = amountTransform(Number(val).toFixed(2), '/') + "%"
        return val
      }
    }
  }

  return (
    <>
      <h3 className={styles.pieTitle}>商品分类占比</h3>
      <Radio.Group 
        onChange={(e)=>onChange(e)}
        value={value}
        size="large"
      >
        <Radio value={'1'}>SKU占比</Radio>
        <Radio value={'2'}>销售额占比</Radio>
      </Radio.Group>
      {
        data?.[0]?
        <Chart 
          height={400}
          data={data}
          interactions={['element-active']}
          autoFit
          scale={cols}
          onGetG2Instance={ c => {
            c.removeInteraction('legend-filter')
          }}
        >
          <Coordinate type="theta" radius={0.6} />
          <Tooltip showTitle={false} />
          <Axis visible={false} />
          <Interval
            position="rate"
            adjust="stack"
            color="gcName"
            style={{
              lineWidth: 1,
              stroke: "#fff"
            }}
            label={[
              "gcName",
              (item) => {
                return {
                  offset: 20,
                  style: {
                    fill: colors[item]
                  }
                }
              }
            ]}
          />
          <Legend visible={false}/>
        </Chart>:
        <Empty/>
      }
    </>
  )
}


export default PieChart
