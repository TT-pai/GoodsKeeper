// src/components/share/ShareCardPreview.tsx
import React, { useEffect, useState } from 'react';
import { Card, Image } from 'antd';
import { Goods } from '@/types/goods';
import { ShareCardService } from '@/utils/shareCard';

interface ShareCardPreviewProps {
  goods: Goods;
  onGenerated?: (blob: Blob) => void;
}

export function ShareCardPreview({ goods, onGenerated }: ShareCardPreviewProps) {
  const [cardUrl, setCardUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    generateCard();
  }, [goods]);

  const generateCard = async () => {
    setLoading(true);
    try {
      const blob = await ShareCardService.generateShareCard(goods);
      const url = URL.createObjectURL(blob);
      setCardUrl(url);
      if (onGenerated) {
        onGenerated(blob);
      }
    } catch (error) {
      console.error('生成分享卡片失败:', error);
    }
    setLoading(false);
  };

  if (loading) {
    return <Card loading={true} style={{ width: '300px' }} />;
  }

  return (
    <Card style={{ width: '300px', textAlign: 'center' }}>
      <Image
        src={cardUrl}
        alt="分享卡片"
        style={{ borderRadius: '8px' }}
      />
    </Card>
  );
}