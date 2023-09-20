import React, { useEffect, useState } from 'react';
import { listChartByPageUsingPOST } from '@/services/yupiBI/chartController';
import { Avatar, Button, Card, Divider, List, message, Result } from 'antd';
import ReactECharts from 'echarts-for-react';
import Search from 'antd/es/input/Search';

/**
 * 获取图表页面
 * @constructor
 */
const MyChartPage: React.FC = () => {
  const initSearchParams = {
    pageSize: 12,
    sortField: 'createTime',
    sortOrder: 'desc',
  };
  // 初始条件12
  const [searchParams, setSearchParams] = useState<API.ChartQueryRequest>({ ...initSearchParams });
  const [chartList, setChartList] = useState<API.Chart[]>();
  const [total, setTotal] = useState<number>(0);
  const [loading, setloading] = useState<boolean>(true);
  const onSearch = (value: string) => {
    setSearchParams({ ...initSearchParams, name: value });
  };
  const loadData = async () => {
    setloading(true);
    try {
      const res = await listChartByPageUsingPOST(searchParams);
      if (res.data) {
        setChartList(res.data.records ?? []);
        setTotal(res.data.total ?? 0);
        if (res.data.records) {
          res.data.records.forEach((data) => {
            if (data.status === 'success') {
              const chartOptions = JSON.parse(data.genChart ?? '{}');
              chartOptions.title = undefined;
              data.genChart = JSON.stringify(chartOptions);
            }
          });
        } else {
          message.error('图表为空');
        }
      }
    } catch (e: any) {
      message.error('获取我的图表失败' + e.message);
    }
    setloading(false);
  };
  useEffect(() => {
    loadData();
  }, [searchParams]);
  const gridStyle: React.CSSProperties = {
    width: 'auto',
    textAlign: 'left',
  };
  const gridStyle1: React.CSSProperties = {
    textAlign: 'right',
  };

  return (
    <Card title={'数据展示'}>
      <div className={'my-chart-page'}>
        <Search
          placeholder="请输入图标名称"
          allowClear
          loading={loading}
          enterButton
          onSearch={onSearch}
        />
        <Divider orientationMargin="0" />
        <List
          grid={{
            gutter: 16,
            xs: 1,
            sm: 1,
            md: 1,
            lg: 2,
            xl: 2,
            xxl: 2,
          }}
          size="large"
          pagination={{
            onChange: (page) => {
              console.log(page);
            },
            pageSize: 4,
          }}
          dataSource={chartList}
          footer={
            <div>
              <b>总数：</b>
              {total}
            </div>
          }
          renderItem={(item) => (
            <Card.Grid style={gridStyle}>
              <List.Item key={item.id}>
                <List.Item.Meta
                  avatar={
                    <Avatar src={'https://xsgames.co/randomusers/avatar.php?g=pixel&key=6'} />
                  } //头像
                  title={item.name}
                  description={item.charType ? '图表类型：' + item.charType : undefined}
                />
                <>
                  {item.status === 'success' && (
                    <>
                      {item.genResult ? '结论：' + item.genResult : undefined}
                      <br />
                      <div style={{ marginBottom: 16 }} />
                      <List.Item.Meta style={gridStyle1} description={'分析目标：' + item.goal} />
                      <br />
                      <div style={{ marginBottom: 16 }} />
                      <Card>
                        <ReactECharts option={JSON.parse(item.genChart ?? '{}')} />
                      </Card>
                    </>
                  )}
                  {item.status === 'wait' && (
                    <>
                      <Result
                        status="warning"
                        title="图表生成中"
                        subTitle={item.execMessage ?? '目前系统繁忙，请耐心等待'}
                      />
                    </>
                  )}
                  {item.status === 'running' && (
                    <>
                      <Result status="info" title="图表生成中" subTitle={item.execMessage} />
                    </>
                  )}
                  {item.status === 'failed' && (
                    <>
                      <Result status="error" title="生成图标失败" subTitle={item.execMessage} />
                    </>
                  )}
                </>
              </List.Item>
            </Card.Grid>
          )}
        />
      </div>
    </Card>
  );
};

export default MyChartPage;
