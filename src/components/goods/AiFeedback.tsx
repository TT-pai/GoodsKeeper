// src/components/goods/AiFeedback.tsx
import React from 'react';
import { Typography, Button, Space } from 'antd';
import { LikeOutlined, DislikeOutlined } from '@ant-design/icons';
import { GoodsCategory } from '@/types/goods';

const { Text } = Typography;

interface AiFeedbackProps {
  goodsId: string;
  aiCategory?: GoodsCategory;
  userCategory?: GoodsCategory;
  onFeedback: (isCorrect: boolean) => void;
}

export function AiFeedback({ goodsId, aiCategory, userCategory, onFeedback }: AiFeedbackProps) {
  if (!aiCategory) {
    return null;
  }

  const hasUserCorrected = userCategory && userCategory !== aiCategory;

  return (
    <div style={{ marginTop: '16px', padding: '12px', background: '#f5f5f5', borderRadius: '8px' }}>
      <Text>AI分类准确吗？</Text>
      <Space style={{ marginLeft: '12px' }}>
        <Button
          type={hasUserCorrected ? 'default' : 'primary'}
          icon={<LikeOutlined />}
          onClick={() => onFeedback(true)}
          size="small"
        >
          准确
        </Button>
        <Button
          type={hasUserCorrected ? 'primary' : 'default'}
          danger={hasUserCorrected}
          icon={<DislikeOutlined />}
          onClick={() => onFeedback(false)}
          size="small"
        >
          不准确
        </Button>
      </Space>
      {hasUserCorrected && (
        <Text type="secondary" style={{ marginLeft: '12px' }}>
          你已纠正为其他分类
        </Text>
      )}
    </div>
  );
}