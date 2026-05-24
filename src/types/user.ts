// src/types/user.ts

import { GoodsCategory } from './goods';

export interface User {
  id: string;
  email: string;
  passwordHash: string; // bcrypt加密后的密码
  createdAt: number;
  lastLoginAt?: number;
  goodsCount: number; // 好物数量
  shareCount: number; // 分享次数
  recordFrequency: number; // 记录频率（每周）
  isTrial: boolean; // 是否为体验模式用户
  trialGoodsCount: number; // 体验期记录的好物数量（最多3个）
}

export interface UserStats {
  totalGoods: number;
  totalShares: number;
  weeklyRecordCount: number;
  aiUsageRate: number; // AI使用率
  avgRating: number; // 平均评分
  topCategories: GoodsCategory[]; // 最常记录的分类
  highFrequencyGoods: string[]; // 高频分享的好物ID列表
}