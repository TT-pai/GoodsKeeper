// api/crawl.js - Vercel Serverless Function (Optimized for 10s timeout)
import cheerio from 'cheerio';

// Vercel函数超时限制：10秒
const TIMEOUT_LIMIT = 8000; // 8秒（留2秒buffer）

// CORS代理（只使用最快的）
const CORS_PROXY = 'https://api.allorigins.win/raw?url=';

// 识别电商平台
function identifyPlatform(url) {
  if (url.includes('taobao.com') || url.includes('tmall.com')) return 'taobao';
  if (url.includes('jd.com')) return 'jd';
  if (url.includes('pinduoduo.com')) return 'pdd';
  return 'other';
}

// 使用CORS代理爬取（带超时控制）
async function fetchWithTimeout(url) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_LIMIT);

  try {
    const proxyUrl = CORS_PROXY + encodeURIComponent(url);
    const response = await fetch(proxyUrl, {
      signal: controller.signal,
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });

    clearTimeout(timeoutId);
    return await response.text();
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('爬取超时（8秒限制）');
    }
    throw error;
  }
}

// 快速解析（简化版，避免复杂DOM操作）
function parseProduct(html, platform) {
  const $ = cheerio.load(html);

  // 从title提取商品名称（最简单）
  const title = $('title').text() || '商品';
  const name = title.split('-')[0].split('_')[0].trim();

  // 从HTML正则匹配价格（最快）
  const priceMatch = html.match(/¥\s*[\d.]+/) || html.match(/价格[：:]\s*[\d.]+/);
  const price = priceMatch ? parseFloat(priceMatch[0].match(/[\d.]+/)[0]) : 0;

  // 正则匹配图片URL
  const imgMatch = html.match(/https?:\/\/[^"'\s]+\.jpg[^"'\s]*/);
  const image = imgMatch ? imgMatch[0] : '';

  return {
    name,
    price,
    image,
    brand: '',
    platform
  };
}

// Vercel Function
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { url } = req.query;

  if (!url) {
    return res.status(400).json({
      success: false,
      error: '缺少URL参数'
    });
  }

  try {
    console.log(`[爬虫] URL: ${url}`);

    const platform = identifyPlatform(url);
    const html = await fetchWithTimeout(url);
    const data = parseProduct(html, platform);

    console.log(`[成功]`, data);

    res.status(200).json({
      success: true,
      data,
      method: 'crawler'
    });

  } catch (error) {
    console.error(`[错误]`, error.message);

    res.status(500).json({
      success: false,
      error: error.message || '爬虫服务暂时不可用',
      method: 'crawler',
      suggestion: '建议手动输入商品信息'
    });
  }
}