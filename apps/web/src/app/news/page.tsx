"use client";

import React from 'react';
import { NewsSection } from '@/components/NewsSection';

export default function NewsPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="py-8 md:py-12">
        <NewsSection 
          title="News Capsules" 
          description="Browse all news capsules and prediction markets across multiple categories"
          limit={12}
          showAllLink={false}
        />
      </div>
    </main>
  );
}

