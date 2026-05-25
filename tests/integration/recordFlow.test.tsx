// tests/integration/recordFlow.test.tsx
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Record } from '@/pages/Record';

// Mock AI service
vi.mock('@/utils/aiService', () => ({
  aiService: {
    extractGoodsInfo: vi.fn().mockResolvedValue({
      success: true,
      data: { name: 'Test Product', brand: 'Test Brand', price: 99 },
      method: 'link'
    }),
    classifyGoods: vi.fn().mockResolvedValue({
      success: true,
      category: 'digital',
      tags: ['test'],
      confidence: 0.9
    })
  }
}));

describe('Record Flow Integration', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should render record page with form', () => {
    render(
      <BrowserRouter>
        <Record />
      </BrowserRouter>
    );

    expect(screen.getByText('记录好物')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('粘贴淘宝/京东/拼多多链接')).toBeInTheDocument();
  });

  it('should show trial mode indicator', () => {
    render(
      <BrowserRouter>
        <Record />
      </BrowserRouter>
    );

    // Should show trial mode banner
    expect(screen.getByText(/体验模式/)).toBeInTheDocument();
  });
});