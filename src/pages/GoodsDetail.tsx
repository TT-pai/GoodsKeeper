// src/pages/GoodsDetail.tsx
import React, { useState, useEffect } from 'react';
import { Card, Typography, Button, Rate, Tag, Select, message, Divider } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeftOutlined, ShareAltOutlined, DeleteOutlined } from '@ant-design/icons';
import { Layout } from '@/components/common/Layout';
import { AiFeedback } from '@/components/goods/AiFeedback';
import { useGoods } from '@/hooks/useGoods';
import { storageService } from '@/utils/storage';
import { Goods, GoodsCategory, CATEGORY_LABELS, CATEGORY_ICONS } from '@/types/goods';

const { Title, Text, Paragraph } = Typography;

export function GoodsDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [goods, setGoods] = useState<Goods | null>(null);
  const { updateGoods, deleteGoods, loadGoods } = useGoods();

  useEffect(() => {
    loadGoodsDetail();
  }, [id]);

  const loadGoodsDetail = async () => {
    if (id) {
      const goodsData = await storageService.getGoodsById(id);
      setGoods(goodsData || null);
    }
  };

  const handleCategoryChange = async (category: GoodsCategory) => {
    if (goods) {
      await updateGoods(goods.id, {
        category,
        userCorrected: goods.aiClassified && category !== goods.category
      });
      message.success('分类已更新');
      await loadGoodsDetail();
    }
  };

  const handleRatingChange = async (rating: number) => {
    if (goods) {
      await updateGoods(goods.id, { rating });
      message.success('评分已更新');
      await loadGoodsDetail();
    }
  };

  const handleAiFeedback = async (isCorrect: boolean) => {
    if (goods) {
      await storageService.saveAiFeedback({
        goodsId: goods.id,
        aiCategory: goods.category,
        userCategory: goods.category,
        isCorrect
      });
      message.success('感谢你的反馈！这会帮助AI变得更准确');
    }
  };

  const handleDelete = async () => {
    if (goods) {
      await deleteGoods(goods.id);
      message.success('好物已删除');
      navigate('/goods');
    }
  };

  const handleShare = () => {
    navigate(`/share/${id}`);
  };

  if (!goods) {
    return (
      <Layout>
        <Card>
          <Text>好物不存在或已删除</Text>
          <Button onClick={() => navigate('/goods')} style={{ marginTop: '16px' }}>
            返回列表
          </Button>
        </Card>
      </Layout>
    );
  }

  return (
    <Layout>
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate('/goods')}
        style={{ marginBottom: '16px' }}
      >
        返回列表
      </Button>

      <Card>
        {goods.image && (
          <img
            src={goods.image}
            alt={goods.name}
            style={{ width: '100%', maxHeight: '400px', objectFit: 'cover', borderRadius: '8px' }}
          />
        )}

        <Title level={2} style={{ marginTop: '16px' }}>
          {goods.name}
        </Title>

        {goods.brand && (
          <Text type="secondary" style={{ fontSize: '16px' }}>
            品牌: {goods.brand}
          </Text>
        )}

        {goods.price && (
          <div style={{ marginTop: '16px' }}>
            <Text style={{ fontSize: '24px', color: '#ff4d4f', fontWeight: 'bold' }}>
              ¥{goods.price}
            </Text>
          </div>
        )}

        <Divider />

        <div style={{ marginBottom: '16px' }}>
          <Text strong>分类:</Text>
          <Select
            value={goods.category}
            onChange={handleCategoryChange}
            style={{ marginLeft: '12px', width: '200px' }}
          >
            {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
              <Select.Option key={key} value={key}>
                {CATEGORY_ICONS[key as GoodsCategory]} {label}
              </Select.Option>
            ))}
          </Select>
          {goods.aiClassified && <Tag color="green" style={{ marginLeft: '12px' }}>🤖 AI分类</Tag>}
        </div>

        <AiFeedback
          goodsId={goods.id}
          aiCategory={goods.category}
          userCategory={goods.userCorrected ? goods.category : undefined}
          onFeedback={handleAiFeedback}
        />

        <div style={{ marginTop: '16px' }}>
          <Text strong>评分:</Text>
          <Rate
            value={goods.rating}
            onChange={handleRatingChange}
            style={{ marginLeft: '12px' }}
          />
        </div>

        {goods.tags.length > 0 && (
          <div style={{ marginTop: '16px' }}>
            <Text strong>标签:</Text>
            <div style={{ marginTop: '8px' }}>
              {goods.tags.map(tag => (
                <Tag key={tag} style={{ marginBottom: '4px' }}>{tag}</Tag>
              ))}
            </div>
          </div>
        )}

        {goods.notes && (
          <div style={{ marginTop: '16px' }}>
            <Text strong>备注:</Text>
            <Paragraph style={{ marginTop: '8px', background: '#f5f5f5', padding: '12px', borderRadius: '8px' }}>
              {goods.notes}
            </Paragraph>
          </div>
        )}

        {goods.link && (
          <div style={{ marginTop: '16px' }}>
            <Text strong>购买链接:</Text>
            <a href={goods.link} target="_blank" rel="noopener noreferrer" style={{ marginLeft: '12px' }}>
              点击购买
            </a>
          </div>
        )}

        <Divider />

        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
            type="primary"
            icon={<ShareAltOutlined />}
            onClick={handleShare}
          >
            生成分享卡片
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={handleDelete}
          >
            删除
          </Button>
        </div>

        <Text type="secondary" style={{ marginTop: '16px', display: 'block' }}>
          创建时间: {new Date(goods.createdAt).toLocaleDateString()}
          {goods.shareCount > 0 && ` · 已分享${goods.shareCount}次`}
        </Text>
      </Card>
    </Layout>
  );
}