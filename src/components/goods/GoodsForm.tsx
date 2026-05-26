// src/components/goods/GoodsForm.tsx
import React, { useState } from 'react';
import { Form, Input, Button, Select, Rate, message } from 'antd';
import { LinkOutlined, RobotOutlined } from '@ant-design/icons';
import { Goods, GoodsCategory, CATEGORY_LABELS } from '@/types/goods';
import { useAI } from '@/hooks/useAI';

interface GoodsFormProps {
  onSubmit: (goods: Partial<Goods>) => void;
  initialValues?: Partial<Goods>;
}

export function GoodsForm({ onSubmit, initialValues }: GoodsFormProps) {
  const [form] = Form.useForm();
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestedCategory, setAiSuggestedCategory] = useState<GoodsCategory | null>(null);
  const [aiSuggestedTags, setAiSuggestedTags] = useState<string[]>([]);
  const { extractGoodsInfo, classifyGoods } = useAI();

  const handleLinkExtract = async () => {
    const link = form.getFieldValue('link');
    if (!link) {
      message.warning('请先输入商品链接');
      return;
    }

    setAiLoading(true);
    try {
      console.log('开始调用extractGoodsInfo...');
      const extractResult = await extractGoodsInfo(link);
      console.log('extractGoodsInfo返回结果:', extractResult);

      if (extractResult.success && extractResult.data) {
        console.log('准备填充表单:', extractResult.data);

        form.setFieldsValue({
          name: extractResult.data.name,
          brand: extractResult.data.brand,
          price: extractResult.data.price,
          image: extractResult.data.image
        });

        console.log('表单填充后的值:', form.getFieldsValue());

        const classifyResult = await classifyGoods(
          extractResult.data.name,
          extractResult.data.brand
        );

        console.log('classifyGoods返回结果:', classifyResult);

        if (classifyResult.success && classifyResult.category) {
          setAiSuggestedCategory(classifyResult.category);
          setAiSuggestedTags(classifyResult.tags || []);
          message.success('AI已提取信息并智能分类！');
        }
      } else {
        message.error(extractResult.error || '提取失败，请手动输入');
      }
    } catch (error: any) {
      console.error('handleLinkExtract错误:', error);
      message.error(error.message);
    }
    setAiLoading(false);
  };

  const handleSubmit = (values: any) => {
    const goodsData: Partial<Goods> = {
      ...values,
      category: aiSuggestedCategory || values.category,
      tags: aiSuggestedTags.length > 0 ? aiSuggestedTags : values.tags,
      aiClassified: aiSuggestedCategory !== null
    };
    onSubmit(goodsData);
    form.resetFields();
    setAiSuggestedCategory(null);
    setAiSuggestedTags([]);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialValues}
      onFinish={handleSubmit}
    >
      <Form.Item label="商品链接" name="link">
        <Input
          placeholder="粘贴淘宝/京东/拼多多链接"
          prefix={<LinkOutlined />}
          addonAfter={
            <Button
              type="link"
              icon={<RobotOutlined />}
              loading={aiLoading}
              onClick={handleLinkExtract}
            >
              AI提取
            </Button>
          }
        />
      </Form.Item>

      <Form.Item
        label="商品名称"
        name="name"
        rules={[{ required: true, message: '请输入商品名称' }]}
      >
        <Input placeholder="商品名称" />
      </Form.Item>

      <Form.Item label="品牌" name="brand">
        <Input placeholder="品牌名称（可选）" />
      </Form.Item>

      <Form.Item label="价格" name="price">
        <Input type="number" placeholder="价格（可选）" />
      </Form.Item>

      <Form.Item label="分类" name="category">
        <Select placeholder="选择分类">
          {aiSuggestedCategory && (
            <Select.Option value={aiSuggestedCategory}>
              🤖 AI推荐: {CATEGORY_LABELS[aiSuggestedCategory]}
            </Select.Option>
          )}
          {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
            <Select.Option key={key} value={key}>
              {label}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item label="评分" name="rating" initialValue={5}>
        <Rate />
      </Form.Item>

      <Form.Item label="备注" name="notes">
        <Input.TextArea placeholder="使用感受、备注（可选）" rows={3} />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" block>
          保存好物
        </Button>
      </Form.Item>
    </Form>
  );
}