// src/hooks/useGoods.ts
import { useState, useEffect } from 'react';
import { Goods, GoodsCategory } from '@/types/goods';
import { storageService } from '@/utils/storage';
import { v4 as uuidv4 } from 'uuid';

export function useGoods() {
  const [goods, setGoods] = useState<Goods[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadGoods();
  }, []);

  const loadGoods = async () => {
    setLoading(true);
    const allGoods = await storageService.getAllGoods();
    setGoods(allGoods);
    setLoading(false);
  };

  const addGoods = async (goodsData: Partial<Goods>): Promise<Goods> => {
    const newGoods: Goods = {
      id: uuidv4(),
      name: goodsData.name || '',
      brand: goodsData.brand,
      price: goodsData.price,
      link: goodsData.link,
      image: goodsData.image,
      platform: goodsData.platform,
      category: goodsData.category || 'other',
      tags: goodsData.tags || [],
      rating: goodsData.rating || 5,
      notes: goodsData.notes,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      shareCount: 0,
      aiClassified: goodsData.aiClassified || false,
      userCorrected: goodsData.userCorrected
    };

    await storageService.saveGoods(newGoods);
    await loadGoods();
    return newGoods;
  };

  const updateGoods = async (id: string, updates: Partial<Goods>): Promise<void> => {
    await storageService.updateGoods(id, updates);
    await loadGoods();
  };

  const deleteGoods = async (id: string): Promise<void> => {
    await storageService.deleteGoods(id);
    await loadGoods();
  };

  const searchGoods = async (keyword: string): Promise<Goods[]> => {
    return await storageService.searchGoods(keyword);
  };

  const getGoodsByCategory = async (category: GoodsCategory): Promise<Goods[]> => {
    return await storageService.getGoodsByCategory(category);
  };

  return {
    goods,
    loading,
    addGoods,
    updateGoods,
    deleteGoods,
    searchGoods,
    getGoodsByCategory,
    loadGoods
  };
}