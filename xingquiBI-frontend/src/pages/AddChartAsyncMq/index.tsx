import {
  genChartByBiAsyncMqUsingPOST,
  genChartByBiAsyncUsingPOST,
  genChartByBiUsingPOST,
} from '@/services/yupiBI/chartController';
import { UploadOutlined } from '@ant-design/icons';
import { Button, Card, Col, Form, Input, message, Row, Select, Space, Upload } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import React, { useState } from 'react';
import { useForm } from 'antd/lib/form/Form';

/**
 * 添加图表页面（异步）
 * @constructor
 */
const AddchartAsync: React.FC = () => {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [from] = useForm();
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
    const params = {
      ...values,
      file: undefined,
    };
    try {
      const res = await genChartByBiAsyncMqUsingPOST(params, {}, values.file.file.originFileObj);
      if (!res?.data) {
        message.error('分析失败');
      } else {
        message.success('分析任务提交成功，稍后请在我的图表中查看');
        from.resetFields();
      }
    } catch (e: any) {
      message.error('分析失败' + e.message);
    }
    setSubmitting(false);
  };
  return (
    <div className={'add-chart-async'}>
      <Row gutter={24}>
        <Col span={12}>
          <Card title={'智能分析(异步)'}>
            <Form
              // 表单名称
              form={from}
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
      </Row>
    </div>
  );
};
export default AddchartAsync;
