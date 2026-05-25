// src/components/goods/CategoryFilter.tsx
import React from 'react';
import { Radio } from 'antd';
import { GoodsCategory, CATEGORY_LABELS, CATEGORY_ICONS } from '@/types/goods';

interface CategoryFilterProps {
  selectedCategory?: GoodsCategory | 'all';
  onChange: (category: GoodsCategory | 'all') => void;
}

export function CategoryFilter({ selectedCategory = 'all', onChange }: CategoryFilterProps) {
  const categories: (GoodsCategory | 'all')[] = [
    'all',
    'digital',
    'home',
    'clothing',
    'food',
    'entertainment',
    'personal',
    'other'
  ];

  return (
    <Radio.Group
      value={selectedCategory}
      onChange={(e) => onChange(e.target.value)}
      buttonStyle="solid"
    >
      {categories.map(cat => (
        <Radio.Button key={cat} value={cat}>
          {cat === 'all' ? '全部' : `${CATEGORY_ICONS[cat]} ${CATEGORY_LABELS[cat]}`}
        </Radio.Button>
      ))}
    </Radio.Group>
  );
}