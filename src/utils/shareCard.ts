// src/utils/shareCard.ts
import html2canvas from 'html2canvas';
import { QRCodeSVG } from 'qrcode.react';
import React from 'react';
import { Goods } from '@/types/goods';

export class ShareCardService {
  static async generateShareCard(goods: Goods): Promise<Blob> {
    // 创建临时DOM元素
    const cardElement = document.createElement('div');
    cardElement.style.width = '300px';
    cardElement.style.background = '#fff';
    cardElement.style.borderRadius = '12px';
    cardElement.style.padding = '16px';
    cardElement.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
    cardElement.style.fontFamily = 'sans-serif';

    // 卡片内容
    cardElement.innerHTML = `
      <div style="text-align: center; margin-bottom: 12px;">
        <img src="${goods.image || ''}" style="max-width: 100%; height: 150px; object-fit: cover; border-radius: 8px;" onerror="this.style.display='none'" />
      </div>
      <div style="font-size: 16px; font-weight: bold; margin-bottom: 8px;">
        ${goods.name}
      </div>
      ${goods.brand ? `<div style="color: #666; margin-bottom: 8px;">${goods.brand}</div>` : ''}
      ${goods.price ? `<div style="color: #ff4d4f; font-size: 20px; font-weight: bold; margin-bottom: 12px;">¥${goods.price}</div>` : ''}
      ${goods.link ? `
        <div style="text-align: center; margin-bottom: 12px;">
          <div id="qrcode-placeholder" style="width: 100px; height: 100px; margin: 0 auto;"></div>
          <div style="color: #1890ff; font-size: 12px; margin-top: 4px;">扫码购买</div>
        </div>
      ` : ''}
      <div style="text-align: center; color: #999; font-size: 10px; border-top: 1px solid #eee; padding-top: 8px;">
        使用GoodsKeeper记录你的好物口袋
      </div>
    `;

    // 添加二维码（如果需要）
    if (goods.link) {
      const qrcodeContainer = cardElement.querySelector('#qrcode-placeholder');
      if (qrcodeContainer) {
        // 使用React创建QRCodeSVG组件并渲染到容器中
        const qrElement = React.createElement(QRCodeSVG, {
          value: goods.link,
          size: 100,
          bgColor: '#fff',
          fgColor: '#000',
          level: 'H'
        });

        // 需要使用ReactDOM来渲染React组件
        const ReactDOM = await import('react-dom/client');
        const root = ReactDOM.createRoot(qrcodeContainer as HTMLElement);
        root.render(qrElement);
      }
    }

    // 添加到body
    document.body.appendChild(cardElement);

    try {
      // 等待QRCode渲染完成
      await new Promise(resolve => setTimeout(resolve, 100));

      // 使用html2canvas生成PNG
      const canvas = await html2canvas(cardElement, {
        backgroundColor: '#fff',
        scale: 2
      });

      // 移除临时元素
      document.body.removeChild(cardElement);

      // 转换为Blob
      return new Promise((resolve) => {
        canvas.toBlob((blob) => {
          resolve(blob!);
        }, 'image/png');
      });
    } catch (error) {
      document.body.removeChild(cardElement);
      throw error;
    }
  }

  static downloadShareCard(blob: Blob, filename: string = 'share-card.png') {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  static async shareToWeChat(blob: Blob) {
    // Web Share API（如果浏览器支持）
    if (navigator.share) {
      const file = new File([blob], 'share-card.png', { type: 'image/png' });
      try {
        await navigator.share({
          files: [file],
          title: '好物分享',
          text: '我用GoodsKeeper记录的好物'
        });
      } catch (error) {
        console.error('分享失败:', error);
      }
    } else {
      // 不支持Web Share API，提示用户手动分享
      alert('请下载图片后手动分享到微信');
    }
  }
}