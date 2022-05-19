import React, { useState } from 'react';
import Export from '@/pages/export-excel/export'
import ExportHistory from '@/pages/export-excel/export-history'
import { PageContainer } from '@/components/PageContainer';

const Detail = () => {
  const [visit, setVisit] = useState(false)

  return (
    <PageContainer>
      <Export
        change={(e) => { setVisit(e) }}
        type='member_shop_verify_status_paid_or_refused'
        // conditions={getFieldValue}
        text="导出已缴保证金或不通过社区店"
      />,
      <ExportHistory show={visit} setShow={setVisit} type='member_shop_verify_status_paid_or_refused' />
    </PageContainer>
  )
}

export default Detail;
