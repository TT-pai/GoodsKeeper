// tests/utils/storage.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { StorageService } from '@/utils/storage';
import { Goods } from '@/types/goods';

describe('StorageService', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should save and retrieve user', () => {
    const user = {
      id: 'test-id',
      email: 'test@example.com',
      passwordHash: 'hashed',
      createdAt: Date.now(),
      goodsCount: 0,
      shareCount: 0,
      recordFrequency: 0,
      isTrial: true,
      trialGoodsCount: 0
    };

    StorageService.prototype.saveUser(user);
    const retrieved = StorageService.prototype.getUser();

    expect(retrieved).toEqual(user);
  });

  it('should save and retrieve goods', async () => {
    const goods: Goods = {
      id: 'goods-1',
      name: 'Test Product',
      category: 'digital',
      tags: ['test'],
      rating: 5,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      shareCount: 0,
      aiClassified: false
    };

    await StorageService.prototype.saveGoods(goods);
    const allGoods = await StorageService.prototype.getAllGoods();

    expect(allGoods).toHaveLength(1);
    expect(allGoods[0]).toEqual(goods);
  });
});