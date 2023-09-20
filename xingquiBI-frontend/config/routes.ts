export default [
  { path: '/user', layout: false, routes: [{ path: '/user/login', component: './User/Login' }] },
  {
    path: '/user',
    layout: false,
    routes: [{ path: '/user/register', component: './User/Register' }],
  },
  { path: '/', redirect: '/add_chart' },
  { path: '/add_chart', name: '智能分析', icon: 'AreaChartOutlined', component: './AddChart' },
  {
    path: '/add_chart_async',
    name: '智能分析（异步）',
    icon: 'AreaChartOutlined',
    component: './AddChartAsync',
  },
  {
    path: '/add_chart_async_mq',
    name: '智能分析（消息队列）',
    icon: 'AreaChartOutlined',
    component: './AddChartAsyncMq',
  },
  { path: '/my_chart', name: '我的图表', icon: 'TableOutlined', component: './MyChart' },
  {
    path: '/admin',
    icon: 'crown',
    access: 'canAdmin',
    routes: [
      { path: '/admin', redirect: '/admin/sub-page', name: '管理页' },
      { path: '/admin/sub-page', component: './Admin', name: '管理页2' },
    ],
  },
  { path: '/', redirect: '/welcome' },
  { path: '*', layout: false, component: './404' },
];
