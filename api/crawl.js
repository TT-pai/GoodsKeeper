// api/crawl.js - Vercel Serverless Function for ecommerce crawling
import cheerio from 'cheerio';

// CORS代理列表（轮换使用避免单一代理压力）
const CORS_PROXIES = [
  'https://api.allorigins.win/raw?url=',
  'https://corsproxy.io/?',
  'https://api.codetabs.com/v1/proxy?quest='
];

// 识别电商平台
function identifyPlatform(url) {
  if (url.includes('taobao.com') || url.includes('tmall.com')) return 'taobao';
  if (url.includes('jd.com') || url.includes('item.jd.com')) return 'jd';
  if (url.includes('pinduoduo.com') || url.includes('yangkeduo.com')) return 'pdd';
  return 'other';
}

// 提取商品ID
function extractItemId(url, platform) {
  const patterns = {
    taobao: /[?&]id=(\d+)/,
    tmall: /[?&]id=(\d+)/,
    jd: /\/(\d+)\.html/,
    pdd: /goods_id=(\d+)/
  };

  const match = url.match(patterns[platform] || patterns.taobao);
  return match ? match[1] : null;
}

// 使用CORS代理爬取网页
async function fetchWithProxy(url) {
  for (let i = 0; i < CORS_PROXIES.length; i++) {
    try {
      const proxyUrl = CORS_PROXIES[i] + encodeURIComponent(url);
      const response = await fetch(proxyUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      if (response.ok) {
        return await response.text();
      }
    } catch (error) {
      console.log(`代理${i + 1}失败，尝试下一个...`);
    }
  }

  throw new Error('所有代理均失败，无法获取网页');
}

// 解析淘宝/天猫商品信息
function parseTaobao(html) {
  const $ = cheerio.load(html);

  // 多种可能的HTML结构（淘宝页面结构会变化）
  const selectors = {
    title: [
      '.tb-main-title',
      '.ItemHeader--mainTitle',
      'h1[class*="title"]',
      '[data-title]'
    ],
    price: [
      '.tb-price',
      '.Price--priceText',
      '[class*="price"]',
      'span[data-price]'
    ],
    image: [
      '.tb-img img',
      '.ItemHeader--mainPic img',
      'img[class*="pic"]',
      'img[data-src]'
    ],
    brand: [
      '.tb-brand-name',
      '[class*="brand"]',
      'a[data-brand]'
    ]
  };

  // 尝试多个选择器
  const title = trySelectors($, selectors.title);
  const price = trySelectors($, selectors.price);
  const image = trySelectors($, selectors.image);
  const brand = trySelectors($, selectors.brand);

  return {
    name: title || '',
    price: parsePrice(price) || 0,
    image: extractImageUrl(image) || '',
    brand: brand || '',
    platform: 'taobao'
  };
}

// 解析京东商品信息
function parseJD(html) {
  const $ = cheerio.load(html);

  const name = $('.itemInfo-wrap .item-name').text() ||
               $('.sku-name').text() ||
               $('h1').text();

  const price = $('.itemInfo-wrap .item-price').text() ||
                $('.price').text() ||
                $('.summary-price-wrap .price').text();

  const image = $('.itemInfo-wrap img').attr('src') ||
                $('#spec-img').attr('src') ||
                $('.preview-wrap img').attr('src');

  const brand = $('.itemInfo-wrap .item-brand').text() ||
                $('[class*="brand"]').text();

  return {
    name: name.trim(),
    price: parsePrice(price),
    image: extractImageUrl(image),
    brand: brand.trim(),
    platform: 'jd'
  };
}

// 解析拼多多商品信息（简化版，拼多多页面较复杂）
function parsePDD(html) {
  const $ = cheerio.load(html);

  // 拼多多页面是动态加载，静态爬取信息有限
  const name = $('title').text().split('-')[0] || '';
  const price = 0;
  const image = '';
  const brand = '';

  return {
    name: name.trim(),
    price,
    image,
    brand,
    platform: 'pdd',
    note: '拼多多页面需动态加载，信息可能不完整'
  };
}

// 工具函数：尝试多个选择器
function trySelectors($, selectors) {
  for (const selector of selectors) {
    const element = $(selector).first();
    if (element.length && element.text().trim()) {
      return element.text().trim();
    }
  }
  return '';
}

// 工具函数：解析价格数字
function parsePrice(priceText) {
  if (!priceText) return 0;

  // 提取数字部分
  const match = priceText.match(/[\d.]+/);
  if (match) {
    const price = parseFloat(match[0]);
    return price > 0 ? price : 0;
  }

  return 0;
}

// 工具函数：提取图片URL
function extractImageUrl(imgElement) {
  if (!imgElement) return '';

  // 处理各种图片URL格式
  const src = imgElement.attr('src') || imgElement.attr('data-src') || '';

  // 补全协议
  if (src.startsWith('//')) {
    return 'https:' + src;
  }

  return src;
}

// Vercel Function主处理函数
export default async function handler(req, res) {
  // 设置CORS头部（允许前端调用）
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  // 处理OPTIONS预检请求
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 获取URL参数
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({
      success: false,
      error: '缺少URL参数'
    });
  }

  try {
    console.log(`开始爬取: ${url}`);

    // 识别平台
    const platform = identifyPlatform(url);
    console.log(`识别平台: ${platform}`);

    // 爬取网页HTML
    const html = await fetchWithProxy(url);
    console.log(`网页HTML长度: ${html.length}`);

    // 根据平台解析商品信息
    let productData;
    switch (platform) {
      case 'taobao':
      case 'tmall':
        productData = parseTaobao(html);
        break;
      case 'jd':
        productData = parseJD(html);
        break;
      case 'pdd':
        productData = parsePDD(html);
        break;
      default:
        productData = {
          name: '',
          price: 0,
          image: '',
          brand: '',
          platform: 'other',
          error: '无法识别平台'
        };
    }

    console.log(`解析结果:`, productData);

    // 返回成功结果
    res.status(200).json({
      success: true,
      data: productData,
      method: 'crawler',
      timestamp: Date.now()
    });

  } catch (error) {
    console.error('爬虫错误:', error);

    res.status(500).json({
      success: false,
      error: error.message || '爬取失败',
      method: 'crawler'
    });
  }
}