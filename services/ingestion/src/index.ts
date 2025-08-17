import Fastify from 'fastify';
import cors from '@fastify/cors';
import dotenv from 'dotenv';

dotenv.config();

const fastify = Fastify({
  logger: true,
});

// Health check endpoint
fastify.get('/health', async (request, reply) => {
  return { status: 'ok', service: 'ingestion', timestamp: new Date().toISOString() };
});

// Mock news endpoint
fastify.get('/news', async (request, reply) => {
  return {
    success: true,
    data: [
      {
        id: '1',
        title: 'Bitcoin ETF Approval Expected Soon',
        content: 'SEC considering multiple Bitcoin ETF applications',
        source: 'Reuters',
        publishedAt: new Date().toISOString(),
      },
      {
        id: '2',
        title: 'Federal Reserve Holds Interest Rates Steady',
        content: 'Fed maintains current monetary policy stance',
        source: 'Bloomberg',
        publishedAt: new Date().toISOString(),
      },
    ],
  };
});

// Start server
const start = async () => {
  try {
    // Register CORS
    await fastify.register(cors, {
      origin: true,
    });
    
    const port = process.env.PORT || 3002;
    await fastify.listen({ port: Number(port), host: '0.0.0.0' });
    fastify.log.info(`Ingestion service listening on port ${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
