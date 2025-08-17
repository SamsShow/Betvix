import Fastify from 'fastify';
import cors from '@fastify/cors';
import { GeminiService } from './gemini';
import dotenv from 'dotenv';

dotenv.config();

const fastify = Fastify({
  logger: true,
});

// Initialize Gemini service
const geminiService = new GeminiService(process.env.GOOGLE_AI_API_KEY || '');

// Health check endpoint
fastify.get('/health', async (request, reply) => {
  return { status: 'ok', service: 'nlp', timestamp: new Date().toISOString() };
});

// Generate news capsule endpoint
fastify.post('/generate-capsule', async (request, reply) => {
  try {
    const { headline, context } = request.body as { headline: string; context?: string };
    
    if (!headline) {
      return reply.status(400).send({ error: 'Headline is required' });
    }
    
    const capsule = await geminiService.generateCapsule(headline, context);
    
    return {
      success: true,
      data: capsule,
    };
  } catch (error) {
    fastify.log.error('Error generating capsule:', error);
    return reply.status(500).send({ 
      error: 'Failed to generate capsule',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Generate bet statement endpoint
fastify.post('/generate-bet-statement', async (request, reply) => {
  try {
    const { content } = request.body as { content: string };
    
    if (!content) {
      return reply.status(400).send({ error: 'Content is required' });
    }
    
    const betStatement = await geminiService.generateBetStatement(content);
    
    return {
      success: true,
      data: { betStatement },
    };
  } catch (error) {
    fastify.log.error('Error generating bet statement:', error);
    return reply.status(500).send({ 
      error: 'Failed to generate bet statement',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Classify content endpoint
fastify.post('/classify-content', async (request, reply) => {
  try {
    const { content } = request.body as { content: string };
    
    if (!content) {
      return reply.status(400).send({ error: 'Content is required' });
    }
    
    const classification = await geminiService.classifyContent(content);
    
    return {
      success: true,
      data: classification,
    };
  } catch (error) {
    fastify.log.error('Error classifying content:', error);
    return reply.status(500).send({ 
      error: 'Failed to classify content',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Start server
const start = async () => {
  try {
    // Register CORS
    await fastify.register(cors, {
      origin: true,
    });
    
    const port = process.env.PORT || 3003;
    await fastify.listen({ port: Number(port), host: '0.0.0.0' });
    fastify.log.info(`NLP service listening on port ${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
