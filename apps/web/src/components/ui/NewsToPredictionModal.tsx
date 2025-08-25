"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface NewsToPredictionModalProps {
  isOpen: boolean;
  onClose: () => void;
  newsTitle: string;
  newsDescription: string;
  category: string;
  betStatement?: string;
}

export function NewsToPredictionModal({
  isOpen,
  onClose,
  newsTitle,
  newsDescription,
  category,
  betStatement
}: NewsToPredictionModalProps) {
  const [predictionStatement, setPredictionStatement] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  
  // In a real implementation, this would call the NLP service to generate the statement
  const generatePredictionStatement = async () => {
    setLoading(true);
    
    try {
      // If we already have a bet statement from the news API's Gemini integration, use that
      if (betStatement) {
        setPredictionStatement(betStatement);
        setLoading(false);
        return;
      }
      
      // This would be an actual API call to the NLP service
      // const response = await fetch('/api/nlp/generate-prediction', { ... });
      // const data = await response.json();
      // setPredictionStatement(data.betStatement);
      
      // Mock delay and result for demonstration
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate a prediction statement based on the news title
      const statement = `Will ${newsTitle.replace(/\?$/, '')}?`;
      setPredictionStatement(statement);
    } catch (error) {
      console.error('Error generating prediction statement:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleCreate = () => {
    // In a real implementation, this would create the market
    console.log('Creating market with statement:', predictionStatement);
    
    // Close the modal
    onClose();
  };
  
  if (!isOpen) return null;
  
  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-background-card border border-background-tertiary/20 rounded-xl p-6 w-full max-w-xl"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-headline-medium font-semibold">Create Prediction Market</h3>
            <button 
              onClick={onClose}
              className="p-2 rounded-full hover:bg-background-secondary/50"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
          
          <div className="mb-6">
            <h4 className="text-headline-small font-medium mb-2">News Source</h4>
            <div className="bg-background-secondary/30 rounded-lg p-4">
              <div className="mb-1">
                <span className="text-xs px-2 py-1 rounded-full bg-accent-primary/20 text-accent-primary">
                  {category}
                </span>
              </div>
              <p className="font-medium mb-2">{newsTitle}</p>
              <p className="text-text-secondary text-sm">{newsDescription}</p>
            </div>
          </div>
          
          <div className="mb-6">
            <h4 className="text-headline-small font-medium mb-2">Prediction Statement</h4>
            
            {predictionStatement ? (
              <div className="bg-background-secondary/30 rounded-lg p-4">
                <p className="font-medium text-accent-primary">{predictionStatement}</p>
              </div>
            ) : (
              <div className="flex justify-center">
                <button
                  onClick={generatePredictionStatement}
                  disabled={loading}
                  className="px-4 py-2 bg-accent-primary text-white font-medium rounded-lg hover:bg-accent-primary/90 transition-colors disabled:bg-background-tertiary disabled:text-text-secondary"
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Generating...
                    </span>
                  ) : (
                    'Generate Prediction Statement'
                  )}
                </button>
              </div>
            )}
          </div>
          
          {predictionStatement && (
            <div className="flex justify-between">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-background-tertiary/30 text-text-primary font-medium rounded-lg hover:bg-background-tertiary/50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                className="px-4 py-2 bg-accent-green text-white font-medium rounded-lg hover:bg-accent-green/90 transition-colors"
              >
                Create Market
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
