import fastifyCookie from "fastify-cookie";
import fp from "fastify-plugin";

export default fp(async function (fastify, opts) {
    fastify.register(fastifyCookie);
});
