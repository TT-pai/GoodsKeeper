// src/utils/aiService.ts
import { AiExtractResult, AiClassifyResult } from '@/types/ai';
import { GoodsCategory, CATEGORY_LABELS } from '@/types/goods';

// DeepSeek API配置（兼容OpenAI格式）
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';
const DEEPSEEK_MODEL = 'deepseek-chat';

export class AiService {
  private apiKey: string | null = null;

  setApiKey(key: string) {
    this.apiKey = key;
    localStorage.setItem('ai-api-key', key);
  }

  getApiKey(): string | null {
    if (!this.apiKey) {
      this.apiKey = localStorage.getItem('ai-api-key') || localStorage.getItem('claude-api-key');
    }
    return this.apiKey;
  }

  private async callDeepSeek(prompt: string): Promise<string> {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      throw new Error('AI API Key未设置。请在个人中心设置你的API Key');
    }

    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: DEEPSEEK_MODEL,
        messages: [
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 1024
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const errorMsg = errorData?.error?.message || `DeepSeek API错误: ${response.status}`;
      throw new Error(errorMsg);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  async extractGoodsInfo(link: string): Promise<AiExtractResult> {
    try {
      const prompt = `
从以下电商链接中提取商品信息: ${link}

请提取并返回JSON格式:
{
  "name": "商品名称",
  "brand": "品牌名称（可选）",
  "price": "价格数字（可选）",
  "image": "图片URL（可选）",
  "platform": "平台名称（taobao/jd/pdd）"
}

如果提取失败，返回: { "success": false, "error": "原因" }
`;

      const response = await this.callDeepSeek(prompt);
      const parsed = JSON.parse(response);

      return {
        success: true,
        data: parsed,
        method: 'link'
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
        method: 'link'
      };
    }
  }

  async classifyGoods(name: string, brand?: string): Promise<AiClassifyResult> {
    try {
      const categories = Object.keys(CATEGORY_LABELS).join(', ');
      const prompt = `
将以下商品分类到其中一个类别: ${categories}

商品: ${name}
品牌: ${brand || 'unknown'}

返回JSON格式:
{
  "category": "类别名称",
  "tags": ["标签1", "标签2"],
  "confidence": 0.9
}
`;

      const response = await this.callDeepSeek(prompt);
      const parsed = JSON.parse(response);

      return {
        success: true,
        category: parsed.category as GoodsCategory,
        tags: parsed.tags || [],
        confidence: parsed.confidence || 0.8
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
        confidence: 0
      };
    }
  }
}

export const aiService = new AiService();