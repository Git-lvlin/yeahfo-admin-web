import React from 'react'
import { PageContainer } from '@/components/PageContainer';

import IndicatorsCard from './indicators-card'
import RealTime from './real-time'
import DataOverview from './data-overview'
import DailyDataOverview from './daily-data-overview'

const SummaryOfData = () => {

  return (
    <PageContainer title={false}>
      <RealTime />
      <IndicatorsCard />
      <DataOverview />
      <DailyDataOverview />
    </PageContainer>
  )
}

export default SummaryOfData
