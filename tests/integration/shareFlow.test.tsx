// tests/integration/shareFlow.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ShareCard } from '@/components/share/ShareCard';
import { Goods } from '@/types/goods';

// Mock html2canvas
vi.mock('html2canvas', () => ({
  default: vi.fn().mockResolvedValue({
    toBlob: (callback: (blob: Blob) => void) => {
      callback(new Blob(['test'], { type: 'image/png' }));
    }
  })
}));

describe('Share Flow Integration', () => {
  const mockGoods: Goods = {
    id: 'share-test',
    name: 'Share Test Product',
    price: 99,
    link: 'https://item.taobao.com/item.htm?id=123',
    category: 'digital',
    tags: ['test'],
    rating: 5,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    shareCount: 0,
    aiClassified: false
  };

  it('should render share card modal when visible', () => {
    render(
      <ShareCard goods={mockGoods} visible={true} onClose={() => {}} />
    );

    expect(screen.getByText('生成分享卡片')).toBeInTheDocument();
    expect(screen.getByText('下载图片')).toBeInTheDocument();
  });

  it('should not render when not visible', () => {
    render(
      <ShareCard goods={mockGoods} visible={false} onClose={() => {}} />
    );

    expect(screen.queryByText('生成分享卡片')).not.toBeInTheDocument();
  });
});