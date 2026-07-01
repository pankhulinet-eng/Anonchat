import redis from 'redis';

/**
 * Redis Configuration
 */

const client = redis.createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
  socket: {
    reconnectStrategy: (retries) => Math.min(retries * 50, 500),
  },
});

client.on('error', (err) => console.error('Redis Error:', err));
client.on('connect', () => console.log('Redis Connected'));
client.on('disconnect', () => console.log('Redis Disconnected'));

(async () => {
  await client.connect();
})();

export default client;
