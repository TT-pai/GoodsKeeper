# GoodsKeeper - 你的好物口袋

> AI驱动的个人好物记录应用 | 完全本地存储 · 零云服务成本 · 隐私最优

**🚀 [立即体验](https://goods-keeper.vercel.app/) - 无需注册，零门槛试用**

## 🎯 产品定位

GoodsKeeper是一款面向年轻消费者的好物管理工具，通过AI技术简化记录流程，帮助用户建立个人好物知识库。

**目标用户：** 有网购习惯、喜欢分享好物、对效率工具敏感的年轻人

**核心价值：**
- ⚡ AI辅助输入：粘贴链接即可提取商品信息
- 🎯 智能分类：AI自动归类到7大类（数码、家居、服饰、食品、娱乐、个人、其他）
- 🔍 多维搜索：关键词、分类、标签组合查找
- 🤝 社交分享：一键生成美观分享卡片，QR码直接指向电商平台（用户友好设计）
- 🔒 完全本地：IndexedDB存储，数据永不丢失，零成本运营

## ✨ 核心功能

### 1. AI辅助记录（核心亮点）
**痛点解决：** 传统记录需要手动填写多个字段 → 体验差、易放弃

**解决方案：**
- 粘贴电商链接 → Claude AI提取商品名称、品牌、价格、图片
- 基于商品信息 → AI智能分类到7大类并生成标签
- 三层fallback：链接解析 → 图片识别 → 手动输入（确保可用性）

**技术亮点：**
- 使用Claude 3.5 Sonnet API
- 结构化prompt确保信息准确提取
- 用户反馈机制（点赞/点踩）帮助AI持续改进

### 2. 体验模式（产品策略）
**设计理念：** 降低首次使用门槛，建立信任后再引导注册

**实现：**
- 无需注册即可体验（零摩擦）
- 限制记录3个好物（建立使用习惯）
- 达到上限弹出注册引导（时机最佳）

### 3. 分享卡片生成（用户优先）
**关键决策：** QR码指向电商平台而非应用本身

**产品思考：**
- 用户分享好物 → 朋友扫码购买 → 双方获益（用户价值最大化）
- 不强制推广应用 → 避免用户反感（尊重用户意愿）
- 分享卡片显示"使用GoodsKeeper记录" → 自然口碑传播

### 4. 数据完全本地（成本优势）
**成本分析：**
- 云服务器 + 数据库：¥200-500/月 → 需商业化变现
- IndexedDB + localStorage：¥0 → 可长期免费运营

**技术方案：**
- IndexedDB存储好物数据（支持大量记录）
- localStorage存储用户信息（快速访问）
- JSON导出/导入备份（数据主权归用户）

## 🛠 技术架构

### 前端技术栈
```
React 18 + TypeScript + Vite
Ant Design 6（UI组件库）
react-router-dom 7（路由）
IndexedDB（数据存储）
bcryptjs（密码加密）
html2canvas + qrcode.react（分享卡片）
Claude API（AI服务）
```

### 数据模型
```typescript
// 核心类型定义
Goods {
  id: string
  name: string
  brand?: string
  price?: number
  link?: string
  image?: string
  category: GoodsCategory  // AI分类
  tags: string[]           // AI生成
  rating: number
  aiClassified: boolean    // AI分类标记
  shareCount: number
}

User {
  email: string
  passwordHash: string     // bcrypt加密
  isTrial: boolean
  trialGoodsCount: number
}
```

### AI服务集成
```typescript
// Claude API调用
1. 信息提取
   prompt: "从电商链接提取商品信息"
   output: { name, brand, price, image }

2. 智能分类
   prompt: "将商品归类到预设分类"
   output: { category, tags[], confidence }
```

## 📁 项目结构

```
goodskeeper/
├── src/
│   ├── components/
│   │   ├── common/        # Header, Layout
│   │   ├── goods/         # GoodsForm, GoodsCard, GoodsList, AiFeedback
│   │   ├── share/         # ShareCard, ShareCardPreview
│   │   └── stats/         # StatsPanel
│   ├── hooks/             # useUser, useGoods, useAI
│   ├── pages/             # Home, Record, GoodsList, GoodsDetail, Profile
│   ├── utils/
│   │   ├── storage.ts     # IndexedDB服务
│   │   ├── crypto.ts      # 密码加密
│   │   ├── aiService.ts   # Claude API集成
│   │   ├── shareCard.ts   # 分享卡片生成
│   │   └ dataExport.ts    # 数据导出导入
│   ├── types/             # TypeScript类型定义
│   └── styles/            # 样式文件
├── tests/
│   ├── unit/              # 单元测试
│   └── integration/       # 集成测试
└── docs/
    └── specs/             # 产品设计文档
```

## 🔑 关键设计决策

### 1. 为什么分享QR码指向电商平台？
**权衡分析：**
| 方案 | 优点 | 缺点 | 用户价值 |
|------|------|------|----------|
| A: 指向应用 | 增加新用户 | 分享意愿降低 | ⭐⭐ |
| B: 指向商品 | 朋友可直接购买 | 无直接推广效果 | ⭐⭐⭐⭐⭐ |

**决策：** 选择方案B，通过自然口碑传播获得用户，而非强制推广

### 2. 为什么完全本地存储？
**成本对比：**
- 云服务方案：¥200-500/月 → 需快速商业化
- 本地方案：¥0 → 可长期免费维护，压力小

**决策：** 本地存储，降低运营压力，专注产品优化

### 3. 为什么设置体验上限为3？
**心理学依据：**
- 1个太少，无法建立习惯
- 5个太多，用户可能直接放弃
- 3个适中，既体验核心功能又产生继续使用意愿

## 🚀 快速开始

### 安装依赖
```bash
npm install
```

### 开发模式
```bash
npm run dev
```

### 生产构建
```bash
npm run build
```

### 测试
```bash
npm test
```

### 配置Claude API Key
1. 访问 https://console.anthropic.com/
2. 获取API Key
3. 在个人中心设置页面输入

## 📊 性能优化

- 图片懒加载：使用Skeleton占位，渐进显示
- 防抖搜索：避免频繁查询IndexedDB
- 分页渲染：好物数量>100时启用虚拟滚动
- 缓存策略：Claude API响应缓存5分钟

## 🔮 未来规划

### 短期（1-2个月）
- 图片识别fallback（拍照上传商品）
- 批量导入（历史好物迁移）
- 更多分享样式模板

### 中期（3-6个月）
- Chrome扩展（一键收藏）
- 微信小程序版本
- 社区好物推荐（基于用户分享数据）

### 长期（6-12个月）
- 多人协作（家庭共享好物库）
- 智能推荐（基于历史记录推荐新品）
- 价格监控（商品降价提醒）

## 📝 开发日志

### Week 1（2026-05-23 - 2026-05-25）
- ✅ 产品设计与需求确认
- ✅ 技术架构设计
- ✅ 完整功能实现（10个核心任务）
- ✅ 集成测试编写
- ✅ UI美化优化

## 👥 贡献者

**产品设计 + 开发 + 测试：** Claude Code

**技术支持：**
- Anthropic Claude API
- Ant Design组件库
- Vite构建工具

## 📄 License

MIT License - 可自由使用、修改、分发

---

**GoodsKeeper** - 让好物记录更智能，让分享更自然

*使用Claude Code开发，展示AI辅助编程能力*