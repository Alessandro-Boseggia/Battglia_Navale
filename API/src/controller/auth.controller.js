/**
 *
 * @param {import("fastify").FastifyRequest} request
 * @param {import("fastify").FastifyReply} reply
 */

async function login(request, reply) {
    try {
        const User = this.mysql.User;

        const { username, password } = request.body;

        const { idUser } = await User.checkUsernameAndPassword(
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
    } catch (error) {
        if (error.statusCode === 401) reply.unauthorized();
        reply.internalServerError();
    }
}

/**
 *
 * @param {import("fastify").FastifyRequest} request
 * @param {import("fastify").FastifyReply} reply
 * @returns
 */
async function register(request, reply) {
    try {
        const User = this.mysql.User;

        const { username, password } = request.body;

        await User.insertUser(username, password);

        reply.code(200).send();
    } catch (error) {
        if (error.statusCode === 409) reply.conflict();
        reply.internalServerError();
    }
}

/**
 *
 * @param {import("fastify").FastifyRequest} request
 * @param {import("fastify").FastifyReply} reply
 * @returns
 */
async function refresh(request, reply) {
    const { refresh } = request.cookies;
    try {
        const jwt = await this.refresh(refresh);
        reply.send({ jwt });
    } catch (err) {
        reply.unauthorized();
    }
}

export default { login, register, refresh };
