import axios from 'axios';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

interface NewsApiResponse {
  status: string;
  totalResults: number;
  articles: Article[];
}

export interface Article {
  source: {
    id: string | null;
    name: string;
  };
  author: string | null;
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
}

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
  betStatement?: string;
}

export class NewsApiClient {
  private apiKey: string;
  private geminiApiKey: string;
  private baseUrl: string = 'https://newsapi.org/v2';
  private genAI: GoogleGenerativeAI | null = null;
  private model: any = null;
  
  constructor() {
    this.apiKey = process.env.NEWS_API_KEY || '';
    this.geminiApiKey = process.env.GEMINI_API_KEY || '';
    
    if (!this.apiKey) {
      console.warn('NEWS_API_KEY not found in environment variables');
    }
    
    if (this.geminiApiKey) {
      try {
        this.genAI = new GoogleGenerativeAI(this.geminiApiKey);
        this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
        console.log('Gemini API initialized successfully');
      } catch (error) {
        console.error('Failed to initialize Gemini API:', error);
      }
    } else {
      console.warn('GEMINI_API_KEY not found in environment variables');
    }
  }

  /**
   * Fetch top headlines from the NewsAPI
   * @param category Optional category (business, entertainment, general, health, science, sports, technology)
   * @param country Optional country code (us, gb, etc.)
   * @param pageSize Number of results to return (default: 10, max: 100)
   */
  async getTopHeadlines(category?: string, country: string = 'us', pageSize: number = 10): Promise<NewsArticle[]> {
    try {
      const params: Record<string, string | number> = {
        country,
        pageSize
      };
      
      if (category) {
        params.category = category;
      }
      
      const response = await axios.get<NewsApiResponse>(`${this.baseUrl}/top-headlines`, {
        params,
        headers: {
          'X-Api-Key': this.apiKey
        }
      });
      
      if (response.data.status !== 'ok') {
        throw new Error(`NewsAPI Error: ${response.data.status}`);
      }
      
      // Map to our internal format
      const articles = this.mapArticlesToNewsArticles(response.data.articles, category || 'general');
      
      // Process with Gemini for enhanced capsules if available
      return await this.processArticlesWithGemini(articles);
    } catch (error) {
      console.error('Error fetching top headlines:', error);
      return this.getFallbackNews(category || 'general');
    }
  }

  /**
   * Search for news articles by keyword
   * @param query Search query
   * @param from Optional start date (YYYY-MM-DD)
   * @param to Optional end date (YYYY-MM-DD)
   * @param pageSize Number of results to return (default: 10, max: 100)
   */
  async searchNews(query: string, from?: string, to?: string, pageSize: number = 10): Promise<NewsArticle[]> {
    try {
      const params: Record<string, string | number> = {
        q: query,
        pageSize
      };
      
      if (from) params.from = from;
      if (to) params.to = to;
      
      const response = await axios.get<NewsApiResponse>(`${this.baseUrl}/everything`, {
        params,
        headers: {
          'X-Api-Key': this.apiKey
        }
      });
      
      if (response.data.status !== 'ok') {
        throw new Error(`NewsAPI Error: ${response.data.status}`);
      }
      
      // Determine category based on query
      const category = this.getCategoryFromQuery(query);
      
      // Map to our internal format
      const articles = this.mapArticlesToNewsArticles(response.data.articles, category);
      
      // Process with Gemini for enhanced capsules if available
      return await this.processArticlesWithGemini(articles);
    } catch (error) {
      console.error('Error searching news:', error);
      return this.getFallbackNews(this.getCategoryFromQuery(query));
    }
  }

  /**
   * Map NewsAPI articles to our internal NewsArticle format
   */
  private mapArticlesToNewsArticles(articles: Article[], category: string): NewsArticle[] {
    return articles.map((article, index) => ({
      id: `news-${Date.now()}-${index}`,
      title: article.title,
      description: article.description || '',
      content: article.content || '',
      source: article.source.name,
      author: article.author,
      url: article.url,
      imageUrl: article.urlToImage,
      publishedAt: article.publishedAt,
      category
    }));
  }

  /**
   * Determine a category from a search query
   */
  private getCategoryFromQuery(query: string): string {
    const query_lower = query.toLowerCase();
    
    if (query_lower.includes('bitcoin') || query_lower.includes('crypto') || 
        query_lower.includes('blockchain') || query_lower.includes('ethereum')) {
      return 'crypto';
    } else if (query_lower.includes('stock') || query_lower.includes('market') || 
              query_lower.includes('economy') || query_lower.includes('finance')) {
      return 'finance';
    } else if (query_lower.includes('politics') || query_lower.includes('government') || 
              query_lower.includes('election')) {
      return 'politics';
    } else if (query_lower.includes('tech') || query_lower.includes('technology') || 
              query_lower.includes('software') || query_lower.includes('ai')) {
      return 'tech';
    } else if (query_lower.includes('sports') || query_lower.includes('football') || 
              query_lower.includes('basketball') || query_lower.includes('soccer')) {
      return 'sports';
    }
    
    return 'general';
  }

