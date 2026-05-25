// src/components/goods/GoodsCard.tsx
import React, { useState } from 'react';
import { Card, Rate, Tag, Typography, Skeleton } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { Goods, CATEGORY_LABELS, CATEGORY_ICONS } from '@/types/goods';

const { Text } = Typography;

interface GoodsCardProps {
  goods: Goods;
  onClick: (id: string) => void;
}

export function GoodsCard({ goods, onClick }: GoodsCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <Card
      hoverable
      style={{ marginBottom: '16px' }}
      onClick={() => onClick(goods.id)}
      cover={
        goods.image && (
          <div style={{ height: '200px', overflow: 'hidden', position: 'relative' }}>
            {!imageLoaded && (
              <Skeleton.Image
                active
                style={{ width: '100%', height: '200px', position: 'absolute', top: 0 }}
              />
            )}
            <img
              alt={goods.name}
              src={goods.image}
              style={{
                height: '200px',
                width: '100%',
                objectFit: 'cover',
                opacity: imageLoaded ? 1 : 0,
                transition: 'opacity 0.3s'
              }}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageLoaded(true)} // 即使加载失败也显示占位
            />
          </div>
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