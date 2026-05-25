// src/components/goods/GoodsCard.tsx
import React from 'react';
import { Card, Rate, Tag, Typography } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { Goods, CATEGORY_LABELS, CATEGORY_ICONS } from '@/types/goods';

const { Text } = Typography;

interface GoodsCardProps {
  goods: Goods;
  onClick: (id: string) => void;
}

export function GoodsCard({ goods, onClick }: GoodsCardProps) {
  return (
    <Card
      hoverable
      style={{ marginBottom: '16px' }}
      onClick={() => onClick(goods.id)}
      cover={
        goods.image && (
          <img
            alt={goods.name}
            src={goods.image}
            style={{ height: '200px', objectFit: 'cover' }}
          />
        )
      }
      actions={[
        <EyeOutlined key="view" onClick={() => onClick(goods.id)} />
      ]}
    >
      <Card.Meta
        title={
          <div>
            <Text strong>{goods.name}</Text>
            {goods.brand && (
              <Text type="secondary" style={{ marginLeft: '8px' }}>
                {goods.brand}
              </Text>
            )}
          </div>
        }
        description={
          <div>
            <div style={{ marginBottom: '8px' }}>
              <Tag color="blue">
                {CATEGORY_ICONS[goods.category]} {CATEGORY_LABELS[goods.category]}
              </Tag>
              {goods.aiClassified && <Tag color="green">🤖 AI分类</Tag>}
            </div>
            {goods.price && (
              <Text style={{ fontSize: '16px', color: '#ff4d4f', fontWeight: 'bold' }}>
                ¥{goods.price}
              </Text>
            )}
            <div style={{ marginTop: '8px' }}>
              <Rate disabled defaultValue={goods.rating} style={{ fontSize: '12px' }} />
            </div>
            {goods.tags.length > 0 && (
              <div style={{ marginTop: '8px' }}>
                {goods.tags.map(tag => (
                  <Tag key={tag} style={{ marginBottom: '4px' }}>{tag}</Tag>
                ))}
              </div>
            )}
          </div>
        }
      />
    </Card>
  );
}