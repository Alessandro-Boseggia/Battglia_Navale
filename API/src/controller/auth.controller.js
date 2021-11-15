/**
 *
 * @param {import("fastify").FastifyRequest} request
 * @param {import("fastify").FastifyReply} reply
 * @returns
 */
async function login(request, reply) {
    const { username, password } = request.body;
    try {
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
    } catch (error) {
        console.log(error);
        reply.internalServerError(error);
    }
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

const checkDuplicateMail = async (email) => {
    try {
        const { result } = await this.mysqlQuery(querys.login, [email]);

        return result.length >= 1;
    } catch (error) {
        throw new Error(error);
    }
};

const querys = {
    register:
        "INSERT INTO user (email, password, nome, cognome) VALUES (?, ?, ?, ?)",
    login: "SELECT * FROM user WHERE email = ?",
};

export default { login, register, refresh };
