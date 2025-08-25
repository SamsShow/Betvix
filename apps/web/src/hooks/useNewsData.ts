"use client";

import { useState, useEffect } from 'react';

export interface NewsArticle {
  id: string;
  title: string;
  description: string;
  content: string;
  source: string;
  author: string | null;
  url: string;
  imageUrl: string | null;
  publishedAt: string;
  category: string;
}

interface NewsResponse {
  success: boolean;
  data: NewsArticle[];
  error?: string;
}

interface UseNewsDataOptions {
  category?: string;
  country?: string;
  pageSize?: number;
  query?: string;
}

export function useNewsData({ category, country, pageSize = 10, query }: UseNewsDataOptions = {}) {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      setError(null);

      try {
        // Determine which endpoint to use based on whether we have a query
        const endpoint = query ? '/news/search' : '/news';
        
        // Build URL with query parameters
        const params = new URLSearchParams();
        if (category) params.append('category', category);
        if (country) params.append('country', country);
        if (pageSize) params.append('pageSize', pageSize.toString());
        if (query) params.append('query', query);
        
        // Default to local development API URL
        // In production, this would be configured via environment variables
        const baseUrl = process.env.NEXT_PUBLIC_INGESTION_API_URL || 'http://localhost:3002';
        const url = `${baseUrl}${endpoint}?${params.toString()}`;
        
        const response = await fetch(url);
        const data: NewsResponse = await response.json();

        if (!data.success) {
          throw new Error(data.error || 'Failed to fetch news');
        }

        setNews(data.data);
      } catch (err) {
        console.error('Error fetching news:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        setNews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [category, country, pageSize, query]);

  return { news, loading, error };
}

