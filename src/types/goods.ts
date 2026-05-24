// src/types/goods.ts

export interface Goods {
  id: string;
  name: string;
  brand?: string;
  price?: number;
  link?: string;
  image?: string;
  platform?: 'taobao' | 'jd' | 'pdd' | 'other';
  category: GoodsCategory;
  tags: string[];
  rating: number; // 1-5星
  notes?: string; // 用户备注
  createdAt: number; // timestamp
  updatedAt: number; // timestamp
  shareCount: number; // 分享次数
  aiClassified: boolean; // 是否由AI分类
  userCorrected?: boolean; // 用户是否纠正过AI分类
}

export type GoodsCategory =
  | 'digital'      // 数码产品
  | 'home'         // 家居生活
  | 'clothing'     // 服饰鞋包
  | 'food'         // 美食零食
  | 'entertainment' // 娱乐休闲
  | 'personal'     // 个人护理
  | 'other';       // 其他

export const CATEGORY_LABELS: Record<GoodsCategory, string> = {
  digital: '数码产品',
  home: '家居生活',
  clothing: '服饰鞋包',
  food: '美食零食',
  entertainment: '娱乐休闲',
  personal: '个人护理',
  other: '其他'
};

export const CATEGORY_ICONS: Record<GoodsCategory, string> = {
  digital: '📱',
  home: '🏠',
  clothing: '👕',
  food: '🍜',
  entertainment: '🎮',
  personal: '🧴',
  other: '🚗'
};