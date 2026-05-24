// src/components/common/Layout.tsx
import React from 'react';
import { Layout as AntLayout } from 'antd';
import { Header } from './Header';

const { Content, Footer } = AntLayout;

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AntLayout style={{ minHeight: '100vh' }}>
      <Header />
      <Content style={{ padding: '20px 50px', background: '#f0f2f5' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {children}
        </div>
      </Content>
      <Footer style={{ textAlign: 'center', background: '#fff' }}>
        GoodsKeeper ©2026 - 你的好物口袋，装满心动宝藏
      </Footer>
    </AntLayout>
  );
}