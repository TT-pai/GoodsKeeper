// src/components/common/Header.tsx
import React from 'react';
import { Layout, Menu, Button } from 'antd';
import { HomeOutlined, PlusOutlined, UnorderedListOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '@/hooks/useUser';

const { Header: AntHeader } = Layout;

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isTrial } = useUser();

  const menuItems = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: '首页'
    },
    {
      key: '/record',
      icon: <PlusOutlined />,
      label: '记录好物'
    },
    {
      key: '/goods',
      icon: <UnorderedListOutlined />,
      label: '我的好物'
    },
    {
      key: '/profile',
      icon: <UserOutlined />,
      label: '个人中心'
    }
  ];

  return (
    <AntHeader style={{ display: 'flex', alignItems: 'center', background: '#fff' }}>
      <div style={{ fontSize: '20px', fontWeight: 'bold', marginRight: '40px' }}>
        🎒 GoodsKeeper
      </div>
      <Menu
        mode="horizontal"
        selectedKeys={[location.pathname]}
        items={menuItems}
        onClick={({ key }) => navigate(key)}
        style={{ flex: 1, border: 'none' }}
      />
      {isTrial && (
        <div style={{ color: '#1890ff', marginRight: '10px' }}>
          体验模式
        </div>
      )}
      {user && (
        <div style={{ color: '#666' }}>
          {user.email}
        </div>
      )}
    </AntHeader>
  );
}