import Fastify from 'fastify';
import cors from '@fastify/cors';
import dotenv from 'dotenv';

dotenv.config();

const fastify = Fastify({
  logger: true,
});

// Health check endpoint
fastify.get('/health', async (request, reply) => {
  return { status: 'ok', service: 'quote', timestamp: new Date().toISOString() };
});

// Quote calculation endpoint
fastify.post('/quote', async (request, reply) => {
  try {
    const { marketId, side, amount, pools } = request.body as {
      marketId: string;
      side: 'yes' | 'no';
      amount: number;
      pools: { yes: number; no: number };
    };

    if (!marketId || !side || !amount || !pools) {
      return reply.status(400).send({ error: 'Missing required fields' });
    }

    // Simple CPMM calculation
    const { yes, no } = pools;
    const totalPool = yes + no;
    
    let newYes = yes;
    let newNo = no;
    
    if (side === 'yes') {
      newYes += amount;
    } else {
      newNo += amount;
    }
    
    const newTotalPool = newYes + newNo;
    const yesOdds = newNo / newTotalPool;
    const noOdds = newYes / newTotalPool;
    
    // Calculate potential payout (simplified)
    const potentialPayout = side === 'yes' 
      ? (amount * totalPool) / yes + amount
      : (amount * totalPool) / no + amount;

    return {
      success: true,
      data: {
        pre: {
          oddsYes: yes / totalPool,
          oddsNo: no / totalPool,
          pools: { yes, no },
        },
        post: {
          oddsYes: yesOdds,
          oddsNo: noOdds,
          pools: { yes: newYes, no: newNo },
        },
        potentialPayout: Math.round(potentialPayout * 100) / 100,
        fee: { bps: 150, appliedOn: 'winnings' },
      },
    };
  } catch (error) {
    fastify.log.error('Error calculating quote:', error);
    return reply.status(500).send({ 
      error: 'Failed to calculate quote',
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
    
    const port = process.env.PORT || 3004;
    await fastify.listen({ port: Number(port), host: '0.0.0.0' });
    fastify.log.info(`Quote service listening on port ${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
