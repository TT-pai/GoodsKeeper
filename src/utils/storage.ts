// src/utils/storage.ts
import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { Goods, GoodsCategory } from '@/types/goods';
import { User, UserStats } from '@/types/user';
import { DailyStats, AiPerformanceStats } from '@/types/stats';
import { v4 as uuidv4 } from 'uuid';

interface GoodsKeeperDB extends DBSchema {
  goods: {
    key: string;
    value: Goods;
    indexes: { 'by-category': GoodsCategory; 'by-date': number };
  };
  users: {
    key: string;
    value: User;
  };
  stats: {
    key: string;
    value: DailyStats;
  };
  aiFeedback: {
    key: string;
    value: any;
  };
}

class StorageService {
  private db: IDBPDatabase<GoodsKeeperDB> | null = null;
  private dbPromise: Promise<IDBPDatabase<GoodsKeeperDB>>;

  constructor() {
    this.dbPromise = this.initDB();
  }

  private async initDB(): Promise<IDBPDatabase<GoodsKeeperDB>> {
    return openDB<GoodsKeeperDB>('goodskeeper-db', 1, {
      upgrade(db) {
        // Goods store
        const goodsStore = db.createObjectStore('goods', { keyPath: 'id' });
        goodsStore.createIndex('by-category', 'category');
        goodsStore.createIndex('by-date', 'createdAt');

        // Users store
        db.createObjectStore('users', { keyPath: 'id' });

        // Stats store
        db.createObjectStore('stats', { keyPath: 'date' });

        // AI Feedback store
        db.createObjectStore('aiFeedback', { keyPath: 'id' });
      },
    });
  }

  // User methods
  saveUser(user: User): void {
    localStorage.setItem('goodskeeper-user', JSON.stringify(user));
  }

  getUser(): User | null {
    const data = localStorage.getItem('goodskeeper-user');
    return data ? JSON.parse(data) : null;
  }

  createUser(email: string, passwordHash: string): User {
    const user: User = {
      id: uuidv4(),
      email,
      passwordHash,
      createdAt: Date.now(),
      goodsCount: 0,
      shareCount: 0,
      recordFrequency: 0,
      isTrial: true,
      trialGoodsCount: 0
    };
    this.saveUser(user);
    return user;
  }

  updateUser(updates: Partial<User>): void {
    const user = this.getUser();
    if (user) {
      const updated = { ...user, ...updates };
      this.saveUser(updated);
    }
  }

  deleteUser(): void {
    localStorage.removeItem('goodskeeper-user');
  }

  // Goods methods
  async saveGoods(goods: Goods): Promise<void> {
    const db = await this.dbPromise;
    await db.put('goods', goods);

    // Update user stats
    const user = this.getUser();
    if (user) {
      this.updateUser({ goodsCount: user.goodsCount + 1 });
    }
  }

  async getAllGoods(): Promise<Goods[]> {
    const db = await this.dbPromise;
    return db.getAll('goods');
  }

  async getGoodsById(id: string): Promise<Goods | undefined> {
    const db = await this.dbPromise;
    return db.get('goods', id);
  }

  async getGoodsByCategory(category: GoodsCategory): Promise<Goods[]> {
    const db = await this.dbPromise;
    return db.getAllFromIndex('goods', 'by-category', category);
  }

  async updateGoods(id: string, updates: Partial<Goods>): Promise<void> {
    const goods = await this.getGoodsById(id);
    if (goods) {
      const updated = { ...goods, ...updates, updatedAt: Date.now() };
      await this.saveGoods(updated);
    }
  }

  async deleteGoods(id: string): Promise<void> {
    const db = await this.dbPromise;
    await db.delete('goods', id);

    // Update user stats
    const user = this.getUser();
    if (user) {
      this.updateUser({ goodsCount: user.goodsCount - 1 });
    }
  }

  async searchGoods(keyword: string): Promise<Goods[]> {
    const allGoods = await this.getAllGoods();
    const lowerKeyword = keyword.toLowerCase();

    return allGoods.filter(goods =>
      goods.name.toLowerCase().includes(lowerKeyword) ||
      (goods.brand && goods.brand.toLowerCase().includes(lowerKeyword)) ||
      (goods.notes && goods.notes.toLowerCase().includes(lowerKeyword)) ||
      goods.tags.some(tag => tag.toLowerCase().includes(lowerKeyword))
    );
  }

  // Stats methods
  async saveDailyStats(stats: DailyStats): Promise<void> {
    const db = await this.dbPromise;
    await db.put('stats', stats);
  }

  async getStatsByDateRange(start: string, end: string): Promise<DailyStats[]> {
    const db = await this.dbPromise;
    const allStats = await db.getAll('stats');
    return allStats.filter(s => s.date >= start && s.date <= end);
  }

  // AI Feedback methods
  async saveAiFeedback(feedback: any): Promise<void> {
    const db = await this.dbPromise;
    await db.put('aiFeedback', { ...feedback, id: uuidv4(), timestamp: Date.now() });
  }

  async getAiPerformanceStats(): Promise<AiPerformanceStats> {
    const db = await this.dbPromise;
    const feedbacks = await db.getAll('aiFeedback');

    const thumbsUp = feedbacks.filter(f => f.isCorrect).length;
    const thumbsDown = feedbacks.filter(f => !f.isCorrect).length;
    const total = thumbsUp + thumbsDown;

    return {
      classificationAccuracy: total > 0 ? thumbsUp / total : 0,
      extractionSuccessRate: 0, // TODO: track extraction success
      totalAiCalls: 0, // TODO: track AI calls
      thumbsUpCount: thumbsUp,
      thumbsDownCount: thumbsDown
    };
  }

  // Data export/import
  async exportAllData(): Promise<string> {
    const goods = await this.getAllGoods();
    const user = this.getUser();

    const exportData = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      user,
      goods
    };

    return JSON.stringify(exportData, null, 2);
  }

  async importAllData(jsonData: string): Promise<void> {
    const data = JSON.parse(jsonData);

    if (data.user) {
      this.saveUser(data.user);
    }

    if (data.goods && Array.isArray(data.goods)) {
      for (const goods of data.goods) {
        await this.saveGoods(goods);
      }
    }
  }
}

export const storageService = new StorageService();
export { StorageService };