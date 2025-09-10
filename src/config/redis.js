import redis from 'redis';

const redisClient = redis.createClient({
    url: `redis://${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || 6379}`,
    password: process.env.REDIS_PASSWORD || undefined,
});

redisClient.on('error', (err) => {
    console.error('Redis Client Error', err);
});

async function connectRedis() {
    if (!redisClient.isOpen) {
        await redisClient.connect();
    }
    return redisClient;
}

export { connectRedis };
export default redisClient;