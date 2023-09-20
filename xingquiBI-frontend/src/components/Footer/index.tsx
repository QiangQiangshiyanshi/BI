import { DefaultFooter } from '@ant-design/pro-components';
import '@umijs/max';
import React from 'react';
const Footer: React.FC = () => {
  const defaultMessage = '神奇的海绵宝宝技术出品';
  const currentYear = new Date().getFullYear();
  return (
    <DefaultFooter
      style={{
        background: 'none',
      }}
      copyright={`${currentYear} ${defaultMessage}`}
      links={[
        {
          key: 'Bing',
          title: 'Bing',
          href: 'https://cn.bing.com/',
          blankTarget: true,
        },
      ]}
    />
  );
};
export default Footer;
