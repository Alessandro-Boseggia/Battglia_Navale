import fp from "fastify-plugin";
import fastifyRedis from "fastify-redis";

async function redisPlugin(fastify, opts) {
    fastify.register(fastifyRedis, {
        host: "127.0.0.1",
        password: process.env.REDISPWD,
    });
}

export default fp(redisPlugin, { name: "redisPlugin" });
