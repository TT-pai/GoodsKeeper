// src/pages/Record.tsx
import React, { useState, useEffect } from 'react';
import { Card, Typography, Modal, Form, Input, Button, message } from 'antd';
import { Layout } from '@/components/common/Layout';
import { GoodsForm } from '@/components/goods/GoodsForm';
import { useGoods } from '@/hooks/useGoods';
import { useUser } from '@/hooks/useUser';
import { Goods } from '@/types/goods';

const { Title, Paragraph } = Typography;

export function Record() {
  const [trialGoodsCount, setTrialGoodsCount] = useState(0);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const { addGoods, goods } = useGoods();
  const { user, isTrial, register, updateTrialGoodsCount } = useUser();

  useEffect(() => {
    // 计算体验期记录的好物数量
    const trialGoods = goods.filter(g =>
      user && g.createdAt > user.createdAt
    );
    setTrialGoodsCount(trialGoods.length);
  }, [goods, user]);

  const handleSubmit = async (goodsData: Partial<Goods>) => {
    // 体验模式：最多记录3个好物
    if (isTrial && trialGoodsCount >= 3) {
      setShowRegisterModal(true);
      return;
    }

    try {
      await addGoods(goodsData);
      message.success('好物已记录！');

      if (isTrial) {
        const newCount = trialGoodsCount + 1;
        setTrialGoodsCount(newCount);
        updateTrialGoodsCount(newCount);

        if (newCount >= 3) {
          setShowRegisterModal(true);
        }
      }
    } catch (error: any) {
      message.error('记录失败：' + error.message);
    }
  };

  const handleRegister = (values: { email: string; password: string }) => {
    register(values.email, values.password);
    setShowRegisterModal(false);
    message.success('注册成功！你的好物口袋已保存');
  };

  return (
    <Layout>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        {isTrial && (
          <Card style={{ marginBottom: '16px', background: '#e6f7ff' }}>
            <Paragraph>
              体验模式：你还可以记录 {3 - trialGoodsCount} 个好物
            </Paragraph>
          </Card>
        )}

        <Card>
          <Title level={3}>记录好物</Title>
          <Paragraph style={{ color: '#666', marginBottom: '24px' }}>
            粘贴商品链接，让AI帮你一键提取信息
          </Paragraph>

          <GoodsForm onSubmit={handleSubmit} />
        </Card>
      </div>

      <Modal
        title="注册保存你的好物口袋"
        open={showRegisterModal}
        onCancel={() => setShowRegisterModal(false)}
        footer={null}
      >
        <Paragraph style={{ marginBottom: '16px' }}>
          你已记录3个好物！注册登录保存你的好物口袋
        </Paragraph>
        <Form onFinish={handleRegister}>
          <Form.Item
            name="email"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '邮箱格式不正确' }
            ]}
          >
            <Input placeholder="邮箱地址" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              { required: true, message: '请输入密码' },
              { min: 6, message: '密码至少6位' }
            ]}
          >
            <Input.Password placeholder="密码（至少6位）" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              注册（仅需10秒）
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
}