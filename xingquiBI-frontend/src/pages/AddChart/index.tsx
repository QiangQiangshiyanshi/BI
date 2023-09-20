import { genChartByBiUsingPOST } from '@/services/yupiBI/chartController';
import { UploadOutlined } from '@ant-design/icons';
import {
  Button,
  Divider,
  Form,
  Input,
  Select,
  Space,
  Upload,
  message,
  Card,
  Col,
  Row,
  Spin,
} from 'antd';
import TextArea from 'antd/es/input/TextArea';
import React, { useState } from 'react';
import ReactECharts from 'echarts-for-react';

/**
 * 添加图表页面
 * @constructor
 */
const Addchart: React.FC = () => {
  const [chart, setChart] = useState<API.BiResponse>();
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [option, setOption] = useState<any>(false);
  /**
   * 提交
   * @param values
   */
  const onFinish = async (values: any) => {
    // 避免重复提交
    if (submitting) {
      return;
    }
    setSubmitting(true);
    setChart(undefined);
    setOption(undefined);
    const params = {
      ...values,
      file: undefined,
    };
    try {
      const res = await genChartByBiUsingPOST(params, {}, values.file.file.originFileObj);
      if (!res?.data) {
        message.error('分析失败');
      } else {
        message.success('分析成功');
        const chartOption = JSON.parse(res.data.genChart ?? '');
        if (!chartOption) {
          throw new Error('图表代码解析异常');
        } else {
          setChart(res.data);
          setOption(chartOption);
        }
      }
    } catch (e: any) {
      message.error('分析失败' + e.message);
    }
    setSubmitting(false);
  };
  return (
    <div className={'add-chart'}>
      <Row gutter={24}>
        <Col span={12}>
          <Card title={'智能分析'}>
            <Form
              // 表单名称
              name="addChart"
              onFinish={onFinish}
              // initialValues初始化数据

              // 样式
              style={{ maxWidth: 600 }}
            >
              <Form.Item
                name="name"
                label="图表名称"
                rules={[{ required: true, message: '请输入图表名称' }]}
              >
                <Input placeholder={'例如：网站用户增长表'} />
              </Form.Item>
              <Form.Item
                name="chartType"
                label="图表类型"
                rules={[{ required: true, message: '请输入图表类型' }]}
              >
                <Select>
                  <option value="饼图">饼图</option>
                  <option value="环形图">环形图</option>
                  <option value="矩形树状图">矩形树状图</option>
                  <option value="柱形图">柱形图</option>
                  <option value="条形图">条形图</option>
                  <option value="词云">词云</option>
                </Select>
              </Form.Item>
              <Form.Item
                name="goal"
                label="分析目标"
                rules={[{ required: true, message: '请输入分析目标' }]}
              >
                <TextArea placeholder={'请输入分析诉求，例如分析网站的用户增长情况'} />
              </Form.Item>

              <Form.Item name="file" label="原始数据">
                <Upload name="file" maxCount={1}>
                  <Button icon={<UploadOutlined />}>上传CSV文件</Button>
                </Upload>
              </Form.Item>

              <Form.Item wrapperCol={{ span: 12, offset: 13 }}>
                <Space>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={submitting}
                    disabled={submitting}
                  >
                    提交
                  </Button>
                  <Button htmlType="reset">重置</Button>
                </Space>
              </Form.Item>
            </Form>
          </Card>
        </Col>
        <Col span={12}>
          <Card title={'分析结论'} hoverable={true}>
            {chart?.genResult ?? <div />}
            <Spin spinning={submitting} />
          </Card>
        </Col>
        <Divider orientationMargin="0" />
        <Col span={24}>
          <Card title={'可视化图表'} hoverable={true}>
            {option ? <ReactECharts option={option} /> : <div />}
            <Spin spinning={submitting} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};
export default Addchart;
