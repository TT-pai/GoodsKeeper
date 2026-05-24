// src/Router.tsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from '@/pages/Home';
import { Record } from '@/pages/Record';
import { GoodsList } from '@/pages/GoodsList';
import { GoodsDetail } from '@/pages/GoodsDetail';
import { Profile } from '@/pages/Profile';

export function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/record" element={<Record />} />
        <Route path="/goods" element={<GoodsList />} />
        <Route path="/goods/:id" element={<GoodsDetail />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}