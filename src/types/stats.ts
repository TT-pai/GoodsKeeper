// src/types/stats.ts

export interface DailyStats {
  date: string; // YYYY-MM-DD
  recordCount: number;
  shareCount: number;
  searchCount: number;
  aiUsageCount: number;
}

export interface WeeklyStats {
  weekStart: string; // YYYY-MM-DD
  weekEnd: string;
  totalRecords: number;
  totalShares: number;
  totalSearches: number;
  avgAiUsageRate: number;
}

export interface AiPerformanceStats {
  classificationAccuracy: number; // AI分类准确率（点赞率）
  extractionSuccessRate: number; // 信息提取成功率
  totalAiCalls: number;
  thumbsUpCount: number;
  thumbsDownCount: number;
}