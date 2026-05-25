// src/hooks/useAI.ts
import { useState } from 'react';
import { aiService } from '@/utils/aiService';
import { AiExtractResult, AiClassifyResult } from '@/types/ai';

export function useAI() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const extractGoodsInfo = async (link: string): Promise<AiExtractResult> => {
    setLoading(true);
    setError(null);
    try {
      const result = await aiService.extractGoodsInfo(link);
      setLoading(false);
      return result;
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
      return { success: false, error: err.message, method: 'link' };
    }
  };

  const classifyGoods = async (name: string, brand?: string): Promise<AiClassifyResult> => {
    setLoading(true);
    setError(null);
    try {
      const result = await aiService.classifyGoods(name, brand);
      setLoading(false);
      return result;
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
      return { success: false, error: err.message, confidence: 0 };
    }
  };

  const setApiKey = (key: string) => {
    aiService.setApiKey(key);
  };

  return {
    loading,
    error,
    extractGoodsInfo,
    classifyGoods,
    setApiKey
  };
}