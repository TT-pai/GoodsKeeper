// src/components/goods/SearchBar.tsx
import React from 'react';
import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

interface SearchBarProps {
  onSearch: (keyword: string) => void;
  placeholder?: string;
}

export function SearchBar({ onSearch, placeholder = '搜索好物名称、品牌、标签...' }: SearchBarProps) {
  return (
    <Input
      placeholder={placeholder}
      prefix={<SearchOutlined />}
      onChange={(e) => onSearch(e.target.value)}
      allowClear
      size="large"
    />
  );
}