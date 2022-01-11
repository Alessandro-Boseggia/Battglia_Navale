/**
 *
 * @param {import("fastify").FastifyInstance} fastify
 * @param {*} opts
 */
async function matchmaking(fastify, opts, done) {
    const ws = fastify.io;

    ws.of("/matchmaking").use(fastify.socketAuth);
}

export default matchmaking;
