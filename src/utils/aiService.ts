// src/utils/aiService.ts
import { AiExtractResult, AiClassifyResult } from '@/types/ai';
import { GoodsCategory, CATEGORY_LABELS } from '@/types/goods';

// DeepSeek API configuration (OpenAI compatible)
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

  // Clean AI response - remove markdown code block markers
  private cleanJsonResponse(response: string): string {
    let cleaned = response.trim();

    // Remove opening ```json or ```
    if (cleaned.startsWith('```json')) {
      cleaned = cleaned.replace(/^```json\s*/, '');
    } else if (cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/^```\s*/, '');
    }

    // Remove closing ```
    if (cleaned.endsWith('```')) {
      cleaned = cleaned.replace(/\s*```$/, '');
    }

    return cleaned.trim();
  }

  private async callDeepSeek(prompt: string): Promise<string> {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      throw new Error('AI API Key not set. Please set your API Key in Profile page.');
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
      const errorMsg = errorData?.error?.message || `DeepSeek API error: ${response.status}`;
      throw new Error(errorMsg);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  async extractGoodsInfo(link: string): Promise<AiExtractResult> {
    try {
      const prompt = `Extract product information from this e-commerce link: ${link}

Return ONLY pure JSON without any markdown markers. Use this exact format:
{"name":"Product Name","brand":"Brand Name","price":99.9,"image":"Image URL","platform":"taobao"}

Requirements:
1. name field is required
2. price must be number type (no quotes)
3. brand and image should be empty string "" if not available
4. platform options: taobao/jd/pdd/other
5. If extraction fails, return: {"success":false,"error":"reason"}`;

      const response = await this.callDeepSeek(prompt);
      console.log('DeepSeek raw response:', response);

      const cleanedResponse = this.cleanJsonResponse(response);
      console.log('Cleaned JSON:', cleanedResponse);

      const parsed = JSON.parse(cleanedResponse);
      console.log('Parsed data:', parsed);

      return {
        success: true,
        data: parsed,
        method: 'link'
      };
    } catch (error: any) {
      console.error('AI extraction error:', error);
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
      const prompt = `Classify this product into one of these categories: ${categories}

Product: ${name}
Brand: ${brand || 'unknown'}

Return ONLY pure JSON without markdown. Use this exact format:
{"category":"category_name","tags":["tag1","tag2"],"confidence":0.9}`;

      const response = await this.callDeepSeek(prompt);
      const cleanedResponse = this.cleanJsonResponse(response);
      const parsed = JSON.parse(cleanedResponse);

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