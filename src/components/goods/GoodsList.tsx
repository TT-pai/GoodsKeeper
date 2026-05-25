// src/components/goods/GoodsList.tsx
import React from 'react';
import { Row, Col, Empty } from 'antd';
import { GoodsCard } from './GoodsCard';
import { Goods } from '@/types/goods';

interface GoodsListProps {
  goods: Goods[];
  onItemClick: (id: string) => void;
}

export function GoodsList({ goods, onItemClick }: GoodsListProps) {
  if (goods.length === 0) {
    return (
      <Empty
        description="暂无好物"
        style={{ padding: '40px 0' }}
      />
    );
  }

  return (
    <Row gutter={[16, 16]}>
      {goods.map(item => (
        <Col span={8} key={item.id}>
          <GoodsCard goods={item} onClick={onItemClick} />
        </Col>
      ))}
    </Row>
  );
}