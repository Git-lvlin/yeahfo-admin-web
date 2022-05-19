import React from 'react'
import { 
  Chart, 
  Line, 
  Point, 
  Tooltip, 
  Legend,
  Axis
} from 'bizcharts'
import { Empty } from 'antd'

const LineChart = ({
  data,
  scale
}) => {

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
          scale={scale}
          autoFit
          height={440}
          data={data}
          interactions={['element-active']}
          forceUpdate
        >
          <Axis
            name='value'
            title={chartUnit}
          />
          <Point
            position="dateTime*value"
            color="reportName"
            shape='circle' 
          />
          <Line 
            shape="line"
            position="dateTime*value"
            color="reportName"
          />
          <Tooltip
            shared
            showCrosshairs
          />
          <Legend
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

export default LineChart
