// src/components/stats/StatsPanel.tsx
import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Typography, Divider } from 'antd';
import { FileTextOutlined, ShareAltOutlined, RobotOutlined } from '@ant-design/icons';
import { useGoods } from '@/hooks/useGoods';
import { useUser } from '@/hooks/useUser';
import { storageService } from '@/utils/storage';
import { AiPerformanceStats } from '@/types/stats';

const { Title } = Typography;

export function StatsPanel() {
  const [aiStats, setAiStats] = useState<AiPerformanceStats>({
    classificationAccuracy: 0,
    thumbsUpCount: 0,
    thumbsDownCount: 0,
    extractionSuccessRate: 0,
    totalAiCalls: 0
  });
  const { goods } = useGoods();
  const { user } = useUser();

  useEffect(() => {
    loadAiStats();
  }, []);

  const loadAiStats = async () => {
    const stats = await storageService.getAiPerformanceStats();
    setAiStats(stats);
  };

  const totalGoods = goods.length;
  const totalShares = goods.reduce((sum, g) => sum + g.shareCount, 0);
  const avgRating = goods.length > 0
    ? goods.reduce((sum, g) => sum + g.rating, 0) / goods.length
    : 0;

  return (
    <Card>
      <Title level={4}>你的好物口袋统计</Title>
      <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
        <Col span={6}>
          <Statistic
            title="记录好物"
            value={totalGoods}
            prefix={<FileTextOutlined />}
          />
        </Col>
        <Col span={6}>
          <Statistic
            title="分享次数"
            value={totalShares}
            prefix={<ShareAltOutlined />}
          />
        </Col>
        <Col span={6}>
          <Statistic
            title="平均评分"
            value={avgRating.toFixed(1)}
            suffix="星"
          />
        </Col>
        <Col span={6}>
          <Statistic
            title="AI使用率"
            value={goods.filter(g => g.aiClassified).length}
            suffix={`/ ${totalGoods}`}
            prefix={<RobotOutlined />}
          />
        </Col>
      </Row>

      <Divider style={{ marginTop: '24px' }} />

      <Title level={4}>AI效果统计</Title>
      <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
        <Col span={8}>
          <Statistic
            title="分类准确率"
            value={aiStats.classificationAccuracy.toFixed(1)}
            suffix="%"
          />
        </Col>
        <Col span={8}>
          <Statistic
            title="点赞次数"
            value={aiStats.thumbsUpCount}
          />
        </Col>
        <Col span={8}>
          <Statistic
            title="点踩次数"
            value={aiStats.thumbsDownCount}
          />
        </Col>
      </Row>
    </Card>
  );
}