"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { NewsCapsuleCard } from './ui/NewsCapsuleCard';
import { useNewsData } from '@/hooks/useNewsData';
import { ArrowRightIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

interface NewsSectionProps {
  title?: string;
  description?: string;
  initialCategory?: string;
  limit?: number;
  showAllLink?: boolean;
}

export function NewsSection({ 
  title = "Latest News", 
  description = "Stay informed with the latest developments and breaking stories",
  initialCategory = "general",
  limit = 6,
  showAllLink = true
}: NewsSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  
  // Fetch news data
  const { news, loading, error } = useNewsData({ 
    category: isSearching ? undefined : selectedCategory,
    query: isSearching ? searchQuery : undefined,
    pageSize: limit
  });
  
  // Categories for filter
  const categories = [
    { id: 'general', name: 'General' },
    { id: 'business', name: 'Business' },
    { id: 'technology', name: 'Technology' },
    { id: 'crypto', name: 'Crypto' },
    { id: 'finance', name: 'Finance' },
    { id: 'politics', name: 'Politics' },
  ];
  
  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearching(true);
    }
  };
  
  // Clear search and return to category filtering
  const clearSearch = () => {
    setSearchQuery('');
    setIsSearching(false);
  };
  
  // Handle category selection
  const selectCategory = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setIsSearching(false);
    setSearchQuery('');
  };

  return (
    <section className="py-16 md:py-20">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 md:mb-16"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h2 className="text-display-small md:text-display-medium font-semibold mb-3">{title}</h2>
              <p className="text-text-secondary max-w-2xl">
                {description}
              </p>
            </div>
            
            {/* Search form */}
            <form onSubmit={handleSearch} className="mt-4 md:mt-0 flex items-center w-full md:w-auto">
              <div className="relative flex-grow md:flex-grow-0">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search news..."
                  className="pl-10 pr-4 py-2 w-full md:w-64 bg-background-secondary/50 border border-background-tertiary/30 rounded-lg focus:outline-none focus:border-accent-primary/50 focus:ring-1 focus:ring-accent-primary/50 transition-all"
                />
                <MagnifyingGlassIcon className="w-5 h-5 text-text-tertiary absolute top-1/2 left-3 transform -translate-y-1/2" />
              </div>
              <button 
                type="submit"
                className="ml-2 px-4 py-2 bg-accent-primary text-white font-medium rounded-lg hover:bg-accent-primary/90 transition-colors"
              >
                Search
              </button>
              {isSearching && (
                <button 
                  type="button"
                  onClick={clearSearch}
                  className="ml-2 px-4 py-2 bg-background-tertiary/30 text-text-primary font-medium rounded-lg hover:bg-background-tertiary/50 transition-colors"
                >
                  Clear
                </button>
              )}
            </form>
          </div>
          
          {/* Category filters - hide when searching */}
          {!isSearching && (
            <div className="flex overflow-x-auto pb-3 hide-scrollbar">
              <div className="flex space-x-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => selectCategory(category.id)}
                    className={`
                      px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors
                      ${selectedCategory === category.id 
                        ? 'bg-accent-primary text-white' 
                        : 'bg-background-secondary/50 text-text-secondary hover:text-text-primary hover:bg-background-tertiary/30'}
                    `}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </motion.div>
        
        {/* News Cards */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-primary"></div>
          </div>
        ) : error ? (
          <div className="text-center text-market-red py-8">
            <p>Failed to load news. Please try again later.</p>
          </div>
        ) : news.length === 0 ? (
          <div className="text-center text-text-secondary py-8">
            <p>No news articles found. Try a different category or search term.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.map((article) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                whileHover={{ 
                  y: -8,
                  transition: { duration: 0.2 }
                }}
              >
                <NewsCapsuleCard
                  title={article.title}
                  description={article.description}
                  content={article.content}
                  source={article.source}
                  author={article.author}
                  publishedAt={article.publishedAt}
                  imageUrl={article.imageUrl}
                  category={article.category}
                  url={article.url}
                />
              </motion.div>
            ))}
          </div>
        )}
        
        {/* View All link */}
        {showAllLink && news.length > 0 && (
          <div className="flex justify-center mt-10 md:mt-12">
            <Link href="/news">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="px-5 py-3 bg-accent-primary text-white font-medium rounded-xl transition-all duration-300"
              >
                View All News
                <ArrowRightIcon className="ml-2 w-4 h-4 inline" />
              </motion.button>
            </Link>
          </div>
        )}
      </div>
      
      {/* Custom CSS for hiding scrollbar */}
      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}

