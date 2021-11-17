/**
 *
 * @param {import("fastify").FastifyRequest} request
 * @param {import("fastify").FastifyReply} reply
 * @returns
 */
async function login(request, reply) {
    const { username, password } = request.body;

    const { idUser } = await this.mysql.checkUsernameAndPassword(
        username,
        password
    );

    const { jwt, refreshToken } = await this.newJWT({ idUser });

    reply.setCookie("refresh", refreshToken, {
        path: "/",
        httpOnly: true,
        maxAge: 90000000,
        secure: true,
        sameSite: "none",
    });

    reply.send({ jwt });
}

/**
 *
 * @param {import("fastify").FastifyRequest} request
 * @param {import("fastify").FastifyReply} reply
 * @returns
 */
async function register(request, reply) {
    const { username, password } = request.body;

    await this.mysql.insertUser(username, password);

    reply.send();
}

/**
 *
 * @param {import("fastify").FastifyRequest} request
 * @param {import("fastify").FastifyReply} reply
 * @returns
 */
async function refresh(request, reply) {
    try {
        const jwt = await this.refreshFromCookie(request);
        reply.send({ jwt });
    } catch (err) {
        reply.badRequest();
    }
}

export default { login, register, refresh };
