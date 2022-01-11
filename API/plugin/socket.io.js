import socketIo from "fastify-socket.io";
import fp from "fastify-plugin";

async function socketIOPlugin(fastify, opts) {
    await fastify.register(socketIo);

    const sendToUser = async (username, event, message, namespace = "/") => {
        const { redis } = fastify;
        const userSocketId = await redis.get(username);
        fastify.io.of(namespace).to(userSocketId).emit(event, message);
    };

    const socketAuth = async (socket, next) => {
        const { token } = socket.handshake.auth;
        const { redis } = fastify;

        if (!token) next(new Error("Not authorized"));

        try {
            const { idUser } = await fastify.authJWT(token);

            redis.set(idUser, socket.id);

            fastify.io.user = idUser;

            next();
        } catch (e) {
            next(new Error("Not authorized"));
        }
    };

    fastify.decorate("socketAuth", socketAuth);
    fastify.decorate("socketSendToUser", sendToUser);
}

export default fp(socketIOPlugin, { name: "socketIOPlugin" });
