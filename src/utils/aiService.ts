// src/utils/aiService.ts
import { AiExtractResult, AiClassifyResult } from '@/types/ai';
import { GoodsCategory, CATEGORY_LABELS } from '@/types/goods';

// Claude API配置
const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';
const CLAUDE_MODEL = 'claude-3-5-sonnet-20241022';

export class AiService {
  private apiKey: string | null = null;

  setApiKey(key: string) {
    this.apiKey = key;
    localStorage.setItem('claude-api-key', key);
  }

  getApiKey(): string | null {
    if (!this.apiKey) {
      this.apiKey = localStorage.getItem('claude-api-key');
    }
    return this.apiKey;
  }

  private async callClaude(prompt: string): Promise<string> {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      throw new Error('Claude API Key未设置。请在个人中心设置你的API Key');
    }

    const response = await fetch(CLAUDE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: CLAUDE_MODEL,
        max_tokens: 1024,
        messages: [
          { role: 'user', content: prompt }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`Claude API错误: ${response.status}`);
    }

    const data = await response.json();
    return data.content[0].text;
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

      const response = await this.callClaude(prompt);
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

      const response = await this.callClaude(prompt);
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