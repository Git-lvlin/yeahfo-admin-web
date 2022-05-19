import React from 'react'
import {
  Legend,
  Chart,
  Tooltip,
  Interval,
  Axis
} from "bizcharts"
import { Empty } from 'antd'

const Histogram = ({data, unit}) => {

  const scale = {
    value: { 
      min: 0,
      alias: unit
    },
  }

  const chartUnit = {
    style: {
      fontSize: 12,
      textAlign: 'center',
      fill: '#E66101'
    },
    position: 'end',
    rotate: 0,
		offset: 80
  }

  return (
    <>
      {
        data?.[0]?
        <Chart
          height={400}
          padding="auto"
          data={data}
          autoFit
          scale={scale}
        >
          <Axis
            name='value'
            title={chartUnit}
          />
          <Interval
            adjust={[
            {
                type: 'dodge',
                marginRatio: 0,
              },
            ]}
            color="reportName"
            position="cityName*value"
            label= {[
              'value',
              () => {
                return {
                  position: "middle",
                  style: {
                    fill: '#fff',
                    fontSize: 12
                  }
                }
              }
            ]}
          />
          <Tooltip shared />
          <Legend
            layout="horizontal"
            position="top-right"
            itemName={{
              style: {
                fontSize: 16
              }
            }}
          />
        </Chart>:
        <Empty/>
      }
    </>
  )
}

export default Histogram
