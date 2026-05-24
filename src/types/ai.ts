// src/types/ai.ts

import { GoodsCategory } from './goods';

export interface AiExtractResult {
  success: boolean;
  data?: {
    name: string;
    brand?: string;
    price?: number;
    image?: string;
    platform?: string;
  };
  error?: string;
  method: 'link' | 'image' | 'manual'; // 提取方式
}

export interface AiClassifyResult {
  success: boolean;
  category?: GoodsCategory;
  tags?: string[];
  confidence: number; // 0-1置信度
  error?: string;
}

export interface AiFeedback {
  goodsId: string;
  aiCategory?: GoodsCategory;
  userCategory: GoodsCategory;
  isCorrect: boolean; // 用户点赞/点踩
  timestamp: number;
}