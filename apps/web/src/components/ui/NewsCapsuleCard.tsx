"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { ArrowTopRightOnSquareIcon as ExternalLinkIcon, LightBulbIcon } from '@heroicons/react/24/outline';
import { NewsToPredictionModal } from './NewsToPredictionModal';

interface NewsCapsuleCardProps {
  title: string;
  description: string;
  content?: string;
  source: string;
  author?: string | null;
  publishedAt: Date | string;
  imageUrl?: string | null;
  category: string;
  url?: string;
  betStatement?: string;
  lines?: string[];
  onClick?: () => void;
  className?: string;
}

export function NewsCapsuleCard({
  title,
  description,
  content,
  source,
  author,
  publishedAt,
  imageUrl,
  category,
  url,
  betStatement,
  lines,
  onClick,
  className,
}: NewsCapsuleCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const publishedDate = typeof publishedAt === 'string' 
    ? new Date(publishedAt) 
    : publishedAt;
  
  const timeAgo = formatDistanceToNow(publishedDate, { addSuffix: true });
  
  const handleCardClick = () => {
    if (onClick) {
      onClick();
    } else if (url) {
      window.open(url, '_blank');
    }
  };
  
  const handlePredictionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsModalOpen(true);
  };

  const getCategoryColor = (category: string): string => {
    const categories: Record<string, string> = {
      'crypto': 'bg-accent-primary text-white',
      'finance': 'bg-accent-green text-white',
      'politics': 'bg-market-red text-white',
      'tech': 'bg-accent-purple text-white',
      'sports': 'bg-market-blue text-white',
      'business': 'bg-market-yellow text-black',
      'general': 'bg-background-tertiary text-text-primary',
    };

    return categories[category.toLowerCase()] || 'bg-background-tertiary text-text-primary';
  };

  return (
    <div 
      onClick={handleCardClick}
      className={`
        bg-background-card rounded-card overflow-hidden
        cursor-pointer hover:shadow-card-hover transition-all
        border border-background-tertiary hover:border-accent-primary/30
        flex flex-col
        ${className || ''}
      `}
    >
      {/* Category badge and source */}
      <div className="px-4 pt-4 pb-2 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(category)}`}>
            {category}
          </span>
          <span className="text-text-secondary text-xs">{source}</span>
        </div>
        
        <div className="text-text-secondary text-xs">
          {timeAgo}
        </div>
      </div>
      
      {/* Image if available */}
      {imageUrl && (
        <div className="relative w-full h-32 overflow-hidden">
          <Image 
            src={imageUrl} 
            alt={title}
            fill
            style={{ objectFit: 'cover' }}
            className="transition-transform hover:scale-105"
          />
        </div>
      )}
      
      {/* Title and content */}
      <div className="p-4 flex-grow">
        <h3 className="font-semibold text-headline-small mb-2 line-clamp-2">{title}</h3>
        
        {/* Display AI-enhanced lines if available */}
        {lines && lines.length > 0 ? (
          <div className="mb-3">
            {lines.map((line, index) => (
              <p key={index} className="text-text-secondary text-sm mb-1">
                {line}
              </p>
            ))}
          </div>
        ) : (
          <p className="text-text-secondary text-sm line-clamp-3 mb-3">{description}</p>
        )}
        
        {/* Display bet statement if available */}
        {betStatement && (
          <div className="mt-3 pt-2 border-t border-background-tertiary/20">
            <div className="flex items-center">
              <span className="text-xs px-2 py-1 rounded-full bg-accent-green/10 text-accent-green mr-2">
                Prediction
              </span>
              <p className="text-accent-primary text-sm font-medium">{betStatement}</p>
            </div>
          </div>
        )}
      </div>
      
      {/* Footer */}
      <div className="px-4 py-3 border-t border-background-tertiary/20 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="text-text-secondary text-xs">
            {author && `By ${author}`}
          </div>
          
          <button
            onClick={handlePredictionClick}
            className="flex items-center text-accent-green text-xs hover:text-accent-primary transition-colors"
          >
            <LightBulbIcon className="w-3 h-3 mr-1" />
            <span>Predict</span>
          </button>
        </div>
        
        {url && (
          <a 
            href={url} 
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-accent-primary text-sm hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="mr-1">Read more</span>
            <ExternalLinkIcon className="w-3 h-3" />
          </a>
        )}
      </div>
      
      {/* Prediction market creation modal */}
      <NewsToPredictionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        newsTitle={title}
        newsDescription={description}
        category={category}
        betStatement={betStatement}
      />
    </div>
  );
}
