import fastifyCors from "fastify-cors";
import fp from "fastify-plugin";

export default fp(async function (fastify, opts) {
    fastify.register(fastifyCors, {
        credentials: true,
        origin: ["http://127.0.0.1:5500", "https://bigbosestore.netlify.app"],
    });
});
