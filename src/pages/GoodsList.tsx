// src/pages/GoodsList.tsx
import React, { useState, useEffect } from 'react';
import { Card, Typography, Spin } from 'antd';
import { Layout } from '@/components/common/Layout';
import { GoodsList } from '@/components/goods/GoodsList';
import { SearchBar } from '@/components/goods/SearchBar';
import { CategoryFilter } from '@/components/goods/CategoryFilter';
import { useGoods } from '@/hooks/useGoods';
import { useNavigate } from 'react-router-dom';
import { GoodsCategory, Goods } from '@/types/goods';

const { Title } = Typography;

export function GoodsListPage() {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<GoodsCategory | 'all'>('all');
  const [filteredGoods, setFilteredGoods] = useState<Goods[]>([]);

  const { goods, loading, searchGoods, getGoodsByCategory } = useGoods();
  const navigate = useNavigate();

  useEffect(() => {
    filterGoods();
  }, [goods, searchKeyword, selectedCategory]);

  const filterGoods = async () => {
    let result = goods;

    // 关键词搜索
    if (searchKeyword) {
      result = await searchGoods(searchKeyword);
    }

    // 分类筛选
    if (selectedCategory !== 'all') {
      result = result.filter(g => g.category === selectedCategory);
    }

    setFilteredGoods(result);
  };

  const handleItemClick = (id: string) => {
    navigate(`/goods/${id}`);
  };

  return (
    <Layout>
      <Title level={2}>我的好物口袋</Title>

      <Card style={{ marginBottom: '16px' }}>
        <SearchBar onSearch={setSearchKeyword} />
        <div style={{ marginTop: '16px' }}>
          <CategoryFilter
            selectedCategory={selectedCategory}
            onChange={setSelectedCategory}
          />
        </div>
      </Card>

      {loading ? (
        <Spin size="large" style={{ display: 'block', margin: '40px auto' }} />
      ) : (
        <GoodsList goods={filteredGoods} onItemClick={handleItemClick} />
      )}
    </Layout>
  );
}

// 导出为GoodsList以匹配路由
export { GoodsListPage as GoodsList };