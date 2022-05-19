import React from 'react';
import { RouteWatcher } from '@/components/antd-pro-page-tabs';
import { useIntl } from 'umi';

export default (props) => {
  const intl = useIntl();
  const { route,...rest } = props;
  let routeName = route.name;
  if (route.path) {
    routeName = intl.formatMessage({ id: `menu${route.path.replace(/\//g, '.')}` });
  }
  return <RouteWatcher {...rest} route={{ ...route, name: routeName}} />
}
