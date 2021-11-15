import fp from "fastify-plugin";
import JWT from "jsonwebtoken";

/**
 *
 * @param {import("fastify").FastifyInstance} fastify
 * @param {*} opts
 */
async function fastyJwt(fastify, opts) {
    const secret = opts.secret ?? "secret";
    let JWTValue = null;

    /**
     *
     * @param {import("fastify").FastifyRequest} request
     * @param {import("fastify").FastifyReply} replay
     */
    async function authJWT(request, replay) {
        const jwt = request.headers.jwt;

        try {
            const validJWT = await JWT.verify(jwt, secret);

            if (validJWT.hasOwnProperty("isRefresh")) throw new Error();
            request.JWT = validJWT;
        } catch (error) {
            replay.unauthorized();
        }
    }

    /**
     *
     * @param {Object} payload
     * @param {import("fastify").FastifyReply} reply
     */
    async function newJWT(payload) {
        return new Promise(async function (resolve, reject) {
            try {
                const refreshPeyload = JSON.parse(JSON.stringify(payload));
                Object.assign(refreshPeyload, { isRefresh: true });

                const promiseResult = await Promise.all([
                    JWT.sign(payload, secret, { expiresIn: 400 }),
                    JWT.sign(refreshPeyload, secret),
                ]);

                const jwt = promiseResult[0];
                const refreshToken = promiseResult[1];

                resolve({ jwt, refreshToken });
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     *
     * @param {import("fastify").FastifyRequest}
     */
    async function refresh(refreshToken) {
        return new Promise(async function (resolve, reject) {
            try {
                let newJwt = await JWT.verify(refreshToken, secret);

                delete newJwt.isRefresh;
                delete newJwt.iat;

                newJwt = await JWT.sign(newJwt, secret, { expiresIn: 400 });
                resolve(newJwt);
            } catch (error) {
                reject(error);
            }
        });
    }

    fastify.decorate("authJWT", authJWT);
    fastify.decorate("newJWT", newJWT);
    fastify.decorate("refresh", refresh);
    fastify.decorateRequest("JWT", JWTValue);
}
export default fp(fastyJwt, { name: "fasty-jwt" });
