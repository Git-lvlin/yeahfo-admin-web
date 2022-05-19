import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import type { PageContainerProps } from '@ant-design/pro-layout';

const PageContaine: React.FC<PageContainerProps> = ({ children, ...rest }) => {
  return (
    <PageContainer
      header={{
        title: false
      }}
      {...rest}
    >
      {children}
    </PageContainer>
  )
}

export default PageContaine;
