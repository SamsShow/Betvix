import Fastify from 'fastify';
import cors from '@fastify/cors';
import dotenv from 'dotenv';
import { NewsApiClient } from './newsApi';

dotenv.config();

const fastify = Fastify({
  logger: true,
});

// Initialize news API client
const newsApiClient = new NewsApiClient();

// Register CORS
fastify.register(cors, {
  origin: true,
});

// Health check endpoint
fastify.get('/health', async (request, reply) => {
  return { status: 'ok', service: 'ingestion', timestamp: new Date().toISOString() };
});

// Get top news endpoint
fastify.get('/news', async (request, reply) => {
  const { category, country, pageSize } = request.query as {
    category?: string;
    country?: string;
    pageSize?: string;
  };

  try {
    const articles = await newsApiClient.getTopHeadlines(
      category,
      country,
      pageSize ? parseInt(pageSize, 10) : undefined
    );

    return {
      success: true,
      data: articles,
    };
  } catch (error) {
    fastify.log.error(error);
    return {
      success: false,
      error: 'Failed to fetch news',
    };
  }
});

// Search news endpoint
fastify.get('/news/search', async (request, reply) => {
  const { query, from, to, pageSize } = request.query as {
    query?: string;
    from?: string;
    to?: string;
    pageSize?: string;
  };

  if (!query) {
    return reply.code(400).send({
      success: false,
      error: 'Query parameter is required',
    });
  }

  try {
    const articles = await newsApiClient.searchNews(
      query,
      from,
      to,
      pageSize ? parseInt(pageSize, 10) : undefined
    );

    return {
      success: true,
      data: articles,
    };
  } catch (error) {
    fastify.log.error(error);
    return {
      success: false,
      error: 'Failed to search news',
    };
  }
});

// News categories endpoint
fastify.get('/news/categories', async (request, reply) => {
  return {
    success: true,
    data: [
      { id: 'general', name: 'General' },
      { id: 'business', name: 'Business' },
      { id: 'technology', name: 'Technology' },
      { id: 'science', name: 'Science' },
      { id: 'health', name: 'Health' },
      { id: 'sports', name: 'Sports' },
      { id: 'entertainment', name: 'Entertainment' },
      { id: 'crypto', name: 'Cryptocurrency' },
      { id: 'finance', name: 'Finance' },
      { id: 'politics', name: 'Politics' },
    ]
  };
});

// Start server
const start = async () => {
  try {
    const port = process.env.PORT || 3002;
    await fastify.listen({ port: Number(port), host: '0.0.0.0' });
    fastify.log.info(`Ingestion service listening on port ${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();