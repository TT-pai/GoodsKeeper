// src/components/share/ShareCard.tsx
import React, { useState } from 'react';
import { Modal, Button, Space, message } from 'antd';
import { DownloadOutlined, ShareAltOutlined } from '@ant-design/icons';
import { ShareCardPreview } from './ShareCardPreview';
import { Goods } from '@/types/goods';
import { ShareCardService } from '@/utils/shareCard';

interface ShareCardProps {
  goods: Goods;
  visible: boolean;
  onClose: () => void;
}

export function ShareCard({ goods, visible, onClose }: ShareCardProps) {
  const [cardBlob, setCardBlob] = useState<Blob | null>(null);

  const handleDownload = () => {
    if (cardBlob) {
      ShareCardService.downloadShareCard(cardBlob, `${goods.name}-share.png`);
      message.success('分享卡片已下载');
    }
  };

  const handleShare = async () => {
    if (cardBlob) {
      await ShareCardService.shareToWeChat(cardBlob);
    }
  };

  return (
    <Modal
      title="生成分享卡片"
      open={visible}
      onCancel={onClose}
      footer={null}
      width={400}
    >
      <div style={{ textAlign: 'center' }}>
        <ShareCardPreview
          goods={goods}
          onGenerated={(blob) => setCardBlob(blob)}
        />

        <Space style={{ marginTop: '16px' }}>
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            onClick={handleDownload}
          >
            下载图片
          </Button>
          <Button
            icon={<ShareAltOutlined />}
            onClick={handleShare}
          >
            分享
          </Button>
        </Space>

        <div style={{ marginTop: '12px', color: '#999', fontSize: '12px' }}>
          二维码指向电商平台购买链接
        </div>
      </div>
    </Modal>
  );
}