  /**
   * Generate a concise news capsule for a news article using Gemini API
   * @param article The news article to summarize
   * @returns NewsArticle with enhanced content
   */
  async generateNewsCapsule(article: NewsArticle): Promise<NewsArticle> {
    // Skip if Gemini API is not initialized or article is already processed
    if (!this.model) {
      return article;
    }
    
    try {
      const prompt = `
        Given this news headline: "${article.title}"
        And description: "${article.description}"
        
        Please create:
        1. Two clear, factual lines explaining the situation (max 120 characters each)
        2. A binary prediction question that can be answered with Yes/No (max 60 characters)
        
        Format as JSON:
        {
          "lines": ["string", "string"],
          "betStatement": "string"
        }
      `;
      
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        try {
          const parsed = JSON.parse(jsonMatch[0]);
          
          // Merge the generated content with the original article
          return {
            ...article,
            content: parsed.lines ? parsed.lines.join(' ') : article.content,
            description: parsed.lines && parsed.lines.length > 0 ? parsed.lines[0] : article.description,
            // Add additional fields that might be useful for the CapsuleCard
            betStatement: parsed.betStatement || `Will ${article.title.replace(/\?$/, '')}?`,
          };
        } catch (error) {
          console.error('Error parsing Gemini response:', error);
        }
      }
    } catch (error) {
      console.error('Error generating capsule with Gemini:', error);
    }
    
    return article;
  }

  /**
   * Process a batch of news articles with Gemini for improved capsule display
   * @param articles The array of news articles to process
   */
  async processArticlesWithGemini(articles: NewsArticle[]): Promise<NewsArticle[]> {
    if (!this.model) {
      return articles;
    }
    
    try {
      // Process articles in sequence to avoid overwhelming the API
      const processedArticles = [];
      
      for (const article of articles) {
        const processed = await this.generateNewsCapsule(article);
        processedArticles.push(processed);
      }
      
      return processedArticles;
    } catch (error) {
      console.error('Error processing articles with Gemini:', error);
      return articles;
    }
  }

  private getFallbackNews(category: string): NewsArticle[] {
    const now = new Date().toISOString();
    
    const fallbackArticles: Record<string, NewsArticle[]> = {
      crypto: [
        {
          id: 'fallback-crypto-1',
          title: 'Bitcoin Price Surges Past $50,000',
          description: 'Bitcoin continues its bullish run, breaking the $50,000 mark for the first time since 2021.',
          content: 'Analysts attribute the price increase to institutional adoption and favorable regulatory environment.',
          source: 'Crypto Today',
          author: 'Crypto Analyst',
          url: 'https://example.com/bitcoin-price',
          imageUrl: null,
          publishedAt: now,
          category: 'crypto'
        },
        {
          id: 'fallback-crypto-2',
          title: 'Ethereum Upgrade Improves Network Scalability',
          description: 'The latest Ethereum protocol upgrade significantly enhances transaction processing speed.',
          content: 'Developers report a 40% increase in transaction throughput following the recent upgrade.',
          source: 'ETH News',
          author: 'Blockchain Reporter',
          url: 'https://example.com/ethereum-upgrade',
          imageUrl: null,
          publishedAt: now,
          category: 'crypto'
        }
      ],
      finance: [
        {
          id: 'fallback-finance-1',
          title: 'Federal Reserve Signals Potential Rate Cut',
          description: 'The Federal Reserve indicates it may consider interest rate cuts in the coming months.',
          content: 'Market analysts anticipate positive impact on equities if the Fed follows through with rate cuts.',
          source: 'Financial Times',
          author: 'Economic Correspondent',
          url: 'https://example.com/fed-rate-cut',
          imageUrl: null,
          publishedAt: now,
          category: 'finance'
        },
        {
          id: 'fallback-finance-2',
          title: 'S&P 500 Reaches New All-Time High',
          description: 'The S&P 500 index closed at a record high, driven by strong tech sector performance.',
          content: 'Technology and AI companies led the gains, with several posting double-digit percentage increases.',
          source: 'Market Watch',
          author: 'Stock Analyst',
          url: 'https://example.com/sp500-record',
          imageUrl: null,
          publishedAt: now,
          category: 'finance'
        }
      ],
      general: [
        {
          id: 'fallback-general-1',
          title: 'Global Climate Summit Concludes With New Agreements',
          description: 'Nations agree to accelerate carbon reduction efforts at international climate conference.',
          content: 'The summit produced commitments to reduce global emissions by 30% by 2030.',
          source: 'Global News',
          author: 'Environmental Reporter',
          url: 'https://example.com/climate-summit',
          imageUrl: null,
          publishedAt: now,
          category: 'general'
        },
        {
          id: 'fallback-general-2',
          title: 'New Study Reveals Benefits of Meditation',
          description: 'Research shows daily meditation practice can reduce stress and improve cognitive function.',
          content: 'The study followed participants over a six-month period, documenting significant improvements.',
          source: 'Health Journal',
          author: 'Medical Researcher',
          url: 'https://example.com/meditation-study',
          imageUrl: null,
          publishedAt: now,
          category: 'general'
        }
      ]
    };
    
    return fallbackArticles[category] || fallbackArticles.general;
  }
}
