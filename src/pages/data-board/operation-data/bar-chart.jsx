import React from 'react'
import {
	Chart,
	Coordinate,
	Interval,
  Interaction,
  Axis
} from "bizcharts"
import { Empty } from 'antd'

const BarChart = ({data, unit}) => {
  data.sort((a,b)=> a.value - b.value)

  const chartUnit = {
    style: {
      fontSize: 14,
      textAlign: 'center',
      fill: '#E66101'
    },
    position: 'end',
    rotate: 0,
		offset: 80
  }

  return (
    data?.[0]?
    <Chart
      height={400}
      data={data}
      autoFit
      scale={{
        companyName: {
          alias: unit
        }
      }}
    >
      <Axis 
        name='companyName'
        title={chartUnit}
      />
      <Coordinate transpose />
      <Interval 
        position="companyName*value"
        label={[
          "value",
          ()=>({
            position: "middle",
            style: {
              fill: "#fff"
            }
          })
        ]}
      />
      <Interaction type="active-region" />
    </Chart>:
    <Empty/>
  )
}

export default BarChart
