// src/pages/Home.tsx
import React from 'react';
import { Button, Typography, Card, Row, Col } from 'antd';
import { RocketOutlined, RobotOutlined, SearchOutlined, ShareAltOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/common/Layout';

const { Title, Paragraph } = Typography;

export function Home() {
  const navigate = useNavigate();

  const features = [
    {
      icon: <RobotOutlined style={{ fontSize: '40px', color: '#1890ff' }} />,
      title: 'AI辅助输入',
      desc: '粘贴电商链接，一键提取商品信息'
    },
    {
      icon: <SearchOutlined style={{ fontSize: '40px', color: '#52c41a' }} />,
      title: '智能搜索',
      desc: '关键词、分类、标签多维度查找'
    },
    {
      icon: <ShareAltOutlined style={{ fontSize: '40px', color: '#faad14' }} />,
      title: '美观分享',
      desc: '一键生成分享卡片，分享给朋友'
    }
  ];

  return (
    <Layout>
      <div style={{ textAlign: 'center', padding: '40px 20px' }}>
        <Title level={1}>
          🎒 GoodsKeeper
        </Title>
        <Paragraph style={{ fontSize: '18px', color: '#666', marginBottom: '40px' }}>
          你的哆啦A梦好物口袋，装满心动宝藏
        </Paragraph>

        <Button
          type="primary"
          size="large"
          icon={<RocketOutlined />}
          onClick={() => navigate('/record')}
          style={{ marginBottom: '40px' }}
        >
          立即体验（无需注册）
        </Button>

        <Row gutter={[16, 16]} justify="center">
          {features.map(feature => (
            <Col span={8} key={feature.title}>
              <Card hoverable style={{ textAlign: 'center', padding: '20px' }}>
                <div style={{ marginBottom: '16px' }}>{feature.icon}</div>
                <Title level={4}>{feature.title}</Title>
                <Paragraph>{feature.desc}</Paragraph>
              </Card>
            </Col>
          ))}
        </Row>

        <Paragraph style={{ marginTop: '40px', color: '#999' }}>
          完全本地存储 · 隐私最优 · 零云服务成本
        </Paragraph>
      </div>
    </Layout>
  );
}